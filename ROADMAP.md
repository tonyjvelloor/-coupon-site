# CouponHub v1.0 Constitution & Roadmap

## Guiding Philosophy
**CouponHub is not a coupon website.**

It is a data platform that transforms affiliate data into trusted, discoverable, high-converting content through automation, editorial oversight, and analytics.

## Engineering Principles
Every feature must satisfy at least one of:
- Increase revenue
- Increase content velocity
- Reduce manual work
- Improve search visibility
- Improve data quality

If a feature satisfies none of those, it doesn't get built. This prevents feature creep.

## Core Directives

1. **No schema changes without a measurable production reason.**
2. **Shift Focus to Execution:** For the next 90 days, engineering is not the bottleneck. Resources should be allocated:
   - 60% to merchant onboarding and affiliate integrations.
   - 20% to SEO content production and topical authority.
   - 10% to analytics and conversion optimization.
   - 10% to engineering improvements driven by production data.

## Service Level Objectives (SLOs)
Measurable operational targets for the platform:
- **Import success:** >98%
- **Publish yield:** >90%
- **API uptime:** >99.9%
- **Health endpoint:** <250 ms
- **Import latency:** <5 minutes
- **Duplicate rate:** <2%

## The 6-Month Roadmap

### Month 1: Validation & Automation
- **Impact Connector:** Prove the V1 abstraction with the first major affiliate network API.
- **Merchant Resolver:** Build a confidence-based resolver (mapping variations like "Amazon India", "AMZN", "amazon.in" to the canonical "Amazon" merchant).
- **Scheduler (Cron imports):** Automate the Import Pipeline so the platform updates itself.

### Month 2: Scale & Operations
- **CJ (Commission Junction) Connector.**
- **Notification Engine:** Post-import slack/email notifications (e.g., "Imported 8,500 offers, Rejected 312, Duplicate 441, Avg Quality 91").
- **Import Metrics Dashboard:** Surfacing key pipeline KPIs directly to admins.

### Month 3: Hardening & Intelligence
- **Awin Connector & Admitad Connector.**
- **Merchant Resolver Optimization.**
- **Scheduler Hardening & Import Monitoring.**
*(The better the data, the more valuable the AI output becomes.)*

### Month 4: AI & Enrichment
- **AI Enrichment Workers:** Asynchronous AI to enrich SEO titles, descriptions, and metadata.
- **Merchant Summaries:** AI-generated blurbs about the merchant.
- **SEO Metadata:** Automated OG tags and schema markup.

### Month 5: Ecosystem Expansion
- **Browser Extension Prototype:** Frictionless coupon application at checkout.

### Month 6: Optimization
- **Affiliate Optimization Engine:** A/B testing and yield optimization across multiple affiliate networks for the same merchant.

## Success Metrics

To ensure the business is actually improving, these metrics will be monitored weekly.

### Business & Growth Metrics
| Metric | Target |
| :--- | :--- |
| Merchants imported | ↑ |
| Coupons imported | ↑ |
| Collections published | ↑ |
| Organic impressions | ↑ |
| Affiliate revenue | ↑ |
| Revenue per indexed page | ↑ |

### Pipeline & Efficiency Metrics
Efficiency improvements compound just as much as growth:
- **Publish Yield:** `(Published Offers / Imported Offers) * 100`. (Target: >90%)
- **Connector Quality:** Average Quality Score tracked per source.
- **Time to onboard merchant**
- **Time to publish feed**
- **Average review time**
- **Average AI enrichment time**
- **Import cost**
- **Revenue per import**
- **Revenue per merchant**

## The Feature Proposal Framework
Going forward, every new feature proposal should answer three questions before implementation:
1. Which business KPI does this improve?
2. Which existing architectural principle does it follow?
3. Why should this be built now instead of one of the roadmap priorities?

If a proposal can't answer those convincingly, it should wait. That discipline is what will keep CouponHub focused as it scales from a technically impressive platform into a successful business.
