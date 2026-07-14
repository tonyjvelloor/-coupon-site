import { FreshnessEvidence } from './freshness.service';

export type DecayState = 'Fresh' | 'Current' | 'Aging' | 'Needs Review' | 'Critical';

export class DecayService {
    /**
     * Decay is interpretation. It consumes evidence from FreshnessService and decides the lifecycle state.
     */
    calculateDecayState(evidence: FreshnessEvidence): DecayState {
        if (evidence.lastInteractionType === 'none' || evidence.daysSinceLastInteraction < 0) {
            return 'Needs Review';
        }

        const days = evidence.daysSinceLastInteraction;

        if (days < 7) return 'Fresh';
        if (days < 30) return 'Current';
        if (days < 90) return 'Aging';
        if (days < 180) return 'Needs Review';
        
        return 'Critical';
    }
}
