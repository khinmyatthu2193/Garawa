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

## Notes

The illustrations are initial UI placeholders. Before release, replace emoji with a cohesive original illustrated asset set and review Burmese wording and cultural accuracy with native speakers.
