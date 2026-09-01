# 🚀 Go-Live Checklist

A pre-launch checklist for taking **Tiny Treasure Competitions** into production.
Work top to bottom; the admin dashboard shows a live "Launch readiness" panel and
`/api/health` reports configuration status at any time.

---

## 1. Environment & secrets

- [ ] `DATABASE_URL` (and `DATABASE_URL_UNPOOLED`) point at the **production** database.
- [ ] `AUTH_SECRET` is a fresh, strong value (`openssl rand -base64 32`) — **not**
      the placeholder, and different from any staging value.
- [ ] `NEXT_PUBLIC_SITE_URL` is the real production URL (no trailing slash).
- [ ] `NEXT_PUBLIC_SITE_NAME` set if you want to override the default.
- [ ] All secrets are set in the Vercel project (Production scope), not committed.

## 2. Database

- [ ] Run migrations against production: `npx prisma migrate deploy`.
- [ ] Seed baseline content if desired: `npm run db:seed`
      (creates the admin from `SEED_ADMIN_*`, plus demo content — review/remove
      demo competitions before launch).
- [ ] **Change the seeded admin password** (or create your own admin and delete
      the seed one).

## 3. Stripe (payments)

- [ ] `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` are **live**
      keys (`sk_live_…` / `pk_live_…`). The amber "Test mode" banner disappears
      once live keys are in use.
- [ ] Create the webhook endpoint in the Stripe Dashboard:
      `https://YOUR_DOMAIN/api/webhooks/stripe`
- [ ] Subscribe it to: `checkout.session.completed`,
      `checkout.session.expired`, `charge.refunded`.
- [ ] Put the endpoint's signing secret in `STRIPE_WEBHOOK_SECRET`.
- [ ] Enable your payment methods in **Stripe Dashboard → Settings → Payment
      methods**: **Cards**, **Apple Pay**, **Google Pay** and **Pay by Bank**
      (UK open banking). Apple Pay / Google Pay appear automatically at checkout
      on supported devices — Stripe *provides* these methods; no separate
      integration is needed.
- [ ] For Apple Pay, verify your domain in Stripe (Dashboard → Payment methods →
      Apple Pay → add `tinytreasurecompetitions.com`).
- [ ] Do a real end-to-end test purchase, confirm tickets are allocated and the
      order shows **PAID** in the admin.
- [ ] Test a refund from the admin order page and confirm entries are cancelled.

## 4. Media storage (Vercel Blob)

- [ ] Create a Blob store: Vercel dashboard → **Storage → Create Database →
      Blob** → connect it to the project. This injects `BLOB_READ_WRITE_TOKEN`.
- [ ] **Redeploy** so the token is live. After that, all admin uploads (logo,
      competition images, etc.) go to Vercel Blob and persist across deploys.
      Without the token, uploads fall back to local disk (dev only — they do
      **not** persist on Vercel).
- [ ] Add any other external image hosts to `next.config.mjs →
      images.remotePatterns` (Vercel Blob + Unsplash are already allowed).

## 5. Email (recommended)

- [ ] Connect a provider (Resend / Postmark / SendGrid) and wire the send calls
      referenced by the Email admin module (order confirmation, winner
      notification, draw reminder, welcome).
- [ ] Point contact-form and newsletter signups at a monitored inbox/list.

## 6. Legal & compliance

- [ ] Review **Terms**, **Privacy** and **Responsible Play** (editable in
      `/admin/pages`) with legal advice.
- [ ] Add your real **free postal entry route** address to the Terms.
- [ ] Confirm 18+ / UK-only eligibility wording is correct.
- [ ] Cookie/consent banner if you add analytics cookies.

## 7. SEO & content

- [ ] Replace demo competitions, blog posts and homepage content with real data
      (all editable in the admin — no code).
- [ ] Set homepage hero, trust badges, reviews and announcement in
      `/admin/content` and `/admin/settings`.
- [ ] Verify `/sitemap.xml` and `/robots.txt`.
- [ ] Add real social + Open Graph images.

## 8. Security & reliability

- [ ] `AUTH_SECRET` rotated for production (see §1).
- [ ] Security headers active (set in `next.config.mjs`).
- [ ] Rate limiting is in place for login/register/checkout/contact/newsletter.
      For strict global limits across instances, swap the in-memory store in
      `src/lib/rate-limit.ts` for Upstash Redis / Vercel KV.
- [ ] Add error monitoring (e.g. Sentry) — hook into `src/app/error.tsx`.
- [ ] Point an uptime monitor at `/api/health`.

## 9. Final smoke test (production)

- [ ] Register, log in, log out.
- [ ] Browse + search competitions; open a detail page.
- [ ] Complete a live purchase → tickets allocated → appears in **My entries**
      and **Orders**; invoice downloads.
- [ ] Admin: create a competition, publish it, draw a winner, publish the winner.
- [ ] Responsive check on mobile + desktop.
- [ ] `/api/health` returns `status: ok` with no required-config problems.
