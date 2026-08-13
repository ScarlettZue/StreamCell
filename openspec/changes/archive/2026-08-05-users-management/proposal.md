## Why

The current platform labels customer management as "Clientes & Deudas", but StreamCell manages both end-user clients ("Cliente Final") and reseller partners ("Distribuidor"). Renaming the section to **"Usuarios"** and supporting roles allows StreamCell to unify customer databases, support role-based filtering, track distributor volume, and present clear detail views for purchase history, active streaming accounts, debt tracking (including partial unpaid days), and direct WhatsApp interaction.

## What Changes

- **Navigation UI**: Rename section from "Clientes & Deudas" to **"Usuarios"** in the Sidebar navigation and page headers.
- **User Roles & Database Schema**: Add `role` enum (`CLIENTE`, `DISTRIBUIDOR`) to the client/user model, defaulting to `CLIENTE`.
- **Search & Role Filtering**: Add search input (name, phone) and role selector filter (`Todos`, `Cliente Final`, `Distribuidor`) in the Users view.
- **User Registration Modal**: Update user creation form to allow selecting role (`CLIENTE` vs `DISTRIBUIDOR`).
- **User Detail Drawer/Modal**: Enhance detail modal with tabbed or structured views for:
  - Basic Profile & Role tag.
  - Active Accounts / Profiles (`Cuentas activas`).
  - Purchase History (`Historial de compras`).
  - Debt & Payment Status (`Deudas / Días pendientes`).
  - Direct WhatsApp Action button (`wa.me/57...`).

## Capabilities

### New Capabilities

*(None - expanding existing customer billing capability)*

### Modified Capabilities

- `customer-subscriptions-billing`: Add user role support (`CLIENTE` / `DISTRIBUIDOR`), update UI section name to "Usuarios", add role-based filtering, and enhance user detail views with active accounts, purchase history, and debt tracking.

## Impact

- **Frontend (`/frontend`)**: Update `Sidebar.tsx`, `ClientsPage.tsx` (or `UsersPage.tsx`), `ClientDetailsModal.tsx`, and `NewClientModal.tsx`.
- **Backend (`/backend`)**: Update Prisma schema to include user role (`role: CLIENTE | DISTRIBUIDOR`), update client DTOs, controllers, repositories, and migration/seeds.
