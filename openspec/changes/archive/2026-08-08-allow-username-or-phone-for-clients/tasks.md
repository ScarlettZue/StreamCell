## 1. Backend Validation Update

- [x] 1.1 Update Zod schemas in `backend/src/presentation/controllers/clientController.ts` and `userController.ts` to allow `phone` fields to contain alphanumeric text starting with `@` or phone numbers

## 2. Frontend Forms & WhatsApp Link Formatting

- [x] 2.1 Update `formatWhatsAppLink` helper in `frontend/src/utils/formatters.ts` to support both numeric phone numbers and WhatsApp `@usernames`
- [x] 2.2 Update user and client creation/edit modal forms in `frontend/src/pages/UsersPage.tsx` and `ClientsPage.tsx` with updated labels ("Número de Celular o @Usuario") and placeholders (`Ej. 300 123 4567 o @usuario`)

## 3. Build & Verification

- [x] 3.1 Run TypeScript typecheck and build on `backend` (`npm run build`)
- [x] 3.2 Run TypeScript typecheck and build on `frontend` (`npm run build`)
