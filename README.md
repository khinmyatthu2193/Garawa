ဂါရဝ — Garawa 🌸

«အဝေးကနေလည်း ချစ်ခြင်းနဲ့ ကန်တော့နိုင်တယ်။
Even from afar, you can offer your love and pay respect.»

Garawa is a Myanmar-inspired digital offering platform designed to bring the tradition of ဂါရဝ (Garawa) into the digital world. It aims to help people express gratitude, send blessings, and pay respect to the people they cherish—even when distance keeps them apart.

This project is being developed in phases, starting with a responsive, Burmese-first interface and expanding into personalized digital offerings, recipient responses, authentication, and a persistent rewards system.

✨ Features

- Responsive landing page — A welcoming homepage with a hero section, three-step guide, gift showcase, and call-to-action.
- Myanmar-inspired design — Warm colors, Burmese-first typography, and a soft storybook aesthetic.
- Digital offerings — Create and publish offerings with shareable recipient links.
- QR code sharing — Generate downloadable QR codes for published offerings.
- Recipient responses — Allow recipients to respond to offerings with blessings and messages.
- Private sender inbox — Access recipient responses through a separate, private sender link.
- Authentication — Supabase Auth integration for email/password and Google OAuth.
- Garawa Points — Persistent point wallets, quiz attempts, and server-validated rewards.
- Accessible experience — Keyboard focus indicators and reduced-motion support.

Some features require environment configuration and database migrations before they can run.

🛠️ Tech Stack

Technology| Purpose
Next.js App Router| Application framework and routing
React| User interface
TypeScript| Type safety
Tailwind CSS v4| Styling and responsive layouts
Lucide| Interface icons
Google Fonts via "next/font"| Typography
Supabase| Database, authentication, and persistent data
Supabase SSR| Server-side authentication and cookie management

🚀 Getting Started

Prerequisites

- Node.js 22 or later
- npm
- A Supabase project for backend features

1. Install dependencies

npm install

2. Configure environment variables

Create a local environment file by copying the example:

cp .env.example .env.local

On Windows Command Prompt, use:

copy .env.example .env.local

Add the appropriate values to ".env.local":

NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
SUPABASE_SECRET_KEY=your-server-only-secret-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

Use your actual Supabase project credentials. Keep server-only secrets private and never commit ".env.local" to version control.

3. Apply database migrations

If you are setting up the Supabase backend, configure the Supabase CLI and link your project, then run:

npx supabase db push

Apply all project migrations in order. The latest migration must be applied before using its associated features.

4. Start the development server

npm run dev

Open "http://localhost:3000" (http://localhost:3000) in your browser.

5. Check the project

Run TypeScript checks:

npx tsc --noEmit

Create a production build:

npm run build

🧭 Application Routes

Route| Description
"/"| Landing page
"/create"| Offering creation interface
"/dashboard"| Authenticated user dashboard
"/settings"| Account settings
"/offering/[token]"| Public recipient offering and ceremony
"/inbox/[senderToken]"| Private sender inbox
"/auth/callback"| Authentication and recovery callback
"/reset-password"| Password recovery flow
"/api/catalog"| Retrieve active catalog items
"/api/offerings"| Publish an offering
"/api/offerings/[token]"| Retrieve an active offering
"/api/offerings/[token]/responses"| Submit a recipient response

🎨 Design System

Garawa uses a warm, traditional-inspired palette to create a welcoming digital experience.

Token| Hex| Purpose
Cream| "#FAF6ED"| Primary background
Lacquer Red| "#8D3430"| Primary accent
Lantern Gold| "#D8A348"| Decorative highlights
Leafy Green| "#456B50"| Secondary accent
Ink| "#302820"| Primary text

Design principles:

- Burmese-first content and typography
- Responsive layouts for mobile and desktop
- Soft, storybook-inspired illustrations
- Accessible keyboard navigation
- Respect for Myanmar cultural traditions

The current illustrations use CSS, SVG, and emoji as initial placeholders. A cohesive original illustration set is planned before release.

🔐 Authentication Setup

Garawa uses Supabase Auth with "@supabase/ssr".

Email and password

In your Supabase dashboard:

1. Enable the Email provider.
2. Configure email confirmation according to your registration flow.
3. Configure password recovery email templates.
4. Verify that the application callback URLs are included in the redirect allow list.

For the local development environment, allow:

http://localhost:3000/auth/callback

Google OAuth

Configure Google OAuth in Supabase and Google Cloud.

The Google OAuth client's authorized redirect URI must point to the Supabase provider callback:

https://<project-ref>.supabase.co/auth/v1/callback

Add Garawa's local and production application callback URLs to the Supabase Auth redirect allow list.

OAuth and password recovery require valid provider credentials, callback configuration, and email templates.

🗄️ Database & Backend

The backend uses Supabase to support persistent offerings, recipient responses, user profiles, and rewards.

Offering and sharing system

- Stores catalog items, published offerings, and recipient responses.
- Generates recipient links and separate sender inbox links.
- Uses hashed sender inbox tokens.
- Provides active catalog and offering API endpoints.
- Uses database-backed rate limiting in production.

Authentication and ownership

- Maintains user profiles through a signup trigger.
- Associates newly published offerings with authenticated users.
- Obtains the authenticated user ID from Supabase Auth rather than trusting client-supplied identity data.
- Supports ownership policies through Row Level Security (RLS).

Historical offerings remain valid but are not automatically reassigned to newly registered users.

Garawa Points

The persistent points system introduces:

- Authenticated quiz attempts
- Persistent point wallets
- Point transaction records
- An atomic reward function
- Server-side answer validation and reward calculation

Existing users receive a zero-point wallet through lazy initialization. Previous practice scores are not automatically converted into persistent points.

🧱 Development Milestones

Phase| Scope
Initial UI| Responsive landing page, design tokens, decorative illustrations, and placeholder creator route
Phase 4| Supabase-backed publishing, recipient links, QR codes, responses, and sender inbox
Phase 4.2A| Supabase authentication, user profiles, ownership policies, and account settings
Phase 4.2C| Persistent Garawa Points, quiz attempts, wallets, and reward transactions

Each milestone builds on the previous implementation. Apply the relevant database migrations before testing newly introduced backend features.

🛡️ Security & Privacy

Security is an important part of Garawa's sharing model.

- Never expose Supabase secret or service-role keys in browser code.
- Never prefix server-only credentials with "NEXT_PUBLIC_".
- Never commit ".env.local" or private credentials.
- Use Row Level Security and server-side authorization for protected operations.
- Treat recipient and sender inbox URLs as bearer-access links: anyone possessing a valid link may access its associated content.
- Keep sender inbox URLs private; the current MVP does not provide account-based recovery for them.
- Apply the rate-limiting migration before production deployment.
- Set "TRUST_PROXY=true" only when a trusted deployment proxy supplies the client IP through "X-Forwarded-For".

Before public launch: finalize retention, deletion, link revocation, and access-control policies. Review all public API routes and ensure production environment variables are configured securely.

📌 Current Limitations

- The illustrations are initial placeholders and need a cohesive original asset set.
- Cultural wording and visual details require review by native Myanmar speakers.
- OAuth and password recovery depend on correct Supabase configuration.
- Sender inbox links do not have account-based recovery in the current MVP.
- Account deletion is not implemented.
- Existing offerings are not automatically linked to newly registered accounts.
- Production database features require the appropriate Supabase migrations.
- The project should not be considered production-ready until privacy, retention, and revocation policies are finalized.

🌱 Future Direction

Garawa aims to grow into a meaningful digital space where people can:

- Create personalized digital offerings.
- Share blessings with family, teachers, elders, and loved ones.
- Express gratitude across distances.
- Receive messages and responses from recipients.
- Participate in activities that earn Garawa Points.

The goal is not to replace traditional acts of respect, but to make expressing gratitude more accessible when meeting in person is not possible.

💗 Acknowledgment

Built with love for Myanmar culture, gratitude, and the tradition of paying respect.

ဂါရဝ — အဝေးကနေလည်း ချစ်ခြင်းနဲ့ ကန်တော့နိုင်တယ်။
