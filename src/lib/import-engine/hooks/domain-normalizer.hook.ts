import { EnrichmentHook, NormalizedOffer } from "../types";

export class DomainNormalizerHook implements EnrichmentHook {
    id = "domain-normalizer";
    name = "Domain Normalizer";

    async execute(offer: NormalizedOffer): Promise<NormalizedOffer> {
        if (offer.destinationUrl) {
            try {
                const url = new URL(offer.destinationUrl);
                // In a real implementation, you might strip query params or normalize www
                const hostname = url.hostname.replace(/^www\./, "");
                
                // You could use this to hint the MerchantResolver
                // offer.inferredDomain = hostname; 
            } catch (e) {
                // Ignore invalid URLs
            }
        }
        return offer;
    }
}
