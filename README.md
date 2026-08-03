# 🧸 Tiny Treasure Competitions

A production-ready **UK baby & family prize competition platform**, built with
Next.js 14 (App Router), TypeScript, Tailwind CSS, PostgreSQL, Prisma and
Stripe. Deployable to Vercel.

It is an original implementation — no branding, assets, layouts or code copied
from any existing competition website.

---

## ✨ Features

**Public website**

- Premium, mobile-first, SEO-first homepage (hero, featured / ending-soon / new
  competitions, winner showcase, how-it-works, trust badges, reviews,
  newsletter, latest blog)
- Competition listing with category filters, sorting and pagination
- Rich competition detail pages with gallery, live countdown, progress bar and
  an entry/checkout panel
- Winners gallery, blog + posts, guides, FAQ (with FAQ schema), about, contact
- Legal pages: terms, privacy, responsible play

**Competition engine**

- Prize title, images, description, retail value, ticket price, max entries,
  entries sold / remaining, draw & closing dates, skill question + answer,
  terms, winner, published status and SEO fields
- **Tickets are only allocated after a verified Stripe payment**

**Customer area**

- Register / login (secure, hashed passwords, JWT session cookie)
- View entries + ticket numbers, orders, downloadable invoices, wins, saved
  competitions, and manage profile / delivery details

**Admin CMS** (`/admin`, admin role only) — manage the whole site without code

- **Dashboard** with live revenue/orders/entries stats
- **Competitions**: full CRUD editor (every field editable) plus **duplicate**,
  **archive/restore** and reusable **templates** (save-as-template + create-from-template)
- **Media library** with drag-and-drop **image uploads**, reused via a picker in
  every image field (competitions, blog, winners, hero)
- **Homepage content** editor: hero, trust badges, how-it-works steps and reviews
  are all CMS-driven (no hardcoded content)
- **Content pages** (About, Terms, Privacy, Responsible Play + custom pages)
  edited as Markdown
- **Orders, Customers, Winners** (random draw + edit + publish), **Blog** editor,
  **Coupons** (create, min-spend, expiry, usage caps, enable/disable, delete),
  **Reports**, **SEO** health, **Email** overview and **Settings**

**Stripe**

- Checkout Sessions, webhook-driven fulfilment, refund handling, promotion
  codes / coupons. **Prices are always computed server-side — the browser price
  is never trusted.**

**SEO**

- Dynamic per-page metadata, canonicals, XML sitemap, robots.txt, JSON-LD
  (Organization, WebSite, Product, FAQ, Breadcrumb, Article), Open Graph, and
  Core Web Vitals optimisation (`next/font`, image optimisation).

---

## 🧱 Tech stack

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | Next.js 14 (App Router, Server Actions)       |
| Language  | TypeScript                                    |
| Styling   | Tailwind CSS                                   |
| Database  | PostgreSQL + Prisma ORM                        |
| Payments  | Stripe (Checkout + Webhooks)                   |
| Auth      | Custom JWT session (`jose`) + `bcryptjs`       |
| Hosting   | Vercel                                         |

---

## 🚀 Quick start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    → fill in DATABASE_URL, AUTH_SECRET, and Stripe keys

# 3. Create the database schema
npm run db:push        # or: npm run db:migrate

# 4. Seed demo data (admin, competitions, winners, blog, FAQ)
npm run db:seed

# 5. Run the dev server
npm run dev            # http://localhost:3000
```

### Demo accounts (from the seed)

| Role     | Email                        | Password        |
| -------- | ---------------------------- | --------------- |
| Admin    | `admin@tinytreasure.co.uk`   | `ChangeMe123!`  |
| Customer | `demo@tinytreasure.co.uk`    | `Password123!`  |

> The admin credentials come from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`.

---

## 💳 Stripe setup

1. Add `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env`.
2. Forward webhooks locally with the Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Copy the printed `whsec_…` into `STRIPE_WEBHOOK_SECRET`.
3. Use test card `4242 4242 4242 4242`, any future expiry and any CVC.

**Demo mode without Stripe:** if `STRIPE_SECRET_KEY` is not set, checkout
fulfils the order immediately so you can test the full entry → ticket-allocation
→ confirmation flow end-to-end.

---

## 📜 Scripts

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `npm run dev`      | Start the dev server                 |
| `npm run build`    | `prisma generate` + production build |
| `npm run start`    | Start the production server          |
| `npm run lint`     | ESLint                               |
| `npm run typecheck`| TypeScript check                     |
| `npm run db:push`  | Push the schema to the database      |
| `npm run db:migrate`| Create & run a migration            |
| `npm run db:seed`  | Seed demo data                       |
| `npm run db:studio`| Open Prisma Studio                   |

---

## 🏗️ Project structure

```
prisma/
  schema.prisma        # 17 models (User, Competition, Entry, Order, Review,
                       #   ContentBlock, Page, Media, …)
  seed.ts              # demo data
src/
  app/                 # App Router pages & API routes
    (public pages)     # /, /competitions, /winners, /blog, /faq, …
    account/           # customer dashboard
    admin/             # admin CMS
    api/               # checkout, stripe webhook, invoice, contact
    sitemap.ts robots.ts manifest.ts
  components/          # UI + feature components
  lib/                 # prisma, auth, stripe, orders, queries, validation
```

For deployment instructions, see [`SETUP.md`](./SETUP.md). Before going live,
work through the [`LAUNCH.md`](./LAUNCH.md) checklist — the admin dashboard also
shows a live launch-readiness panel and `/api/health` reports configuration and
database status.

---

## ⚖️ Compliance note

Every paid entry requires a genuine skill question, and the platform is designed
to support a free postal entry route, in line with UK prize-competition law.
Review the terms and consult legal advice before going live.
