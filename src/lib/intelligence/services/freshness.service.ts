export interface FreshnessEvidence {
    daysSinceLastInteraction: number;
    lastInteractionType: 'updated' | 'reviewed' | 'verified' | 'imported' | 'none';
    lastInteractionDate: Date | null;
}

export class FreshnessService {
    /**
     * Freshness is evidence (observation). 
     * It simply measures exactly how old the data is and when it was last touched.
     */
    getFreshnessEvidence(
        lastUpdated?: Date | null, 
        lastReviewed?: Date | null, 
        lastVerified?: Date | null,
        lastImported?: Date | null
    ): FreshnessEvidence {
        const events = [
            { type: 'updated', date: lastUpdated },
            { type: 'reviewed', date: lastReviewed },
            { type: 'verified', date: lastVerified },
            { type: 'imported', date: lastImported }
        ].filter(e => e.date != null) as { type: 'updated' | 'reviewed' | 'verified' | 'imported', date: Date }[];

        if (events.length === 0) {
            return {
                daysSinceLastInteraction: -1,
                lastInteractionType: 'none',
                lastInteractionDate: null
            };
        }

        // Sort to find the most recent event
        events.sort((a, b) => b.date.getTime() - a.date.getTime());
        const mostRecent = events[0];
        
        const daysSince = Math.floor((new Date().getTime() - mostRecent.date.getTime()) / (1000 * 3600 * 24));

        return {
            daysSinceLastInteraction: Math.max(0, daysSince),
            lastInteractionType: mostRecent.type,
            lastInteractionDate: mostRecent.date
        };
    }
}
