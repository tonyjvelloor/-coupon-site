# Architecture Foundation & Governance

## 1. Vision & Product Promise
> CouponHub helps you buy at the right place, at the right time, using the right offer.

This single sentence encompasses everything we build: coupons, cashback, bank offers, shopping strategies, buying guides, merchant knowledge, policies, and AI recommendations. It differentiates CouponHub from sites that only list coupon codes. The coupons bring users in, but the complete shopping decision experience gives them a reason to return.

## 2. Product Philosophy
- **Don't Make Users Think**: Every screen must answer three questions within five seconds: What am I looking at? Can I trust this? What should I do next?
- **Show Answers, Reveal Evidence**: Users see recommendations first and supporting details second. Every recommendation must be backed by transparent evidence.
- **Guide, Don't Catalog**: Don't present information as a directory of coupons. Guide users toward the best shopping decision with clear recommendations.
- Decision Speed over Information Volume
- Trust before Revenue
- Knowledge compounds
- Evidence over claims
- Intelligence over aggregation

## 3. UX Principles (CX v1.0)
These rules dictate the consumer experience across the entire product:
1. **Intent First**: Always satisfy the reason the user arrived instantly (e.g. search for coupon -> show coupon).
2. **Action First**: Every page has one dominant action. (e.g. Merchant Page -> Copy Best Coupon).
3. **Evidence Before Marketing**: Facts beat adjectives (e.g. "18 Verified Offers" instead of "Best Deals").
4. **Progressive Disclosure**: Show the Best Coupon before the Shipping Policy. Show Expected Savings before how we calculated it.

## 4. Architecture Principles
The core architecture is now **FROZEN**.
The following aggregates and foundational layers are locked:
- Merchant Identity
- Connector Framework
- Knowledge Graph
- Repository Layer
- Commerce Decision Platform

The following may evolve:
- Strategies
- Rules
- Workers
- Connectors (plugins)
- UI
- Knowledge Assets

## 4. Domain Boundaries
Responsibilities are strictly isolated to prevent long-term data quality issues.
**Merchant owns:**
- Identity
- Knowledge
- Authority
- Timeline

**Coupons own:**
- Offer details
- Discount
- Expiry
- Tracking parameters

*No crossing responsibilities.* A Store does not own a Coupon directly; it belongs to a `MerchantIdentity`.

## 5. Extension Rules
We strictly follow a composition-first rule for all new features.
**Prefer:**
- Rule
- Worker
- Connector
- Strategy
- Repository
- Service

**Over:**
- Schema modifications
- Core code rewrites
- Inheritance hierarchies
- Framework forks

## 6. Architecture Freeze Policy
Any changes to the foundational architecture require explicit approval via an Architecture Decision Record (ADR).
This includes:
- Changing the Prisma schema
- Changing the AffiliateConnector interface
- Changing the MerchantIdentity model
- Changing Repository contracts

## 7. Engineering Standards
- **Naming**: Explicit, domain-driven terminology.
- **Testing**: Connector contracts must pass identical test suites.
- **Logging**: Structured JSON logging via Pino; every job has a child logger.
- **Observability**: Connector Analytics, Pipeline metrics.
- **Performance**: Exponential backoff, timeout handling, connection pooling.
- **DTO Rules**: Explicit `NormalizedOffer` boundary between raw payload and internal domain.

## 8. Product Metrics
Our north stars are business metrics, not just engineering metrics:
- Merchant Coverage
- Knowledge Density
- Authority Score
- RPIP (Revenue per Indexed Page)
- RPKA (Revenue per Knowledge Asset)
- CTR
- Revenue
- Trust

## 9. Decision Framework
Every proposed feature must answer these 5 questions:
1. Does this improve merchant coverage?
2. Does this improve knowledge density?
3. Does this improve trust?
4. Does this improve revenue?
5. Does this improve decision quality?

If the answer is "yes" to `< 2` of these questions, **don't build it.**
