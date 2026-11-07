# Dashboard UI

Open `/dashboard` after signing in with Supabase Auth.

- `app/dashboard/layout.tsx` loads the signed-in user's profile, plan, and embeds from PostgreSQL through Prisma.
- `store.tsx` keeps that server-loaded data in sync in the client after successful API mutations.
- `lib/dashboard-model.ts` defines the frontend model, serializes database embeds, validates Notion URLs, and generates escaped iframe markup.
- `dashboard-shell.tsx` owns persistent navigation and account chrome.
- `dashboard.tsx` contains the overview and embed listing features.
- `dashboard-shared.tsx` and `upgrade-dialog.tsx` contain small reusable client features without pulling the complete dashboard into every route.
- `editor.tsx` creates and updates embeds through the authenticated API routes.
- `account.tsx` contains billing and profile settings.
- `lib/notion.ts` securely fetches published Notion content on the server.
- `/notion-preview` renders live content inside the editor preview frame.
- `/embed/[id]` resolves an active database embed and renders its live Notion page.

The Free plan allows one branded database-backed embed and Pro allows 25 watermark-free embeds. No payment provider is connected yet. Demo Pro access is persisted in the subscriptions table. Appearance, layout, security controls, and automatic watermark removal are enabled for Pro.

User records are synchronized during OAuth callback. Dashboard reads are parallelized, while profile changes and embed CRUD operations are persisted to PostgreSQL. Notion page icons are fetched through one authenticated batch endpoint and cached independently from frequently changing page content.

Run checks with `npm test`.
