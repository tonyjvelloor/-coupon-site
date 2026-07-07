# CouponHub Architecture

## Core Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Styling:** Tailwind CSS (optional/used)
- **Authentication:** Custom JWT / Session (or NextAuth)

## Architectural Boundaries
Ownership across the platform must remain distinct to prevent systems from taking on unrelated responsibilities over time:
- **Import Engine:** Only responsible for ingestion and data normalization.
- **SEO Engine:** Only responsible for publishing (collections, blog posts, structure).
- **Analytics Engine:** Only responsible for measurement and tracking.
- **CMS:** Only responsible for editorial management.

## What We Will Not Build
To keep the team focused on business outcomes, the following will not be built until justified by production data:
- Complex RBAC
- Multi-tenant architecture
- Microservices
- Kubernetes
- Real-time collaboration
- GraphQL
- Native mobile apps

## Database Schema Structure

The database is built on a robust PostgreSQL foundation with soft deletes, UUIDs, and optimistic locking to prevent race conditions.

### 1. Foundation Layer
- **Store:** Retailers/merchants offering coupons.
- **Category:** Taxonomy for organizing stores and coupons.
- **Coupon:** The actual offers, linked to Stores and Categories.
- **Collection:** Curated groups for programmatic SEO.

### 2. Affiliate Architecture
Built to support enterprise tracking and historical commission accuracy.
- **AffiliateNetwork:** e.g., Commission Junction, Impact.
- **AffiliateProgram:** The specific merchant's program on a network.
- **AffiliateCampaign:** The active tracking links for a program.
- **AffiliateCampaignHistory:** Point-in-time snapshots of commission rates to ensure historical reporting accuracy.

### 3. Analytics & Audit
Designed for resilience and accountability.
- **AnalyticsEvent:** General system events (views, signups).
- **ClickEvent:** Detailed outbound tracking (with UTM parameters).
- **AuditLog:** Complete history of Admin actions (creates, updates, deletes) with payload diffs.
- **ImportJob:** Resilient background processing for bulk data ingestion.

## Migrations Strategy
Migrations are managed using Prisma.
- Development: `npx prisma migrate dev`
- Production: `npx prisma migrate deploy`

## 4. Merchant Import Engine
The Import Engine is a highly decoupled data pipeline designed to ingest, validate, score, and queue data from any source safely without writing directly to production tables.

### Future Ingestion Pipeline Architecture
```text
Connector
    ↓
Normalizer
    ↓
Merchant Resolver (Fuzzy Confidence Mapping)
    ↓
Rule Engine / Validator (Modular Rule Packs)
    ↓
Deduplicator
    ↓
Quality Engine (Score 0-100)
    ↓
ImportedOffer (Review Queue)
    ↓
Human Review -> Publish Service
    ↓
AI Worker (Enrichment)
```
- **Rule Packs**: Validation is modularized into rule packs (e.g., CSV Rules, Quality Rules, SEO Rules, Network-specific Rules).
- **Merchant Resolver**: Built with confidence scoring to resolve aliases ("Amazon India", "amazon.in") to canonical Merchants.
- **AI Asynchrony**: The AI pipeline operates strictly *after* publishing, reading from `Published Coupon` rather than raw sources.

## 5. Data Quality Principles
The import engine is the heart of the platform. The contract every connector must honor is that every imported record must be:
- **Validated**: Passes the rule engine checks.
- **Normalized**: Mapped to the canonical schema.
- **Deduplicated**: Checked against live offers to prevent double-posting.
- **Scored**: Assigned a 0-100 quality metric.
- **Traceable**: Linked to a specific `ImportJob` and `sourceId`.
- **Auditable**: Lifecycle tracked in `AuditLog`.

## 6. AI Principles
To prevent headaches, AI's role in the architecture is strictly formalized.

**AI may:**
- Generate metadata
- Generate FAQs
- Suggest categories
- Suggest collections
- Summarize merchants
- Generate blog drafts

**AI must NEVER:**
- Overwrite verified merchant data
- Modify affiliate links
- Publish automatically
- Invent coupon codes
- Invent commission values

## Seed Strategy
The database seed script (`prisma/seed.ts`) is idempotent. It requires explicit `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment to prevent accidental execution in production with weak default credentials.

## API Endpoints
- `/api/health`: Provides detailed system health, including the latest applied database migration.
