import { FeatureVector } from "./services/feature.service";
import { StrategyCondition } from "@prisma/client";

/**
 * Compares a target condition set against a real merchant feature vector.
 * Returns a detailed similarity breakdown and an overall score (0.0 to 1.0).
 */
export function calculateSimilarity(features: FeatureVector, targetConditions: StrategyCondition[]) {
    const breakdown: Record<string, number> = {};
    let totalScore = 0;
    let keysCount = 0;

    for (const condition of targetConditions) {
        const { field, operator, value } = condition;
        let score = 0;
        const featureValue = (features as any)[field];

        if (field === "categorySlugs") {
            const actuals = featureValue as string[];
            score = actuals?.includes(value) ? 1.0 : 0.0;
        } 
        else if (field === "merchantSize") {
            const sizes = ["SMALL", "MEDIUM", "LARGE"];
            const targetIdx = sizes.indexOf(value);
            const actualIdx = sizes.indexOf(featureValue as string);
            if (targetIdx === actualIdx) score = 1.0;
            else if (Math.abs(targetIdx - actualIdx) === 1) score = 0.5; // Adjacent size
            else score = 0.0;
        }
        else if (typeof featureValue === "number") {
            const numValue = Number(value);
            if (operator === '<') {
                score = featureValue < numValue ? 1.0 : (Math.max(0, 1 - Math.abs(featureValue - numValue)/100));
            } else if (operator === '>') {
                score = featureValue > numValue ? 1.0 : (Math.max(0, 1 - Math.abs(featureValue - numValue)/100));
            } else {
                const diff = Math.abs(numValue - featureValue);
                score = Math.max(0, 1 - (diff / 100)); 
            }
        }
        else if (typeof featureValue === "boolean") {
            score = (value === 'true') === featureValue ? 1.0 : 0.0;
        }
        else {
            score = value === featureValue ? 1.0 : 0.0;
        }

        breakdown[field] = score;
        totalScore += score;
        keysCount++;
    }

    const overallSimilarity = keysCount > 0 ? totalScore / keysCount : 0;

    return {
        overall: overallSimilarity,
        breakdown
    };
}
