## Context

StreamCell manages clients and reseller distributors. The sidebar currently refers to "Clientes & Deudas", but expanding to "Usuarios" with roles (`CLIENTE` vs `DISTRIBUIDOR`) provides a flexible foundation for listing, filtering, and deep-diving into individual user profiles (active accounts, purchase history, debt status, and WhatsApp contact).

## Goals / Non-Goals

**Goals:**
- Update Prisma Schema with `UserRole` enum (`CLIENTE`, `DISTRIBUIDOR`) and fields for debt management.
- Update `Sidebar.tsx` navigation text to "Usuarios".
- Build an intuitive UI in `ClientsPage.tsx` (or `UsersPage.tsx`) with search (Name/Phone) and role/status filter tabs.
- Update `NewClientModal.tsx` to include role selection.
- Upgrade `ClientDetailsModal.tsx` to display tabs: Profile & WhatsApp, Active Accounts, Purchase History, and Debt Status ($ COP & unpaid days).

**Non-Goals:**
- Automated background payment processing gateway integration (payment entries will be recorded manually).

## Decisions

### Decision 1: Prisma Schema & Backend DTO Extensions
- Add `UserRole` enum (`CLIENTE`, `DISTRIBUIDOR`) to `schema.prisma`.
- Add `role UserRole @default(CLIENTE)` to `Client` model.
- Include debt details (`debtAmount`, `unpaidDays`, `debtNotes`) in `Client` entity and backend DTOs.

### Decision 2: React Portals Modal with Tabbed Interface
- Ensure all interactive modals use `createPortal(..., document.body)` with `z-[9999]`.
- Implement smooth tabbed navigation inside `ClientDetailsModal.tsx`:
  - **Pestaña 1: Perfil y WhatsApp** (Nombre, Celular con wa.me, Rol Badge).
  - **Pestaña 2: Cuentas Activas** (Perfiles de streaming asignados actualmente).
  - **Pestaña 3: Historial de Compras** (Ventas pasadas).
  - **Pestaña 4: Control de Deudas** (Monto en $ COP, días sin pagar, registro de abonos).

### Decision 3: Role & Search Filtering Logic
- Client-side and backend query support for searching `query` (matches name or phone) and filtering `role` (`ALL`, `CLIENTE`, `DISTRIBUIDOR`).

## Risks / Trade-offs

- **[Database Migration]** → Prisma schema update requires generating and applying migration or running `npx prisma db push`.
- **[Existing Seed/Data]** → Default existing clients to `CLIENTE` role so existing database records continue working seamlessly.
