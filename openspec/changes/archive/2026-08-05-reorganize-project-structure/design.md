## Context

StreamCell currently has frontend and backend codebases, but frontend branding assets (logos) reside in `docs/logo/`, mixing documentation repository concerns with web application runtime static assets. Furthermore, establishing explicit folder organizational standards ensures long-term scalability as new features (WhatsApp notifications, client subscriptions, billing alerts, streaming accounts) are added.

## Goals / Non-Goals

**Goals:**
- Relocate all brand images (`logo.png`, `logopublicidad.png`, `logowpp.png`) from `docs/logo/` into `frontend/public/assets/logo/` and `frontend/src/assets/logo/`.
- Establish a clear Feature-driven / Modular structure for `frontend/src/`.
- Maintain and refine Clean / Layered Architecture in `backend/src/` (`domain`, `application`, `infrastructure`, `presentation`).
- Provide an architectural blueprint document in `docs/05-arquitectura.md` explaining file structure conventions.

**Non-Goals:**
- Modifying underlying database schemas or API endpoints logic.
- Adding new UI features beyond updating logo image paths.

## Decisions

### Decision 1: Relocate Logos to `frontend/public/assets/logo/` & `frontend/src/assets/logo/`
- **Choice**: Place public static branding logos in `frontend/public/assets/logo/` for direct URL referencing (e.g. `<img src="/assets/logo/logo.png" />`) and bundled imports in `frontend/src/assets/logo/`.
- **Rationale**: Vite automatically serves assets inside `public/` at the root path during runtime and production builds, removing dependence on external or doc relative paths.
- **Alternatives Considered**: Keeping logos in `docs/logo/` (rejected: causes broken links in production builds and pollutes doc repository with heavy binaries).

### Decision 2: Frontend Directory Blueprint (Feature & Layer Hybrid)
- **Choice**: Structure `frontend/src/` as:
  ```text
  frontend/
  ├── public/
  │   └── assets/
  │       └── logo/
  │           ├── logo.png
  │           ├── logopublicidad.png
  │           └── logowpp.png
  └── src/
      ├── assets/           # Bundled styles, SVGs, static assets
      ├── components/       # Shared UI components (Modals, Tables, Cards, Inputs)
      ├── features/         # Feature-sliced modules (clients, accounts, subscriptions)
      │   ├── clients/
      │   ├── accounts/
      │   └── billing/
      ├── hooks/            # Shared React custom hooks
      ├── pages/            # Page view entry points (ClientsPage, AccountsPage)
      ├── services/         # API HTTP communication services
      ├── types/            # Global TypeScript definitions
      └── utils/            # Formatters (currency, COP, Latin dates)
  ```

### Decision 3: Backend Clean Architecture Structure
- **Choice**: Structure `backend/src/` into strict layers:
  ```text
  backend/
  └── src/
      ├── config/           # Envs, Prisma connection, Supabase pooler setup
      ├── domain/           # Core Entities & Interface Contracts
      ├── application/      # Use Cases & DTOs
      ├── infrastructure/   # Prisma Repositories & External API Services (WhatsApp)
      ├── presentation/     # Express Controllers, Routes, Middleware
      └── utils/            # Error handling, Logger
  ```

## Risks / Trade-offs

- **[Broken Image Paths]** → Update all existing UI components (e.g., Header, Navbar, ClientDetailsModal) referencing `docs/logo` or local logo files to point to `/assets/logo/logo.png`.
- **[Git Repository Size]** → Large logo files removed from `docs/` and tracked in `frontend/public/`. Standardize image formats and optimization.
