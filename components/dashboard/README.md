# Dashboard UI

Open `/dashboard` after signing in with Supabase Auth.

- `app/dashboard/layout.tsx` loads the signed-in user's profile, plan, and embeds from PostgreSQL through Prisma.
- `store.tsx` keeps that server-loaded data in sync in the client after successful API mutations.
- `lib/dashboard-model.ts` defines the frontend model, serializes database embeds, validates Notion URLs, and generates escaped iframe markup.
- `dashboard.tsx` contains navigation, overview, embed listing, and shared dialogs.
- `editor.tsx` creates and updates embeds through the authenticated API routes.
- `account.tsx` contains billing and profile settings.
- `lib/notion.ts` securely fetches published Notion content on the server.
- `/notion-preview` renders live content inside the editor preview frame.
- `/embed/[id]` resolves an active database embed and renders its live Notion page.

The Free plan allows one database-backed embed and Pro allows 25. No payment provider is connected yet. Advanced customization and watermark removal are labeled as planned, not enabled.

User records are synchronized during OAuth callback and dashboard loading. Profile changes and embed CRUD operations are persisted to PostgreSQL.

Run model checks with `node --experimental-strip-types --test tests/dashboard-model.test.mjs`.
