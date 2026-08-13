## Why

Distributors act as resellers who manage their own network of end-user clients. Currently, all clients exist at the top level without organizational hierarchy. Linking clients to a specific distributor allows StreamCell to track client volume per reseller, view distributor client networks in the detail modal, and calculate reseller sales performance.

## What Changes

- **Database Model**: Add `distributorId` optional self-relation on `Client` (`distributorId String?` pointing to another `Client` with role `DISTRIBUIDOR`).
- **User Creation & Editing**: Include an optional dropdown *"Distribuidor Asociado (Opcional)"* when creating or editing a user with role `CLIENTE`.
- **Users Directory View**: Display the associated distributor badge or name on client rows.
- **Distributor Detail View**: Add a dedicated **"Clientes Asignados"** tab in `ClientDetailsModal` when opening a Distributor user, listing all clients under their network with their current active accounts and debts.

## Capabilities

### New Capabilities

*(None - expanding customer subscriptions capability)*

### Modified Capabilities

- `customer-subscriptions-billing`: Support linking clients to distributors, displaying associated distributor details, and listing assigned sub-clients inside distributor profile modals.

## Impact

- **Backend (`/backend`)**: Update Prisma schema with self-relation on `Client` (`distributorId`), update DTOs, controllers, and queries to include distributor details.
- **Frontend (`/frontend`)**: Update `IClient` interface, `clientService`, `ClientsPage.tsx` forms/tables, and `ClientDetailsModal.tsx` distributor tab.
