## Why

Currently, brand assets such as logos are located inside `docs/logo/`, which violates separation of concerns because documentation directories should only contain text and reference specs, whereas the frontend web application requires public static assets directly accessible during development and production builds. Additionally, a clear and scalable folder structure needs to be formalized across both backend (Clean/Layered Architecture) and frontend (Feature-based / Modular structure) to support seamless growth of StreamCell.

## What Changes

- **Relocate Frontend Assets**: Move logo files (`logo.png`, `logopublicidad.png`, `logowpp.png`) from `docs/logo/` to `frontend/public/assets/logo/` and/or `frontend/src/assets/logo/` so Vite and React can serve them cleanly.
- **Frontend Scalable Structure**: Standardize modular/feature-based directory structure (`src/assets`, `src/components`, `src/features`, `src/hooks`, `src/pages`, `src/services`, `src/types`, `src/utils`, `src/layouts`).
- **Backend Scalable Structure**: Maintain and refine Clean/Layered Architecture (`src/domain`, `src/application`, `src/infrastructure`, `src/presentation`, `src/config`).
- **Documentation Cleanup**: Keep `docs/` exclusively for project markdown documentation, blueprints, requirements, and system diagrams.

## Capabilities

### New Capabilities

*(Skipped - pure refactor & project organization change with `skip_specs: true`)*

### Modified Capabilities

*(Skipped - pure refactor & project organization change with `skip_specs: true`)*

## Impact

- **Frontend (`/frontend`)**: Asset path references updated to use static public/assets URLs; component imports structured cleanly.
- **Documentation (`/docs`)**: Removed media image binaries from `docs/logo/`, maintaining clean document repository.
- **Project Root**: Standardized structure documented for easy onboarding and future scaling.
