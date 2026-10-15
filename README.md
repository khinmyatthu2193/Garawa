# ဂါရဝ — Garawa 🌸

**အဝေးကနေလည်း ချစ်ခြင်းနဲ့ ကန်တော့နိုင်တယ်။**

UI-first prototype of a Myanmar-inspired digital offering website. This milestone includes the responsive landing page, design tokens, accessible decorative art, and a placeholder creator route.

## Run locally

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Stack

Next.js App Router, React, TypeScript, Tailwind CSS v4, Lucide icons, Google Fonts via `next/font`.

## Current scope

- Landing page with hero, three-step guide, gift showcase, and final CTA
- Burmese-first typography and responsive layout
- Soft Storybook illustration built from CSS, SVG, and emoji
- Reduced-motion support and keyboard focus indicators
- `/create` placeholder (not yet a working offering creator)

**No database, authentication, actual gift delivery, or payments are implemented.** Shared links and recipient responses will be added in later phases.

## Design tokens

Defined in `app/globals.css`: cream `#FAF6ED`, lacquer red `#8D3430`, lantern gold `#D8A348`, leafy green `#456B50`, ink `#302820`.

## Phase 4: Supabase sharing setup

Phase 4 adds real publishing and recipient links through Supabase. Copy
.env.example to .env.local and fill in:

    NEXT_PUBLIC_SUPABASE_URL=your-project-url
    SUPABASE_SECRET_KEY=your-server-only-secret-key
    NEXT_PUBLIC_APP_URL=http://localhost:3000

Use the current Supabase secret key in SUPABASE_SECRET_KEY. If the
project only provides the legacy service-role key, the server also
accepts SUPABASE_SERVICE_ROLE_KEY. Never expose either key with a
NEXT_PUBLIC_ prefix or commit .env.local.

Run the migrations in order with the Supabase CLI:

    npx supabase db push

Migration 001 creates and seeds the catalog, offerings, and recipient
response tables, enables RLS, and revokes direct anonymous table access.
Migration 002 adds a separate hashed sender inbox token. Existing
offerings remain valid recipient offerings but do not receive a sender
inbox link automatically; only newly published offerings receive one.

The API routes are:

- POST /api/offerings — validate and publish an offering
- GET /api/offerings/[token] — retrieve one active offering
- POST /api/offerings/[token]/responses — store one recipient response
- GET /api/catalog — retrieve active catalog items
- /offering/[token] — recipient ceremony
- /inbox/[senderToken] — private sender blessing inbox

Published offerings show a recipient URL, a scannable QR code with a PNG
download action, and a separate private sender inbox URL. The QR code
never contains the sender inbox token. Store the private inbox URL
carefully; there is no account-based recovery in this MVP.

Public mutations use a small in-memory limiter during local development
and an atomic Supabase-backed limiter in production. Apply the migration
before deploying so the consume_rate_limit function is available. Link
access is bearer access:
anyone with a valid link can view the offering. Retention, deletion, and
revocation policy must be finalized before launch.

Set TRUST_PROXY=true only when the deployment proxy is trusted to provide
the client IP in X-Forwarded-For. Leave it false otherwise.

Run npm run dev for local development, npx tsc --noEmit for type
checking, and npm run build for a production build. Live Supabase
integration requires a configured project and migration.

## Notes

The illustrations are initial UI placeholders. Before release, replace emoji with a cohesive original illustrated asset set and review Burmese wording and cultural accuracy with native speakers.
