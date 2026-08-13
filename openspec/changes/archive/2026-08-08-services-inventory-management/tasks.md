## 1. Backend Schema & Controller Updates

- [x] 1.1 Update `backend/prisma/schema.prisma` adding `ProductCategory` enum (`STREAMING`, `SOFTWARE`, `IA`) and `category` field on `Product` model
- [x] 1.2 Add `fullAccountPrice` field (`Decimal?`) to `Product` model in `backend/prisma/schema.prisma`
- [x] 1.3 Run `npx prisma db push` and `npx prisma generate` to sync database schema
- [x] 1.4 Update `backend/src/presentation/controllers/productController.ts` and `accountController.ts` handling `fullAccountPrice` and `category` selection
- [x] 1.5 Add `updateProduct` endpoint (`PUT /products/products/:id`) in `productController.ts` and `productRoutes.ts` to allow editing existing platforms
- [x] 1.6 Add `updateAccount` endpoint (`PUT /accounts/:id`) in `accountController.ts` and `accountRoutes.ts` to allow editing and renewing created services
- [x] 1.7 Support updating profiles list in `PUT /accounts/:id` and add `deleteAccount` endpoint (`DELETE /accounts/:id`) in `accountController.ts` and `accountRoutes.ts`
- [x] 1.8 Normalize `startDate` and `dueDate` date string parsing in `accountController.ts` using noon UTC to prevent day-rollback shifts
- [x] 1.9 Fix profile subscription sync in `updateAccount` in `accountController.ts` (cancelling subs on unsold profiles, reassigning clients, resetting PINs)
- [x] 1.10 Implement guaranteed `userId` fallback and unique `saleCode` in `updateAccount` controller in `accountController.ts`
- [x] 1.11 Fix undefined `now` variable reference in `createAccount` in `accountController.ts`
- [x] 1.12 Support creating brand new profiles (`if (!p.id)`) inside `updateAccount` transaction loop in `accountController.ts`

## 2. Navigation & UI Renaming

- [x] 2.1 Update `frontend/src/components/layout/Sidebar.tsx` changing "Cuentas & Perfiles" to **"Servicios"**
- [x] 2.2 Update `frontend/src/components/layout/BottomNav.tsx` changing "Cuentas" to **"Servicios"**
- [x] 2.3 Update `frontend/src/types/index.ts` adding `fullAccountPrice` field to `IProduct`

## 3. Search Bar, Category Filters, Platform Dual-Pricing & Service/Profile Editing/Deletion

- [x] 3.1 Update `frontend/src/pages/AccountsPage.tsx` page header title to **"Servicios & Cuentas Digitales"**
- [x] 3.2 Add Search Bar input and Category Filter tabs (**Todos**, **Streaming**, **Software**, **IA**) to `AccountsPage.tsx`
- [x] 3.3 Add `updateProduct` in `frontend/src/services/productService.ts` with `fullAccountPrice`
- [x] 3.4 Update Platform Management modal in `AccountsPage.tsx` configuring 3 price fields (Costo Base, Precio Perfil, Precio Cuenta Completa) per platform
- [x] 3.5 Update Account Creation modal in `AccountsPage.tsx` allowing sale mode selection (Venta por Perfiles vs Venta Cuenta Completa)
- [x] 3.6 Remove redundant "Usuario / Email del cliente" text field from profile items in `AccountsPage.tsx`
- [x] 3.7 Add real-time searchable client lookup input (filtering strictly by Name or Phone) when marking a profile as sold (`¿Perfil vendido?`) in `AccountsPage.tsx`
- [x] 3.8 Add `updateAccount` in `frontend/src/services/accountService.ts`
- [x] 3.9 Add "Editar / Renovar" button to service cards and build Service Editing/Renewal Modal in `AccountsPage.tsx`
- [x] 3.10 Add `deleteAccount` in `frontend/src/services/accountService.ts`
- [x] 3.11 Add profile editing list and "Eliminar Servicio" button with confirmation step in Edit Modal in `AccountsPage.tsx`
- [x] 3.12 Update `formatDateCO` in `frontend/src/utils/formatters.ts` to directly extract YYYY-MM-DD components without timezone shift
- [x] 3.13 Invalidate `accounts`, `availableProfiles`, `clients`, and `expirations` queries in `AccountsPage.tsx` upon successful account update
- [x] 3.14 Add `onError` alert to `updateAccountMutation` in `AccountsPage.tsx`
- [x] 3.15 Redesign mobile modal action footer in `AccountsPage.tsx` centering main action buttons ("Guardar Cambios", "Cancelar", "Eliminar Servicio") with brand styling
- [x] 3.16 Create brand Toast notification system with StreamCell's welcoming and formal tone of voice and integrate with service updates
- [x] 3.17 Add `+ Agregar Perfil` button in Edit Service Modal header in `AccountsPage.tsx` allowing users to append new profiles to an existing service

## 4. Verification & Build Checks

- [x] 4.1 Run TypeScript typecheck and build on `frontend` (`npm run build`)
