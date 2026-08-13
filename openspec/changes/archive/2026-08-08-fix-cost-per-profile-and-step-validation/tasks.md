## 1. Input Step Validation Fix (Frontend)

- [x] 1.1 Update `frontend/src/pages/AccountsPage.tsx` platform cost inputs (`Costo Base de Adquisición`, `Precio Perfil`, `Precio Cuenta Completa`) replacing `step="500"` with `step="any"`
- [x] 1.2 Update all other numeric inputs across modals in `AccountsPage.tsx` to set `step="any"` so custom amounts like `44900` pass HTML5 validation seamlessly

## 2. Proportional Unit Cost per Profile Calculation (Backend & Financial Reporting)

- [x] 2.1 Update backend account controller (`backend/src/presentation/controllers/accountController.ts`) to calculate profile acquisition cost proportionally as `basePrice / totalProfiles` when selling an individual profile
- [x] 2.2 Ensure full account sales ("Venta Cuenta Completa") retain the full `basePrice` as acquisition cost
- [x] 2.3 Verify cash register / financial reporting logic in `accountController.ts` and metrics endpoints reflect the proportional unit cost for profile sales

## 3. Verification & Typecheck

- [x] 3.1 Run TypeScript typecheck and build on `backend` (`npm run build`)
- [x] 3.2 Run TypeScript typecheck and build on `frontend` (`npm run build`)
