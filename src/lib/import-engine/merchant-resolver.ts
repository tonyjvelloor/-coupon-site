import { fuzzy } from 'fast-fuzzy';
import { prisma } from '@/lib/db';

export interface ResolutionSignals {
  domain: number;
  alias: number;
  normalizedName: number;
  fuzzy: number;
}

export interface ResolutionResult {
  storeId: string | null;
  suggestedStoreId: string | null;
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
  public static readonly VERSION = "v1.0.0";

  
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

  // Domain normalizer extracts root domain e.g. "https://www.amazon.in/foo" -> "amazon.in"
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

  async resolve(merchantName: string, domainContext?: string): Promise<ResolutionResult> {
    const signals: ResolutionSignals & { resolverVersion?: string } = { domain: 0, alias: 0, normalizedName: 0, fuzzy: 0, resolverVersion: MerchantResolver.VERSION };
    
    if (!merchantName) {
      return { storeId: null, suggestedStoreId: null, confidence: 0, signals, reason: 'No merchant name provided' };
    }

    // STAGE 1: Exact Match (Name or Slug)
    const exactStore = await prisma.store.findFirst({
      where: {
        OR: [
          { name: { equals: merchantName, mode: 'insensitive' } },
          { slug: { equals: merchantName, mode: 'insensitive' } }
        ]
      },
      select: { id: true, name: true }
    });

    if (exactStore) {
      signals.normalizedName = 100;
      return { storeId: exactStore.id, suggestedStoreId: null, confidence: 100, signals, reason: 'Exact Name Match', resolutionSource: 'Exact' };
    }

    // STAGE 2: Alias Match
    const normalizedAliasInput = MerchantResolver.normalize(merchantName);
    const aliasMatch = await prisma.merchantAlias.findFirst({
      where: {
        OR: [
          { alias: { equals: merchantName, mode: 'insensitive' } },
          { normalizedAlias: { equals: normalizedAliasInput, mode: 'insensitive' } }
        ]
      },
      include: { merchant: true },
      orderBy: { confidence: 'desc' }
    });

    if (aliasMatch) {
      signals.alias = aliasMatch.confidence;
      // Fire-and-forget: update lastSeenAt
      prisma.merchantAlias.update({ where: { id: aliasMatch.id }, data: { lastSeenAt: new Date() } }).catch(() => {});
      
      if (aliasMatch.confidence >= 98) {
        return { storeId: aliasMatch.merchantId, suggestedStoreId: null, confidence: aliasMatch.confidence, signals, reason: 'Alias Match', resolutionSource: 'Alias' };
      } else {
        return { storeId: null, suggestedStoreId: aliasMatch.merchantId, confidence: aliasMatch.confidence, signals, reason: 'Low Confidence Alias Match', resolutionSource: 'Alias' };
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
        signals.domain = 98; // Very high confidence per user spec
        return { storeId: domainStore.id, suggestedStoreId: null, confidence: 98, signals, reason: 'Domain Match', resolutionSource: 'Domain' };
      }
    }

    // STAGE 4: Normalize & Fuzzy Match
    // In a real huge database, we might cache this or search differently, but for now we fetch all stores
    const allStores = await prisma.store.findMany({ select: { id: true, name: true } });
    if (allStores.length === 0) {
      return { storeId: null, suggestedStoreId: null, confidence: 0, signals, reason: 'No stores in database', resolutionSource: 'Unknown' };
    }

    const searchInput = MerchantResolver.normalize(merchantName);
    
    // Check if normalized matches any store's normalized name exactly
    const exactNorm = allStores.find(s => MerchantResolver.normalize(s.name) === searchInput);
    if (exactNorm) {
      signals.normalizedName = 98;
      return { storeId: exactNorm.id, suggestedStoreId: null, confidence: 98, signals, reason: 'Normalized Name Match', resolutionSource: 'Fuzzy' };
    }

    // Fuzzy Search using fast-fuzzy
    const fuzzyResults = allStores.map(store => {
      const storeNorm = MerchantResolver.normalize(store.name);
      // fast-fuzzy returns 0 to 1
      const score = Math.round(fuzzy(searchInput, storeNorm) * 100);
      return { id: store.id, score, name: store.name };
    }).sort((a, b) => b.score - a.score);

    const bestMatch = fuzzyResults[0];
    signals.fuzzy = bestMatch.score;

    if (bestMatch.score >= 98) {
      return { storeId: bestMatch.id, suggestedStoreId: null, confidence: bestMatch.score, signals, reason: 'High Confidence Fuzzy Match', resolutionSource: 'Fuzzy' };
    } else if (bestMatch.score >= 90) {
      return { storeId: null, suggestedStoreId: bestMatch.id, confidence: bestMatch.score, signals, reason: 'Fuzzy Suggestion', resolutionSource: 'Fuzzy' };
    }

    // Below 90% goes to manual review without auto suggestion
    return { storeId: null, suggestedStoreId: null, confidence: bestMatch.score, signals, reason: 'No Match', resolutionSource: 'Unknown' };
  }
}
