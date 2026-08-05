## 1. Backend & Data Model Updates

- [x] 1.1 Update `backend/prisma/schema.prisma` with `UserRole` enum (`CLIENTE`, `DISTRIBUIDOR`) and debt fields in `Client` model
- [x] 1.2 Run Prisma generation and schema push (`npx prisma generate` & `npx prisma db push`)
- [x] 1.3 Update backend entities, DTOs, controllers, and repositories for user role and debt handling

## 2. Navigation & UI Structure

- [x] 2.1 Update `frontend/src/components/layout/Sidebar.tsx` renaming navigation entry from "Clientes & Deudas" to "Usuarios"

## 3. Users Listing, Filtering & Creation

- [x] 3.1 Update `NewClientModal.tsx` adding role selection field (`CLIENTE` / `DISTRIBUIDOR`)
- [x] 3.2 Update `ClientsPage.tsx` implementing search bar (Name/Phone) and role filter selector (`Todos`, `Cliente Final`, `Distribuidor`)

## 4. User Details Modal / Drawer Enhancements

- [x] 4.1 Update `ClientDetailsModal.tsx` implementing tabbed view for Profile/WhatsApp, Active Streaming Accounts, Purchase History, and Debt Status ($ COP & unpaid days)

## 5. Verification & Build Checks

- [x] 5.1 Run TypeScript typecheck and build on `frontend` (`npm run build`)
- [x] 5.2 Run TypeScript typecheck and build on `backend` (`npm run build`)
