# Deployment & Go-Live Checklist

Before making the site publicly available, ensure the following critical steps have been completed:

## 1. Environment & Credentials
- [ ] `DATABASE_URL` is set to the production Neon PostgreSQL connection string.
- [ ] `ADMIN_EMAIL` and `ADMIN_PASSWORD` are strong and securely configured.
- [ ] `JWT_SECRET` is freshly generated and securely stored.
- [ ] `NEXT_PUBLIC_SITE_URL` points to the final production domain.

## 2. Infrastructure & Operations
- [ ] Database backup policy is enabled and verified in Neon.
- [ ] Database restore procedure has been tested.
- [ ] Health endpoint (`/api/health`) is responding correctly.

## 3. SEO & Analytics
- [ ] Google Search Console is verified.
- [ ] Analytics tracking (e.g., Google Analytics, Plausible, or internal ClickEvents) is configured and firing.
- [ ] Sitemap is submitted to Search Console.
- [ ] Crawlability confirmed (robots.txt is correct).

## 4. Quality Assurance
- [ ] 404 (Not Found) and 500 (Server Error) pages are working correctly.
- [ ] Affiliate redirect pipelines (the `go/[slug]` or tracking endpoints) are validating and clicking through properly.
