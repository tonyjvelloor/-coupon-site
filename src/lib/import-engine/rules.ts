import { NormalizedOffer, ValidationError } from "./types";

export interface ValidationContext {
  offer: NormalizedOffer;
  existingCoupons?: Array<{ affiliateUrl: string; code?: string | null; storeId: string }>;
  existingStores?: Array<{ name: string; id: string }>;
}

export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  severity: "error" | "warning" | "info";
  /**
   * Evaluate the rule. Returns true if the offer PASSES the rule, false if it FAILS.
   */
  evaluate(context: ValidationContext): boolean;
  
  /**
   * Generates the error to be returned if evaluate() returns false.
   */
  getError(context: ValidationContext): ValidationError;
}

/**
 * The RuleEngine executes a suite of configured rules against a NormalizedOffer.
 */
export class RuleEngine {
  private rules: ValidationRule[] = [];

  constructor(rules: ValidationRule[] = []) {
    this.rules = rules;
  }

  addRule(rule: ValidationRule) {
    this.rules.push(rule);
  }

  execute(context: ValidationContext): ValidationError[] {
    const errors: ValidationError[] = [];
    
    for (const rule of this.rules) {
      if (!rule.evaluate(context)) {
        errors.push(rule.getError(context));
      }
    }
    
    return errors;
  }
}

// ============================================================================
// Built-in Rules
// ============================================================================

export const requireTitleRule: ValidationRule = {
  id: "REQ_TITLE",
  name: "Require Title",
  description: "Offer must have a title to be published.",
  severity: "error",
  evaluate: (ctx) => !!ctx.offer.title && ctx.offer.title.trim().length > 0,
  getError: () => ({
    field: "title",
    severity: "error",
    code: "MISSING_TITLE",
    message: "A title is required.",
  }),
};

export const requireAffiliateUrlRule: ValidationRule = {
  id: "REQ_AFFILIATE_URL",
  name: "Require Affiliate URL",
  description: "Offer must have a tracking link.",
  severity: "error",
  evaluate: (ctx) => !!ctx.offer.affiliateUrl && ctx.offer.affiliateUrl.trim().length > 0,
  getError: () => ({
    field: "affiliateUrl",
    severity: "error",
    code: "MISSING_AFFILIATE_URL",
    message: "An affiliate tracking URL is required.",
  }),
};

export const validExpiryDateRule: ValidationRule = {
  id: "VALID_EXPIRY",
  name: "Valid Expiry Date",
  description: "If an expiry date is provided, it must be in the future.",
  severity: "error",
  evaluate: (ctx) => {
    if (!ctx.offer.expiry) return true;
    const now = new Date();
    return new Date(ctx.offer.expiry) > now;
  },
  getError: () => ({
    field: "expiry",
    severity: "error",
    code: "EXPIRED",
    message: "The expiry date is in the past.",
  }),
};
