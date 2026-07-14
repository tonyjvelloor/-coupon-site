import { FeatureVector } from "./services/feature.service";

/**
 * Compares a target condition set against a real merchant feature vector.
 * Returns a detailed similarity breakdown and an overall score (0.0 to 1.0).
 */
export function calculateSimilarity(features: FeatureVector, targetConditions: Partial<FeatureVector>) {
    const breakdown: Record<string, number> = {};
    let totalScore = 0;
    let keysCount = 0;

    for (const [key, targetValue] of Object.entries(targetConditions)) {
        let score = 0;
        const featureValue = (features as any)[key];

        if (key === "categorySlugs") {
            const targets = targetValue as string[];
            const actuals = featureValue as string[];
            // If they share any category, it's a match. (Or we could do Jaccard index)
            const intersection = targets.filter(t => actuals.includes(t));
            score = intersection.length > 0 ? 1.0 : 0.0;
        } 
        else if (key === "merchantSize") {
            const sizes = ["SMALL", "MEDIUM", "LARGE"];
            const targetIdx = sizes.indexOf(targetValue as string);
            const actualIdx = sizes.indexOf(featureValue as string);
            if (targetIdx === actualIdx) score = 1.0;
            else if (Math.abs(targetIdx - actualIdx) === 1) score = 0.5; // Adjacent size
            else score = 0.0;
        }
        else if (typeof targetValue === "number" && typeof featureValue === "number") {
            // For numbers like authority, calculate proximity
            // Assume 0-100 scale for things like authority
            const diff = Math.abs(targetValue - featureValue);
            // Example: diff of 20 = 0.8 score.
            score = Math.max(0, 1 - (diff / 100)); 
        }
        else if (typeof targetValue === "boolean") {
            score = targetValue === featureValue ? 1.0 : 0.0;
        }
        else if (targetValue === featureValue) {
            score = 1.0;
        }

        breakdown[key] = score;
        totalScore += score;
        keysCount++;
    }

    const overallSimilarity = keysCount > 0 ? totalScore / keysCount : 0;

    return {
        overall: overallSimilarity,
        breakdown
    };
}
