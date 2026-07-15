import { fuzzy } from 'fast-fuzzy';
import { prisma } from '@/lib/db';

export interface ResolutionSignals {
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

const NORMALIZATION_SUFFIXES = [
  'private limited', 'pvt ltd', 'pvt. ltd.', 'pvt', 'limited', 'ltd', 'ltd.', 
  'llc', 'inc', 'corp', 'corporation', 'com', 'co'
];

export class MerchantResolver {
  public static readonly VERSION = "v1.1.0";

  static normalize(input: string): string {
    if (!input) return '';
    let normalized = input.toLowerCase();
    
    // Remove punctuation
    normalized = normalized.replace(/[.,\-\/#!$%\^&\*;:{}=\-_`~()]/g, ' ');
    
    // Replace multiple spaces with single space
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    // Strip common legal suffixes
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
      const urlString = input.includes('http') ? input : `http://${input}`;
      const url = new URL(urlString);
      let hostname = url.hostname.toLowerCase();
      if (hostname.startsWith('www.')) {
        hostname = hostname.slice(4);
      }
      return hostname;
    } catch {
      return input.toLowerCase();
    }
  }

  private async ensureIdentity(storeId?: string, candidateId?: string): Promise<string> {
    if (storeId) {
      const store = await prisma.store.findUnique({ where: { id: storeId }, include: { merchantIdentity: true } });
      if (store?.merchantIdentity) return store.merchantIdentity.id;
      // Auto-backfill for existing stores
      const newIdentity = await prisma.merchantIdentity.create({
        data: {
          type: "CANONICAL",
          canonicalStoreId: storeId,
        }
      });
      return newIdentity.id;
    } else if (candidateId) {
      const candidate = await prisma.merchantCandidate.findUnique({ where: { id: candidateId }, include: { identity: true } });
      if (candidate?.identity) return candidate.identity.id;
      const newIdentity = await prisma.merchantIdentity.create({
        data: {
          type: "CANDIDATE",
          candidateId: candidateId,
        }
      });
      return newIdentity.id;
    }
    throw new Error("Must provide storeId or candidateId");
  }

  async resolve(merchantName: string, domainContext?: string): Promise<ResolutionResult> {
    const signals: ResolutionSignals & { resolverVersion?: string } = { domain: 0, alias: 0, normalizedName: 0, fuzzy: 0, resolverVersion: MerchantResolver.VERSION };
    
    if (!merchantName) {
      return { identityId: null, suggestedIdentityId: null, confidence: 0, signals, reason: 'No merchant name provided' };
    }

    // STAGE 1: Exact Match (Store Name or Slug)
    const exactStore = await prisma.store.findFirst({
      where: {
        OR: [
          { name: { equals: merchantName, mode: 'insensitive' } },
          { slug: { equals: merchantName, mode: 'insensitive' } }
        ]
      },
      select: { id: true }
    });

    if (exactStore) {
      signals.normalizedName = 100;
      const identityId = await this.ensureIdentity(exactStore.id, undefined);
      return { identityId, suggestedIdentityId: null, confidence: 100, signals, reason: 'Exact Name Match', resolutionSource: 'Exact Store' };
    }

    // STAGE 1b: Exact Match (Candidate Name)
    const exactCandidate = await prisma.merchantCandidate.findFirst({
      where: { name: { equals: merchantName, mode: 'insensitive' } },
      select: { id: true }
    });

    if (exactCandidate) {
      signals.normalizedName = 100;
      const identityId = await this.ensureIdentity(undefined, exactCandidate.id);
      return { identityId, suggestedIdentityId: null, confidence: 100, signals, reason: 'Exact Name Match', resolutionSource: 'Exact Candidate' };
    }

    // STAGE 2: Alias Match (Only checks stores for now)
    const normalizedAliasInput = MerchantResolver.normalize(merchantName);
    const aliasMatch = await prisma.merchantAlias.findFirst({
      where: {
        OR: [
          { alias: { equals: merchantName, mode: 'insensitive' } },
          { normalizedAlias: { equals: normalizedAliasInput, mode: 'insensitive' } }
        ]
      },
      orderBy: { confidence: 'desc' }
    });

    if (aliasMatch) {
      signals.alias = aliasMatch.confidence;
      prisma.merchantAlias.update({ where: { id: aliasMatch.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
      
      const identityId = await this.ensureIdentity(aliasMatch.merchantId, undefined);

      if (aliasMatch.confidence >= 98) {
        return { identityId, suggestedIdentityId: null, confidence: aliasMatch.confidence, signals, reason: 'Alias Match', resolutionSource: 'Alias' };
      } else {
        return { identityId: null, suggestedIdentityId: identityId, confidence: aliasMatch.confidence, signals, reason: 'Low Confidence Alias Match', resolutionSource: 'Alias' };
      }
    }

    // STAGE 3: Domain Match
    if (domainContext) {
      const normDomain = MerchantResolver.normalizeDomain(domainContext);
      const domainStore = await prisma.store.findFirst({
        where: { website: { contains: normDomain, mode: 'insensitive' } },
        select: { id: true }
      });
      if (domainStore) {
        signals.domain = 98;
        const identityId = await this.ensureIdentity(domainStore.id, undefined);
        return { identityId, suggestedIdentityId: null, confidence: 98, signals, reason: 'Domain Match', resolutionSource: 'Domain Store' };
      }

      const domainCandidate = await prisma.merchantCandidate.findFirst({
        where: { website: { contains: normDomain, mode: 'insensitive' } },
        select: { id: true }
      });
      if (domainCandidate) {
        signals.domain = 98;
        const identityId = await this.ensureIdentity(undefined, domainCandidate.id);
        return { identityId, suggestedIdentityId: null, confidence: 98, signals, reason: 'Domain Match', resolutionSource: 'Domain Candidate' };
      }
    }

    // STAGE 4: Normalize & Fuzzy Match
    const allStores = await prisma.store.findMany({ select: { id: true, name: true } });
    const allCandidates = await prisma.merchantCandidate.findMany({ select: { id: true, name: true } });
    
    const combined = [
      ...allStores.map(s => ({ ...s, isStore: true })),
      ...allCandidates.map(c => ({ ...c, isStore: false }))
    ];

    if (combined.length === 0) {
      return { identityId: null, suggestedIdentityId: null, confidence: 0, signals, reason: 'No entities in database', resolutionSource: 'Unknown' };
    }

    const searchInput = MerchantResolver.normalize(merchantName);
    
    const exactNorm = combined.find(s => MerchantResolver.normalize(s.name) === searchInput);
    if (exactNorm) {
      signals.normalizedName = 98;
      const identityId = await this.ensureIdentity(exactNorm.isStore ? exactNorm.id : undefined, exactNorm.isStore ? undefined : exactNorm.id);
      return { identityId, suggestedIdentityId: null, confidence: 98, signals, reason: 'Normalized Name Match', resolutionSource: 'Fuzzy' };
    }

    const fuzzyResults = combined.map(entity => {
      const entityNorm = MerchantResolver.normalize(entity.name);
      const score = Math.round(fuzzy(searchInput, entityNorm) * 100);
      return { ...entity, score };
    }).sort((a, b) => b.score - a.score);

    const bestMatch = fuzzyResults[0];
    signals.fuzzy = bestMatch.score;

    let matchIdentityId: string | null = null;
    if (bestMatch.score >= 90) {
      matchIdentityId = await this.ensureIdentity(bestMatch.isStore ? bestMatch.id : undefined, bestMatch.isStore ? undefined : bestMatch.id);
    }

    if (bestMatch.score >= 98) {
      return { identityId: matchIdentityId, suggestedIdentityId: null, confidence: bestMatch.score, signals, reason: 'High Confidence Fuzzy Match', resolutionSource: 'Fuzzy' };
    } else if (bestMatch.score >= 90) {
      return { identityId: null, suggestedIdentityId: matchIdentityId, confidence: bestMatch.score, signals, reason: 'Fuzzy Suggestion', resolutionSource: 'Fuzzy' };
    }

    return { identityId: null, suggestedIdentityId: null, confidence: bestMatch.score, signals, reason: 'No Match', resolutionSource: 'Unknown' };
  }
}
