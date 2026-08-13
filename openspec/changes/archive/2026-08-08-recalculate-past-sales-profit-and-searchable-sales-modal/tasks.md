## 1. Historical Sales Profit Recalculation (Backend)

- [x] 1.1 Add automatic database recalculation function in `backend/src/presentation/controllers/saleController.ts` that recalculates `totalCost`, `unitCost`, `netProfit`, and `subtotalProfit` for past sales using proportional acquisition costs (`motherAccountCost / profilesCount`)
- [x] 1.2 Add `/sales/recalculate` GET/POST endpoint in `saleRoutes.ts` to trigger past sales profit correction
- [x] 1.3 Add cleanup function in `saleController.ts` to delete specified test sale records (`VTA-1785979287085-3P6HJ`, `VTA-1785978531179-GZNEA`, `VTA-305279`) and their associated details/subscriptions from the database

## 2. Interactive Search Autocomplete for Client and Profile (Frontend)

- [x] 2.1 Update `frontend/src/pages/SalesPage.tsx` replacing Client `<select>` dropdown with a live searchable text input matching Client Name or Phone number with floating dropdown options list
- [x] 2.2 Update `SalesPage.tsx` replacing Profile `<select>` dropdown with a live searchable text input matching Platform Name, Profile Name, or Account Email with floating dropdown options list

## 3. Verification & Typecheck

- [x] 3.1 Run TypeScript typecheck and build on `backend` (`npm run build`)
- [x] 3.2 Run TypeScript typecheck and build on `frontend` (`npm run build`)
