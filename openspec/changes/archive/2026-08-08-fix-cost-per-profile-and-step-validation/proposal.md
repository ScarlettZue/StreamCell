## Why

In StreamCell, administrators encountered a browser input validation error preventing non-multiple values (such as `$ 44.900 COP`) in base cost and price inputs because `<input type="number">` contained restrictive `step` attributes (such as `step="500"`). Additionally, when a profile/screen was sold from a mother account, the financial/cash register calculations recorded the full account base cost (e.g. `$ 44.900`) as the unit cost for a single profile instead of dividing the mother account base cost by the total number of profiles/screens (e.g. `$ 44.900 / 5 = $ 8.980`).

## What Changes

- **Input Validation Step Fix**: Update all price/cost `<input type="number">` elements across frontend forms (Product management modal, Account creation & renewal modals) to use `step="any"` or `step="1"` so exact amounts like `$ 44.900` are permitted without HTML5 step validation errors.
- **Proportional Profile Unit Cost Calculation**: Update backend and frontend cost reporting logic so that when selling an individual profile, the cost attributed to that profile is calculated proportionally as `motherAccountBaseCost / totalProfiles` (e.g. `$ 44.900 / 5 = $ 8.980`), reserving the full base cost only for "Venta Cuenta Completa" (Full Account Sale) transactions.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Updates unit cost calculation for profile sales to be proportional to total profiles and allows flexible numeric step inputs.

## Impact

- Frontend: `frontend/src/pages/AccountsPage.tsx` and modal forms.
- Backend: `backend/src/presentation/controllers/accountController.ts` or transaction/subscription creation logic calculating financial metrics and profits.
