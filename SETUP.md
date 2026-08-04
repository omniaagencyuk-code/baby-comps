# Setup & Deployment Guide

This guide covers local development and deploying **Tiny Treasure Competitions**
to Vercel.

---

## 1. Prerequisites

- Node.js 18.18+ (Node 20/22 recommended)
- A PostgreSQL database (local, or a hosted provider such as
  [Neon](https://neon.tech), [Supabase](https://supabase.com) or
  [Vercel Postgres](https://vercel.com/storage/postgres))
- A [Stripe](https://stripe.com) account (test mode is fine to start)

---

## 2. Environment variables

Copy `.env.example` to `.env` and fill in every value.

| Variable                             | Required | Notes                                              |
| ------------------------------------ | -------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`               | ✅       | Full site URL, no trailing slash                   |
| `NEXT_PUBLIC_SITE_NAME`              | ➖       | Defaults to "Tiny Treasure Competitions"           |
| `DATABASE_URL`                       | ✅       | Pooled PostgreSQL connection string                |
| `DATABASE_URL_UNPOOLED`              | ➖       | Direct (non-pooled) URL; auto-set by Neon/Vercel   |
| `AUTH_SECRET`                        | ✅       | `openssl rand -base64 32`                          |
| `STRIPE_SECRET_KEY`                  | ✅\*     | `sk_test_…` / `sk_live_…`                           |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅\*     | `pk_test_…` / `pk_live_…`                           |
| `STRIPE_WEBHOOK_SECRET`              | ✅\*     | From `stripe listen` or the Dashboard              |
| `SEED_ADMIN_EMAIL`                   | ➖       | Admin login created by the seed                    |
| `SEED_ADMIN_PASSWORD`                | ➖       | Admin password created by the seed                 |

\* Stripe keys are required for real payments. Without them the app runs in
**demo mode** (orders fulfil instantly on checkout).

---

## 3. Database

```bash
# Push the schema (fastest for a new database)
npm run db:push

# — or — create a versioned migration
npm run db:migrate

# Seed demo data
npm run db:seed
```

Inspect data any time with `npm run db:studio`.

---

## 4. Local development

```bash
npm run dev
# App:   http://localhost:3000
# Admin: http://localhost:3000/admin  (log in as the seeded admin)
```

To exercise real Stripe payments locally, run the webhook forwarder in a second
terminal:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

---

## 5. Deploying to Vercel

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the project into Vercel.
3. Add all environment variables from your `.env` to the Vercel project
   (Production and Preview).
4. Set the **Build Command** to `npm run build` (default) — it runs
   `prisma generate` automatically.
5. Provision a PostgreSQL database and set `DATABASE_URL` (+ `DATABASE_URL_UNPOOLED`).
6. After the first deploy, run migrations against production:
   ```bash
   npx prisma migrate deploy      # with DATABASE_URL pointing at prod
   npm run db:seed                # optional: seed initial data
   ```
7. Configure the **Stripe webhook** in the Stripe Dashboard:
   - Endpoint URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
   - Events: `checkout.session.completed`, `checkout.session.expired`,
     `charge.refunded`
   - Copy the signing secret into `STRIPE_WEBHOOK_SECRET`.

---

## 6. Post-launch checklist

- [ ] Replace demo images/URLs with your own hosted media (and add the host to
      `next.config.mjs → images.remotePatterns`).
- [ ] Change the seeded admin password.
- [ ] Review and finalise `Terms`, `Privacy` and `Responsible Play` copy with
      legal advice, including your real postal-entry address.
- [ ] Connect an email provider (Resend/Postmark/SendGrid) for transactional
      email.
- [ ] Media uploads work out of the box locally (saved to `public/uploads`).
      For Vercel (read-only filesystem), swap `saveUpload`/`deleteUpload` in
      `src/lib/storage.ts` for Vercel Blob / Cloudinary / UploadThing — it's the
      single integration point.
- [ ] Set up analytics and monitoring.

---

## 7. Troubleshooting

| Symptom                                   | Fix                                                      |
| ----------------------------------------- | ------------------------------------------------------- |
| `AUTH_SECRET is not set`                  | Add `AUTH_SECRET` to your environment.                  |
| Prisma "Can't reach database server"      | Check `DATABASE_URL` and that the DB is running.        |
| Checkout says Stripe not configured       | Add Stripe keys, or use demo mode intentionally.        |
| Webhook signature verification failed     | Ensure `STRIPE_WEBHOOK_SECRET` matches the endpoint.    |
| Tickets not allocated after payment       | Confirm the webhook endpoint is reachable & subscribed. |
