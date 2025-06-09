# Seemianki – **UNDER CONSTRUCTION**

Monitoring & reporting dashboard for **Mac and Windows** devices.
Powered by lightweight **osquery** telemetry and a modern **T3** stack—Next.js, Prisma, tRPC, Tailwind—packaged for easy deployment with Docker.

## Project Goals

* Provide a single, real‑time view of hardware, software, and security posture across mixed fleets.
* Offer extensible modules (inventory, patch compliance, vulnerability insights) without vendor lock‑in.
* Remain **agent‑agnostic** (starting with osquery) and **cloud‑agnostic** via container deployment.
* **Future**: Extend support to Linux endpoints as osquery coverage allows.
* Embrace open‑source values: transparency, auditability, and community‑driven features.

## Tech Stack

* **Next.js** — React framework (App Router + Server Components) that powers both the UI and API routes, giving us seamless SSR/ISR and edge‑ready deployment.
* **Prisma ORM** — Type‑safe database layer on top of **PostgreSQL**, providing declarative schema migrations and autotyped queries.
* **tRPC** — End‑to‑end types for zero‑overhead API calls between the Next.js server and React clients.
* **Tailwind CSS** & **shadcn/ui** — Utility‑first styling plus accessible component library for rapid, consistent UI development.
* **Recharts** — Composable charting library used for all dashboard graphs and time‑series visualisations.
* \*\*Docker \*\* — Containerized web app and services; `docker compose` spins up the full stack locally while the same image pushes to any registry for production.
* **osquery** — Lightweight, cross‑platform agent that streams hardware, software, and security events from endpoints.

## Quick Start (Development)

 Start (Development)

```bash
# 1. Clone the repo
git clone https://github.com/your‑org/seemianki.git
cd seemianki

# 2. Install dependencies (pnpm recommended)
pnpm install

# 3. Copy environment template & tweak
cp .env.example .env.local
#   – set DATABASE_URL, NEXTAUTH_SECRET, etc.

# 4. Launch dev stack (db + web)
docker compose up -d db         # starts PostgreSQL
pnpm dev                        # Next.js on http://localhost:3000
```

## Production Deployment

1. Build the Docker image:

   ```bash
   docker build -t ghcr.io/your‑org/seemianki:latest .
   ```

2. Run with your preferred orchestrator (Docker Compose, Kubernetes, Fly.io, etc.)
   Supply environment variables for the database, secrets, and TLS.

A reference `docker‑compose.yml` lives in `/deploy/` for quick trials.

## Roadmap

### MVP (v0.1) — UI & Core Inventory

* **UI foundation** – build reusable graph, table, and dashboard components (shadcn/ui + Recharts) to visualise data fast.
* **Hardware & software inventory** – ingest via osquery.
* **Munki & Cimian hooks** – add stub modules to accept data from [Munki swift‑cli](https://github.com/munki/munki/tree/swift-cli) and [Cimian](https://github.com/windowsadmins/cimian/tree/dev).
* Simple auth & project scaffolding.

### Phase 1 (v0.2) — MunkiReport Parity

* Replicate key MunkiReport modules (inventory, install\_history, disk\_report, network, security).
* Event pipeline for Munki/Cimian post‑flight JSON uploads.
* Configurable widgets & saved dashboard layouts.

### Phase 2 (v0.3) — Advanced Visualisations

* Drill‑down views, filtering, and search.
* Time‑series compliance & failure trends.
* Alert thresholds & e‑mail / Slack hooks.

### Phase 3 (v0.4) — Extensibility

* Public SDK for custom modules.
* Webhook/event bus for external integrations.
* Role‑based access control (RBAC).

### Phase 4 (v1.0) — Production Hardening

* Multi‑tenant & HA deployment (Kubernetes Helm chart).
* Complete docs, migration tooling, and upgrade paths.

##
