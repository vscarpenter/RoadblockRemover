# Roadblock Remover

## Project Overview
Internal engineering health tool for anonymous friction reporting with a real-time heat map dashboard.

**Tech Stack:** Next.js 15 (App Router, static export) · Tailwind CSS v4 · PocketBase (v0.23+) · AWS S3/CloudFront

## Package Manager
**Use `bun` — not npm or yarn.** All install, run, and script commands should use `bun`.

```bash
bun install        # Install dependencies
bun run dev        # Start dev server
bun run build      # Build static export to /out
bun run lint       # Run ESLint
bun test           # Run tests
bun run type-check # TypeScript strict check
```

## Key Architecture Decisions

- **Static Export**: `output: 'export'` in `next.config.ts`. No API routes, no SSR. All data fetching is client-side via PocketBase JS SDK.
- **Anonymity by Design**: The `roadblocks` PocketBase collection has NO `created_by` field. Auth is required to create records, but the record stores no author reference.
- **Dynamic Routes**: Static export doesn't support true dynamic `[id]` routes. Detail views use query params: `/roadblocks/?id=xxx`. A redirect handler at `/roadblocks/[id]` provides backward compat.
- **Real-time**: PocketBase SSE subscriptions power live dashboard updates via `pb.collection().subscribe()`.
- **Notifications (v1)**: Client-side derived from real-time events, stored in localStorage. No server-side push.

## PocketBase
- Instance: `https://api.vinny.io` (configured in `.env.local`)
- Version: v0.23+ (uses `_superusers` for admin auth, `fields` not `schema` in collection API)
- Collections: `roadblocks`, `subscriptions`
- Setup script: `node scripts/setup-pocketbase.mjs` (requires `PB_EMAIL` and `PB_PASS` env vars)

## Project Structure
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components (layout, auth, roadblocks, dashboard, subscriptions, ui)
├── hooks/         # Custom hooks (useAuth, useRoadblocks, useRoadblock, useSubscription, useNotifications)
├── providers/     # React contexts (AuthProvider, ToastProvider)
├── types/         # TypeScript interfaces (roadblock, subscription, notification)
├── constants/     # Enums and configs (categories, severities, statuses)
└── lib/           # Utilities (pocketbase client, config, logger)
```

## Coding Standards
See `coding-standards.md` for full details. Key points:
- TypeScript strict mode
- Functions ≤30 lines, max 3 nesting levels
- Type annotations on all signatures
- Conventional commits
