## 1. Backend PIN Decryption

- [x] 1.1 Update `backend/src/presentation/controllers/clientController.ts` (`getClientById`) and related endpoints to decrypt `accountProfile.pin` (using `decryptField` from `security.ts`) before returning response data to the frontend

## 2. Frontend User Detail Modal Layout Fix

- [x] 2.1 Update profile subscription cards layout in `frontend/src/pages/ClientsPage.tsx` User Detail modal ("Cuentas & Perfiles" tab) to use a responsive grid with proper `truncate` classes, preventing text overlap between "PIN DE PERFIL" and "FECHAS DE SERVICIO"

## 3. Verification & Build Checks

- [x] 3.1 Run TypeScript typecheck and build on `backend` (`npm run build`)
- [x] 3.2 Run TypeScript typecheck and build on `frontend` (`npm run build`)
