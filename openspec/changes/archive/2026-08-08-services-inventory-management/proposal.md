## Why

Renaming the "Cuentas & Perfiles" section to **"Servicios"** aligns with the broader catalog of digital products managed by StreamCell (Streaming, Software, and Artificial Intelligence). Providing complete management of created services—including adding new profiles after account creation, editing profile details, and full service deletion—gives administrators total operational control.

Enabling administrators to add new profiles/slots to an existing service after creation allows flexible expansion when a service is expanded or remaining slots are added over time.

## What Changes

- **Adding Profiles to Existing Services**:
  - Update `PUT /accounts/:id` controller in `accountController.ts` to handle creating brand new profile entities (`if (!p.id)`) inside the database transaction.
  - Add a `+ Agregar Perfil / Cupo` button in the Edit Modal header in `AccountsPage.tsx`, allowing administrators to dynamically append new profiles to an existing active service.
- **Mobile-Friendly Modal Layout & Centered Action Buttons**:
  - Redesign modal action footers in `AccountsPage.tsx` with centered layout (`flex-col sm:flex-row items-center justify-center gap-3 w-full`).
  - Upgrade "Guardar Cambios" to a prominent centered brand gradient button (`bg-gradient-to-r from-blue-600 to-purple-600`).
- **Brand-Aligned Toast Notifications**:
  - Integrate a toast notification component featuring StreamCell's brand aesthetics (blue/purple gradients, Lucide React icons, dark/light glassmorphism) and welcoming, formal tone of voice.
- **Prisma Transaction Timeout Configuration for Supabase**:
  - Configure `{ maxWait: 10000, timeout: 30000 }` on all `prisma.$transaction` calls in `accountController.ts`.
- **Guaranteed Sale & Subscription Update Persistence**:
  - Fix `SubscriptionStatus` enum in `accountController.ts` using `CANCELLED_NO_DEBT` (instead of invalid `CANCELLED`).
  - Update `updateAccount` in `accountController.ts` with fallback `userId` lookup (`tx.user.findFirst()`) and unique timestamp-randomized `saleCode` generation.
- **Timezone Date Formatting Fix**:
  - Update `formatDateCO` in `frontend/src/utils/formatters.ts` to parse YYYY-MM-DD components directly.
- **Section Renaming ("Servicios")**:
  - Update `Sidebar.tsx`, `BottomNav.tsx`, and `AccountsPage.tsx` navigation labels and page headers from "Cuentas & Perfiles" / "Cuentas" to **"Servicios"**.

## Capabilities

### New Capabilities

- `services-inventory-management`: Full service editing, adding new profiles to existing services, service deletion (`DELETE /accounts/:id`), searchable client lookup for sold profiles, mobile-friendly modals with centered buttons, brand-aligned Toast notifications, unified platform catalog with dual pricing, search bar, and category filters.

### Modified Capabilities

- `mobile-pwa-responsive`: Extend mobile modal layouts and centered buttons for mobile PWA usage.

## Impact

- **Backend (`/backend`)**: Handle new profile creation (`!p.id`) in `PUT /accounts/:id`, configure 30s Prisma transaction timeout, correct `SubscriptionStatus` enum, robust `Sale` creation with `userId` fallback.
- **Frontend (`/frontend`)**: Add `+ Agregar Perfil / Cupo` button in Edit Modal in `AccountsPage.tsx`.
