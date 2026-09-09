import { fuzzy } from 'fast-fuzzy';
import { prisma } from '@/lib/db';

export interface ResolutionSignals {
  externalId: number;
  domain: number;
  alias: number;
  normalizedName: number;
  fuzzy: number;
}

export interface ResolutionResult {
  identityId: string | null;
  suggestedIdentityId: string | null;
  confidence: number;
  signals: ResolutionSignals & { resolverVersion?: string };
  reason: string;
  resolutionSource?: string;
}

export interface ResolveOptions {
  connectorId?: string;
  connectorMerchantId?: string;
  domainContext?: string;
}

export interface CachedStore {
  id: string;
  name: string;
  slug: string;
  website: string;
  normalizedName: string;
  normalizedDomain: string;
  identityId: string;
}

export interface CachedAlias {
  alias: string;
  normalizedAlias: string;
  storeId: string;
  identityId: string;
}

const NORMALIZATION_SUFFIXES = [
  'private limited', 'pvt ltd', 'pvt. ltd.', 'pvt', 'limited', 'ltd', 'ltd.', 
  'llc', 'inc', 'corp', 'corporation', 'com', 'co', 'india', 'in', 'online'
];

const AFFILIATE_TRACKING_DOMAINS = [
  'cuelinks.com', 'clnk.in', 'linksredirect.com', 'impact.com', 'cj.com', 'anrdoezrs.net', 
  'dpbolvw.net', 'tkqlhce.com', 'jdoqocy.com', 'linksynergy.com', 'awin.com'
];

export class MerchantResolver {
  public static readonly VERSION = "v2.0.0";

  // In-memory run-scoped indexed cache
  private storesById = new Map<string, CachedStore>();
  private storesByNormalizedName = new Map<string, CachedStore>();
  private storesBySlug = new Map<string, CachedStore>();
  private storesByDomain = new Map<string, CachedStore>();
  private aliasesByNormalized = new Map<string, CachedAlias>();
  private externalIdMap = new Map<string, string>(); // key: `${connectorId}:${connectorMerchantId}` -> identityId
  private allCachedStores: CachedStore[] = [];
  private isInitialized = false;

  static normalize(input: string): string {
    if (!input) return '';
    let normalized = input.toLowerCase();
    
    // Remove punctuation
    normalized = normalized.replace(/[.,\-\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    
    // Replace multiple spaces with single space
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    // Strip common legal / regional suffixes
    for (const suffix of NORMALIZATION_SUFFIXES) {
      const regex = new RegExp(`\\b${suffix}\\b$`, 'g');
      if (regex.test(normalized)) {
        normalized = normalized.replace(regex, '').trim();
        break; // Only strip one matching suffix from the end
      }
    }
    
    return normalized;
  }

  static normalizeDomain(input: string): string {
    if (!input) return '';
    try {
      const urlString = input.includes('http') ? input : `https://${input}`;
      const url = new URL(urlString);
      let hostname = url.hostname.toLowerCase();
      if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
      }
      return hostname;
    } catch {
      return input.toLowerCase().replace(/^www\./, '').split('/')[0];
    }
  }

  static isAffiliateDomain(domain: string): boolean {
    if (!domain) return false;
    const norm = domain.toLowerCase();
    return AFFILIATE_TRACKING_DOMAINS.some(ad => norm.includes(ad));
  }

  /**
   * Pre-populates the in-memory multidirectional cache for the import run.
   * Runs 1 query per run instead of querying the database hundreds of times.
   */
  async initCache(): Promise<void> {
    if (this.isInitialized) return;

    const [stores, aliases, programs] = await Promise.all([
      prisma.store.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          website: true,
          merchantIdentity: { select: { id: true } }
        }
      }),
      prisma.merchantAlias.findMany({
        select: {
          alias: true,
          normalizedAlias: true,
          merchantId: true,
          merchant: {
            select: {
              merchantIdentity: { select: { id: true } }
            }
          }
        }
      }),
      prisma.affiliateProgram.findMany({
        select: {
          programId: true,
          network: { select: { slug: true } },
          merchant: {
            select: {
              id: true,
              merchantIdentity: { select: { id: true } }
            }
          }
        }
      })
    ]);

    this.allCachedStores = [];

    // Index Stores
    for (const s of stores) {
      let identityId = s.merchantIdentity?.id;
      if (!identityId) {
        // Backfill identity if missing
        const newIdent = await prisma.merchantIdentity.create({
          data: { type: "CANONICAL", canonicalStoreId: s.id }
        });
        identityId = newIdent.id;
      }

      const normalizedName = MerchantResolver.normalize(s.name);
      const normalizedDomain = MerchantResolver.normalizeDomain(s.website || '');

      const cached: CachedStore = {
        id: s.id,
        name: s.name,
        slug: s.slug.toLowerCase(),
        website: s.website || '',
        normalizedName,
        normalizedDomain,
        identityId
      };

      this.storesById.set(s.id, cached);
      this.storesBySlug.set(cached.slug, cached);
      if (normalizedName) this.storesByNormalizedName.set(normalizedName, cached);
      if (normalizedDomain && !MerchantResolver.isAffiliateDomain(normalizedDomain)) {
        this.storesByDomain.set(normalizedDomain, cached);
      }
      this.allCachedStores.push(cached);
    }

    // Index Aliases
    for (const a of aliases) {
      const identityId = a.merchant?.merchantIdentity?.id;
      if (identityId && a.normalizedAlias) {
        this.aliasesByNormalized.set(a.normalizedAlias, {
          alias: a.alias,
          normalizedAlias: a.normalizedAlias,
          storeId: a.merchantId,
          identityId
        });
      }
    }

    // Index External IDs
    for (const p of programs) {
      const identityId = p.merchant?.merchantIdentity?.id;
      if (identityId && p.network?.slug && p.programId) {
        this.externalIdMap.set(`${p.network.slug}:${p.programId}`, identityId);
      }
    }

    this.isInitialized = true;
  }

  /**
   * Resolves a merchant using a strict 5-tier identity hierarchy.
   */
  async resolve(
    merchantName: string, 
    options?: ResolveOptions | string
  ): Promise<ResolutionResult> {
    await this.initCache();

    const opts: ResolveOptions = typeof options === 'string' 
      ? { domainContext: options } 
      : (options || {});

    const signals: ResolutionSignals & { resolverVersion?: string } = {
      externalId: 0,
      domain: 0,
      alias: 0,
      normalizedName: 0,
      fuzzy: 0,
      resolverVersion: MerchantResolver.VERSION
    };

    if (!merchantName && !opts.domainContext && !opts.connectorMerchantId) {
      return { identityId: null, suggestedIdentityId: null, confidence: 0, signals, reason: 'No resolution parameters provided' };
    }

    // TIER 1: Match by Network / External ID
    if (opts.connectorId && opts.connectorMerchantId) {
      const externalKey = `${opts.connectorId}:${opts.connectorMerchantId}`;
      const extMatch = this.externalIdMap.get(externalKey);
      if (extMatch) {
        signals.externalId = 100;
        return { identityId: extMatch, suggestedIdentityId: null, confidence: 100, signals, reason: 'External ID Match', resolutionSource: 'External Network ID' };
      }
    }

    // TIER 2: Match by Normalized Domain (Strongest identity fallback)
    if (opts.domainContext) {
      const normDomain = MerchantResolver.normalizeDomain(opts.domainContext);
      if (normDomain && !MerchantResolver.isAffiliateDomain(normDomain)) {
        const domainStore = this.storesByDomain.get(normDomain);
        if (domainStore) {
          signals.domain = 100;
          return { identityId: domainStore.identityId, suggestedIdentityId: null, confidence: 100, signals, reason: 'Domain Match', resolutionSource: 'Domain' };
        }
      }
    }

    // TIER 3: Match by Normalized Slug or Exact/Normalized Name
    const cleanName = merchantName ? merchantName.trim() : '';
    const searchInput = MerchantResolver.normalize(cleanName);
    const slugInput = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    if (slugInput && this.storesBySlug.has(slugInput)) {
      const store = this.storesBySlug.get(slugInput)!;
      signals.normalizedName = 100;
      return { identityId: store.identityId, suggestedIdentityId: null, confidence: 100, signals, reason: 'Exact Slug Match', resolutionSource: 'Store Slug' };
    }

    if (searchInput && this.storesByNormalizedName.has(searchInput)) {
      const store = this.storesByNormalizedName.get(searchInput)!;
      signals.normalizedName = 100;
      return { identityId: store.identityId, suggestedIdentityId: null, confidence: 100, signals, reason: 'Normalized Name Match', resolutionSource: 'Store Name' };
    }

    // TIER 4: Match by Known Aliases
    if (searchInput && this.aliasesByNormalized.has(searchInput)) {
      const alias = this.aliasesByNormalized.get(searchInput)!;
      signals.alias = 100;
      return { identityId: alias.identityId, suggestedIdentityId: null, confidence: 98, signals, reason: 'Alias Match', resolutionSource: 'Merchant Alias' };
    }

    // TIER 4.5: Symmetrical Fuzzy Match against cached store names
    if (searchInput && this.allCachedStores.length > 0) {
      const fuzzyResults = this.allCachedStores.map(store => {
        const fwd = fuzzy(searchInput, store.normalizedName);
        const rev = fuzzy(store.normalizedName, searchInput);
        const score = Math.round(Math.min(fwd, rev) * 100);
        return { store, score };
      }).sort((a, b) => b.score - a.score);

      const best = fuzzyResults[0];
      signals.fuzzy = best.score;

      if (best.score >= 95) {
        return { identityId: best.store.identityId, suggestedIdentityId: null, confidence: best.score, signals, reason: 'High Confidence Fuzzy Match', resolutionSource: 'Fuzzy' };
      } else if (best.score >= 90) {
        return { identityId: null, suggestedIdentityId: best.store.identityId, confidence: best.score, signals, reason: 'Fuzzy Suggestion', resolutionSource: 'Fuzzy' };
      }
    }

    return { identityId: null, suggestedIdentityId: null, confidence: 0, signals, reason: 'No Match', resolutionSource: 'Unknown' };
  }

  /**
   * Quality-gated, idempotent auto-provisioning of a new canonical Store.
   * Ensures naming and domain variations reuse the same store and prevent duplicate creation.
   */
  async autoProvisionStore(
    merchantName: string, 
    domainOrUrl?: string,
    options?: { connectorId?: string; connectorMerchantId?: string }
  ): Promise<string> {
    await this.initCache();

    const cleanName = (merchantName || '').trim();
    if (!cleanName || cleanName === 'Unknown' || cleanName.length < 2) {
      throw new Error(`Invalid merchant name for auto-provisioning: "${cleanName}"`);
    }

    // Extract clean domain
    let cleanDomain = '';
    if (domainOrUrl) {
      const extracted = MerchantResolver.normalizeDomain(domainOrUrl);
      if (extracted && !MerchantResolver.isAffiliateDomain(extracted)) {
        cleanDomain = extracted;
      }
    }

    const baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // DEDUPLICATION SAFEGUARD 1: Check if store already exists by domain in in-memory cache
    if (cleanDomain && this.storesByDomain.has(cleanDomain)) {
      return this.storesByDomain.get(cleanDomain)!.identityId;
    }

    // DEDUPLICATION SAFEGUARD 2: Check if store already exists by slug in in-memory cache
    if (this.storesBySlug.has(baseSlug)) {
      return this.storesBySlug.get(baseSlug)!.identityId;
    }

    // DEDUPLICATION SAFEGUARD 3: Check normalized name in cache
    const normName = MerchantResolver.normalize(cleanName);
    if (this.storesByNormalizedName.has(normName)) {
      return this.storesByNormalizedName.get(normName)!.identityId;
    }

    // Fallback domain if none extracted
    if (!cleanDomain) {
      cleanDomain = `${baseSlug}.com`;
    }

    // Unique slug check in DB
    let slug = baseSlug;
    const existingDbStore = await prisma.store.findUnique({
      where: { slug },
      include: { merchantIdentity: true }
    });
    if (existingDbStore) {
      let identityId = existingDbStore.merchantIdentity?.id;
      if (!identityId) {
        const ident = await prisma.merchantIdentity.create({
          data: { type: "CANONICAL", canonicalStoreId: existingDbStore.id }
        });
        identityId = ident.id;
      }
      return identityId;
    }

    // Deterministic SEO fields (Month & Year dynamic, zero LLM cost)
    const monthYear = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(new Date());
    const website = `https://${cleanDomain}`;
    const logo = `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`;
    const seoTitle = `${cleanName} Coupons & Offers – ${monthYear}`;
    const seoDescription = `Find the latest verified ${cleanName} coupons, promo codes, and special discounts for ${monthYear}. Save more on your orders today with CouponHub.`;
    const description = `Save more with the latest verified ${cleanName} coupons, discount codes, and special promotional offers on CouponHub.`;

    // Transactional creation of Store + MerchantIdentity + MerchantAlias
    const { identity, store } = await prisma.$transaction(async (tx) => {
      const newStore = await tx.store.create({
        data: {
          name: cleanName,
          slug,
          website,
          logo,
          description,
          seoTitle,
          seoDescription,
          isActive: true,
          activeOfferCount: 0, // Starts at 0 until first verified coupon publishes
          offerCount: 0,
        }
      });

      const newIdentity = await tx.merchantIdentity.create({
        data: {
          type: "CANONICAL",
          canonicalStoreId: newStore.id,
        }
      });

      // Automatically register the exact name as alias
      await tx.merchantAlias.create({
        data: {
          merchantId: newStore.id,
          alias: cleanName,
          normalizedAlias: normName,
          source: options?.connectorId || "auto-provision",
          confidence: 100,
        }
      });

      // Link external program if network details provided
      if (options?.connectorId && options?.connectorMerchantId) {
        const network = await tx.affiliateNetwork.findFirst({
          where: { slug: options.connectorId }
        });
        if (network) {
          await tx.affiliateProgram.create({
            data: {
              merchantId: newStore.id,
              networkId: network.id,
              programId: options.connectorMerchantId,
              commissionType: "CPA",
              commissionRate: "Standard",
              cookieDuration: 30,
              status: "active"
            }
          });
        }
      }

      return { identity: newIdentity, store: newStore };
    });

    // Update in-memory cache so all subsequent items in this run match in O(1)
    const cached: CachedStore = {
      id: store.id,
      name: store.name,
      slug: store.slug,
      website: store.website,
      normalizedName: normName,
      normalizedDomain: cleanDomain,
      identityId: identity.id
    };

    this.storesById.set(store.id, cached);
    this.storesBySlug.set(store.slug, cached);
    this.storesByNormalizedName.set(normName, cached);
    this.storesByDomain.set(cleanDomain, cached);
    this.allCachedStores.push(cached);

    if (options?.connectorId && options?.connectorMerchantId) {
      this.externalIdMap.set(`${options.connectorId}:${options.connectorMerchantId}`, identity.id);
    }

    return identity.id;
  }
}
