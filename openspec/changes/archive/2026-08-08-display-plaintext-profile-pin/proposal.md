## Why

In `ClientsPage.tsx` ("Detalle del Usuario") and other profile detail views, profile PINs are currently displayed as raw encrypted hex hashes (e.g. `54e315152443195ce7828c708da5dd04:...`), causing text overflow, layout distortion, and preventing administrators and users from reading the actual profile access PINs. The system needs to ensure profile PINs are decrypted before returning API responses or stored in plain text so that they render legibly as 4-digit PINs across all frontend modals.

## What Changes

- **Plaintext / Decrypted Profile PIN Display**: Ensure profile PIN fields are decrypted in backend responses (`clientController.ts`, `accountController.ts`, `subscriptionController.ts`) or properly handled so frontend UI components display the original 4-digit PIN (or "Sin PIN" if absent).
- **UI Layout Overflow Fix**: Fix the CSS layout grid in `ClientsPage.tsx` User Detail modal ("Cuentas & Perfiles" tab) to prevent text overlap between "PIN DE PERFIL" and "FECHAS DE SERVICIO".

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Updates profile PIN behavior requirement to guarantee plain text 4-digit PIN visibility across all user account detail views without encryption hash distortion.

## Impact

- Backend: `backend/src/presentation/controllers/clientController.ts`, `backend/src/infrastructure/security/security.ts` (or `accountController.ts`)
- Frontend: `frontend/src/pages/ClientsPage.tsx`
