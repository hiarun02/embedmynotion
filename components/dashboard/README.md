# Dashboard UI

Open `/dashboard` for the mock workspace. No login is required by these pages.

- `store.tsx` owns versioned browser-local state. Replace this provider with a backend adapter when the UI is ready for integration.
- `lib/dashboard-model.ts` defines the frontend model, validates stored state and Notion URLs, and generates escaped iframe markup.
- `dashboard.tsx` contains navigation, overview, embed listing, and shared dialogs.
- `editor.tsx` contains creation, editing, and code generation.
- `account.tsx` contains billing and profile settings.
- `preview.tsx` renders illustrative document content, not fetched Notion content.
- `/embed/[id]` resolves a saved mock embed from this browser and respects its active status. These links are not published resources and do not transfer data to another browser. Cross-site iframe storage may be partitioned by browsers.

The initial Free workspace has one embed. Delete it to try creation, or choose “Try Pro in this demo” in the upgrade dialog to simulate the 25-embed allowance. Switch back through Billing when at most one embed remains. No payment or subscription is created. Advanced customization and watermark removal are labeled as planned, not enabled.

Existing authentication routes, Supabase middleware, and Prisma models are not changed by this UI implementation. Profile changes affect only the mock workspace.

Run model checks with `node --test tests/dashboard-model.test.mjs`.
