# CouponHub Architecture

## Core Technologies
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon Serverless)
- **ORM:** Prisma
- **Styling:** Tailwind CSS (optional/used)
- **Authentication:** Custom JWT / Session (or NextAuth)

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

## Seed Strategy
The database seed script (`prisma/seed.ts`) is idempotent. It requires explicit `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment to prevent accidental execution in production with weak default credentials.

## API Endpoints
- `/api/health`: Provides detailed system health, including the latest applied database migration.
