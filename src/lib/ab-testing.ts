import { cookies } from "next/headers";

export const EXPERIMENTS = {
    HOME_HERO_COPY: {
        id: "exp_home_hero_copy_v1",
        variants: ["control", "variant_b"],
        weights: [0.5, 0.5] // 50/50 split
    },
    // Future experiments can be added here
};

export type ExperimentId = keyof typeof EXPERIMENTS;

/**
 * Deterministically assign a user to a variant based on their device ID.
 * Falls back to random assignment if no ID provided.
 */
function assignVariant(experiment: typeof EXPERIMENTS[ExperimentId], userId?: string): string {
    if (!userId) {
        const rand = Math.random();
        let cumulative = 0;
        for (let i = 0; i < experiment.weights.length; i++) {
            cumulative += experiment.weights[i];
            if (rand < cumulative) {
                return experiment.variants[i];
            }
        }
        return experiment.variants[0];
    }

    // Simple deterministic hash of user ID + experiment ID
    let hash = 0;
    const str = `${userId}:${experiment.id}`;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    
    // Normalize to 0-1
    const normalizedHash = Math.abs(hash) / 2147483647; // Max 32-bit int
    
    let cumulative = 0;
    for (let i = 0; i < experiment.weights.length; i++) {
        cumulative += experiment.weights[i];
        if (normalizedHash < cumulative) {
            return experiment.variants[i];
        }
    }
    return experiment.variants[0];
}

/**
 * Gets the variant for a user. Call this from Server Components.
 */
export async function getExperimentVariant(experimentId: ExperimentId): Promise<string> {
    const experiment = EXPERIMENTS[experimentId];
    if (!experiment) return "control";

    const cookieStore = await cookies();
    
    // First, check if there's already a saved variant for this specific experiment
    const savedVariant = cookieStore.get(`ch_exp_${experiment.id}`)?.value;
    if (savedVariant && experiment.variants.includes(savedVariant)) {
        return savedVariant;
    }

    // Fallback: use the global device ID to assign one deterministically
    const deviceId = cookieStore.get("ch_device_id")?.value;
    return assignVariant(experiment, deviceId);
}
