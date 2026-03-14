# Roadblock Remover

An internal engineering health tool designed to identify, visualize, and eliminate systemic friction in the software development lifecycle. Engineers anonymously report roadblocks, leadership sees a real-time heat map of where time is wasted, and resolvers track issues through to resolution.

## Features

- **Anonymous Reporting** — Engineers submit roadblocks without any identifying information stored in the database
- **Heat Map Dashboard** — Real-time Category × Severity grid showing where friction concentrates, with live updates via PocketBase subscriptions
- **Resolution Workflow** — Structured status flow (Open → In Progress → Resolved → Closed) with resolver assignment and resolution notes
- **Follow & Notify** — Subscribe to roadblocks and receive notifications when status changes or resolutions are added

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [Next.js 15](https://nextjs.org/) (App Router, static export) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| Backend | [PocketBase](https://pocketbase.io/) (auth, database, real-time) |
| Deployment | AWS S3 + CloudFront |
| Package Manager | [Bun](https://bun.sh/) |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- A running [PocketBase](https://pocketbase.io/) instance

### Installation

```bash
git clone https://github.com/your-username/RoadblockRemover.git
cd RoadblockRemover
bun install
```

### Environment Setup

Copy the example env file and configure your PocketBase URL:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

### PocketBase Collections

Set up the required PocketBase collections using the setup script:

```bash
PB_EMAIL=admin@example.com PB_PASS=your-password node scripts/setup-pocketbase.mjs
```

This creates:
- **`roadblocks`** — Stores reported roadblocks (no author field for anonymity)
- **`subscriptions`** — Tracks which users follow which roadblocks

See [docs/pocketbase-setup.md](docs/pocketbase-setup.md) for manual setup instructions and detailed schema documentation.

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
bun run build
```

Static files are output to the `/out` directory.

### Lint & Type Check

```bash
bun run lint
bun run type-check
```

### Test

```bash
bun test
```

## Deployment

The app deploys as a static site to AWS S3 with CloudFront CDN:

```bash
S3_BUCKET=your-bucket CF_DIST_ID=your-dist-id ./scripts/deploy.sh
```

See [docs/aws-setup.md](docs/aws-setup.md) for infrastructure setup details.

## Project Structure

```
src/
├── app/            # Next.js App Router pages (dashboard, login, report, roadblocks, notifications)
├── components/     # React components organized by feature
│   ├── auth/       # Login, Register, AuthGuard
│   ├── dashboard/  # HeatMap, HeatMapCell, DashboardFilters
│   ├── layout/     # AppShell, Sidebar, Header
│   ├── roadblocks/ # ReportForm, RoadblockDetail, ResolutionForm, badges
│   ├── subscriptions/ # FollowButton, NotificationList
│   └── ui/         # Shared primitives (Button, Input, Select, Modal, etc.)
├── hooks/          # Custom React hooks for data fetching and subscriptions
├── providers/      # React context providers (Auth, Toast)
├── types/          # TypeScript interfaces and type definitions
├── constants/      # Category, severity, and status configurations
└── lib/            # PocketBase client, config, structured logger
```

## Anonymity Architecture

Anonymity is enforced at three levels:

1. **Schema Design** — The `roadblocks` collection has no `created_by` or author field
2. **Client Payload** — The submission form sends only `category`, `severity`, `title`, `description`, and `estimated_waste`
3. **API Rules** — PocketBase requires authentication (`@request.auth.id != ""`) to prevent spam, but the auth identity is not stored in the record

## License

Private — Internal use only.
