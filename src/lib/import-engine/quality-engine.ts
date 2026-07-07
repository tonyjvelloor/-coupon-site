import { NormalizedOffer, QualityMetrics, ValidationError } from "./types";
import { DuplicateResult } from "./deduplicator";

export class QualityEngine {
  /**
   * Computes the final quality score for an imported offer by analyzing all signals.
   */
  evaluate(
    offer: NormalizedOffer,
    validationErrors: ValidationError[],
    duplicateResult: DuplicateResult,
    storeId?: string
  ): QualityMetrics {
    
    // 1. Completeness Score (0-100)
    // Points for having descriptive fields beyond the bare minimum
    let completeness = 50; // Base score for having the required fields
    if (offer.description && offer.description.length > 20) completeness += 20;
    if (offer.discountValue) completeness += 10;
    if (offer.category) completeness += 10;
    if (offer.expiry) completeness += 10;
    completeness = Math.min(100, Math.max(0, completeness));

    // 2. Validation Score (0-100)
    // 100 minus penalty for errors
    let validation = 100;
    for (const error of validationErrors) {
      if (error.severity === "error") validation -= 50;
      if (error.severity === "warning") validation -= 10;
    }
    validation = Math.min(100, Math.max(0, validation));

    // 3. Freshness Score (0-100)
    // Recent expiry dates are good.
    let freshness = 50; // default for no expiry
    if (offer.expiry) {
      const now = new Date();
      const expiry = new Date(offer.expiry);
      const daysUntilExpiry = (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysUntilExpiry > 0 && daysUntilExpiry <= 30) freshness = 100; // Optimal urgency
      else if (daysUntilExpiry > 30 && daysUntilExpiry <= 180) freshness = 80;
      else if (daysUntilExpiry > 180) freshness = 60; // Very long expiry, low urgency
      else freshness = 0; // Expired
    }

    // 4. Merchant Match Score (0-100)
    let merchantMatch = storeId ? 100 : 0; // Did we find a matching store in DB?

    // 5. Duplicate Risk (0-100, lower is better but we store the risk magnitude here)
    const duplicateRisk = duplicateResult.riskScore;

    // 6. Confidence Score
    // Aggregate of Validation and Merchant Match
    const confidence = (validation * 0.7) + (merchantMatch * 0.3);

    // 7. Final Score (0-100)
    // Heavily penalize high duplicate risk and low validation.
    let finalScore = (
      (completeness * 0.2) +
      (confidence * 0.4) +
      (freshness * 0.2) +
      ((100 - duplicateRisk) * 0.2)
    );
    
    // Hard penalties
    if (validation < 50) finalScore = Math.min(finalScore, 40); // Cap at 40 if critical validation fails
    if (duplicateRisk >= 90) finalScore = Math.min(finalScore, 30); // Cap at 30 if exact duplicate
    if (merchantMatch === 0) finalScore = Math.min(finalScore, 50); // Cap at 50 if orphan offer

    return {
      completeness: Math.round(completeness),
      validation: Math.round(validation),
      confidence: Math.round(confidence),
      freshness: Math.round(freshness),
      merchantMatch: Math.round(merchantMatch),
      duplicateRisk: Math.round(duplicateRisk),
      finalScore: Math.round(finalScore)
    };
  }
}
