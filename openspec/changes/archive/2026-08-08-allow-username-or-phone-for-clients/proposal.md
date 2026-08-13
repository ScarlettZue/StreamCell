## Why

In StreamCell, user/client registration currently restricts contact entry to 10-digit mobile phone numbers. With WhatsApp's recent updates allowing usernames (`@username`) instead of displaying phone numbers for all contacts, administrators need to register clients using either a numeric phone number OR a WhatsApp username (`@usuario`).

## What Changes

- **Flexible Contact Registration (Phone Number or WhatsApp @Username)**: Update user/client creation and edit modals across the platform (`UsersPage.tsx`, `ClientsPage.tsx`, `AccountsPage.tsx`, etc.) to accept either a numeric phone number (e.g. `3126622931`) or a WhatsApp username starting with `@` (e.g. `@tony_stream`).
- **Backend Schema Validation Update**: Update Zod validation schemas in `clientController.ts` and `userController.ts` to allow `phone` fields to contain alphanumeric strings starting with `@` or standard phone numbers (min 3 chars).
- **Smart WhatsApp URL Generation**: Update `wa.me` link builders to handle both phone numbers (adding country prefix `57`) and `@username` links (redirecting to `https://wa.me/username` or `https://wa.me/@username`).

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `customer-subscriptions-billing`: Modifies user/client contact requirement to support both numeric phone numbers and WhatsApp `@usernames`.

## Impact

- Backend: `backend/src/presentation/controllers/clientController.ts`, `backend/src/presentation/controllers/userController.ts`
- Frontend: `frontend/src/pages/UsersPage.tsx`, `frontend/src/pages/ClientsPage.tsx`, `frontend/src/pages/AccountsPage.tsx`, `frontend/src/pages/ExpirationsPage.tsx`, `frontend/src/utils/formatters.ts`
