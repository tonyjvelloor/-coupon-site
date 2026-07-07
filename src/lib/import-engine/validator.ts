import { NormalizedOffer, ValidationError } from "./types";
import { RuleEngine, requireTitleRule, requireAffiliateUrlRule, validExpiryDateRule, ValidationContext } from "./rules";

const defaultRuleEngine = new RuleEngine([
  requireTitleRule,
  requireAffiliateUrlRule,
  validExpiryDateRule
]);

/**
 * Validator evaluates a NormalizedOffer against all business rules.
 */
export class Validator {
  private engine: RuleEngine;

  constructor(engine: RuleEngine = defaultRuleEngine) {
    this.engine = engine;
  }

  /**
   * Run validation against an offer.
   */
  async validate(offer: NormalizedOffer, contextData: Omit<ValidationContext, 'offer'> = {}): Promise<ValidationError[]> {
    const context: ValidationContext = {
      offer,
      ...contextData
    };
    
    return this.engine.execute(context);
  }
}
