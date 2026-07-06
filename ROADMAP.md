# CouponHub Growth Roadmap

This document outlines the strategic path forward for the CouponHub platform, transitioning from core infrastructure development to compounding business growth.

## Engineering Priorities

### Tier 1
- **Affiliate network integrations:** Direct pipelines into CJ, Impact, ShareASale, etc.
- **Import engine:** A highly reliable engine for fetching, normalizing, deduplicating, enriching, and assigning affiliate data.
- **AI content enrichment:** Augmenting structured data (SEO titles, descriptions, FAQs) without replacing editorial judgment.
- **Merchant automation:** Automating the lifecycle of merchant data.

### Tier 2
- **Revenue analytics:** In-depth attribution and EPC (Earnings Per Click) tracking.
- **Search Console integration:** Directly correlating organic metrics with revenue metrics.
- **Email automation:** Automated digest generation and targeted coupon alerts.
- **Merchant dashboards:** Providing self-serve insights or reporting for partnered merchants.

### Tier 3
- **Browser extension:** Frictionless cashback or coupon application at checkout.
- **Cashback:** User wallet and ledger systems.
- **Mobile app:** Native iOS/Android experience.
- **Public API:** Allowing third parties to consume our deal feeds.

## The Next Automation: Merchant Import Engine

The absolute highest priority engineering task is building a resilient, automated import pipeline:
1. **Fetch Feed:** Connect to affiliate networks.
2. **Normalize:** Map varying schemas to our internal models.
3. **Deduplicate:** Ensure offers aren't double-posted.
4. **Enrich:** Add missing categorization and context.
5. **Assign Collections:** Automatically map coupons to relevant programmatic SEO pages.
6. **Generate Metadata:** Prepare SEO and OG tags.
7. **Publish:** Push to live database.
8. **Notify Editor:** Alert the team of new high-value imports for final review.

## Key Performance Indicators (KPIs)

To ensure the business is actually improving, these metrics will be monitored weekly:

| Metric | Target |
| :--- | :--- |
| Merchants imported | ↑ |
| Coupons imported | ↑ |
| Coupons verified | ↑ |
| Collections published | ↑ |
| Blog posts published | ↑ |
| Organic impressions | ↑ |
| Organic clicks | ↑ |
| Affiliate revenue | ↑ |
| Revenue per indexed page | ↑ |

*Note: The primary execution risk is no longer engineering. Success depends on building a high-quality catalog, publishing authoritative content, developing partnerships, and iterating on analytics.*
