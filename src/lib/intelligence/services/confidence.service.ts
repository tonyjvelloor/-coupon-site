import { DecayState } from './decay.service';

export interface ConfidenceResult {
    score: number;
    reasons: string[];
}

export class ConfidenceService {
    /**
     * Dynamically computes the Knowledge Confidence (0-100) based on observable traits.
     */
    calculateConfidence(
        decayState: DecayState, 
        hasEditorReview: boolean, 
        source: 'human' | 'ai' | 'import' = 'human'
    ): ConfidenceResult {
        let confidence = 100;
        const reasons = [];

        // 1. Penalty for decay
        switch (decayState) {
            case 'Fresh': 
                reasons.push("Fresh data (+0)");
                break;
            case 'Current': 
                confidence -= 5; 
                reasons.push("Data is Current (-5)");
                break;
            case 'Aging': 
                confidence -= 15; 
                reasons.push("Aging data (-15)");
                break;
            case 'Needs Review': 
                confidence -= 30; 
                reasons.push("Needs Review (-30)");
                break;
            case 'Critical': 
                confidence -= 50; 
                reasons.push("Critically Stale (-50)");
                break;
        }

        // 2. Source penalty
        if (source === 'ai') {
            confidence -= 10;
            reasons.push("AI Generated (-10)");
        } else if (source === 'import') {
            confidence -= 20;
            reasons.push("Bulk Imported (-20)");
        } else {
            reasons.push("Human Authored (+0)");
        }

        // 3. Editor review boost
        if (hasEditorReview && source !== 'human') {
            confidence += 15; 
            reasons.push("Editor Verified (+15)");
        }

        const score = Math.max(0, Math.min(100, confidence));
        return { score, reasons };
    }
}
