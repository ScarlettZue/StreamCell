## 1. Backend & Data Model Updates

- [x] 1.1 Update `backend/prisma/schema.prisma` adding `distributorId` self-relation on `Client` model
- [x] 1.2 Run Prisma schema push (`npx prisma db push`)
- [x] 1.3 Update `clientController.ts` adding `distributorId` support and including `distributor` and `subClients` relations in JSON responses

## 2. Frontend Types & Service Updates

- [x] 2.1 Update `frontend/src/types/index.ts` adding `distributorId`, `distributor`, and `subClients` properties to `IClient`
- [x] 2.2 Update `frontend/src/services/clientService.ts` passing `distributorId` on create and update methods

## 3. Directory UI & Form Enhancements

- [x] 3.1 Update `ClientsPage.tsx` adding *"Distribuidor Asociado (Opcional)"* select input in Create and Edit User modals
- [x] 3.2 Update `ClientsPage.tsx` table rows showing associated distributor name badge for clients

## 4. Distributor Detail View Enhancements

- [x] 4.1 Update `ClientDetailsModal.tsx` adding **"Clientes Asignados"** tab for Distributor profiles, listing their assigned sub-clients with active accounts and debts

## 5. Verification & Build Checks

- [x] 5.1 Run TypeScript typecheck and build on `frontend` (`npm run build`)
- [x] 5.2 Run TypeScript typecheck and build on `backend` (`npm run build`)
