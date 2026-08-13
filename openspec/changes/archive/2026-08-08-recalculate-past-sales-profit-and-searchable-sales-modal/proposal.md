## Why

In StreamCell, historical sales recorded prior to the proportional profile unit cost fix carry incorrect full mother account costs (e.g., `$ 40.000` instead of `$ 8.000`), resulting in distorted negative net profits (e.g., `-$ 28.000`). Additionally, administrators using the "Registrar Venta Rápida" modal in `SalesPage.tsx` find static HTML `<select>` dropdowns cumbersome for large inventories and client databases, requiring real-time searchable text inputs for finding clients by Name/Phone and selecting available profiles by Platform/Email/Profile Name.

## What Changes

- **Historical Sales Cost & Profit Recalculation**: Run a database correction script/endpoint that recalculates `unitCost`, `totalCost`, `netProfit`, and `subtotalProfit` for existing profile sale records based on `motherAccountBaseCost / totalProfiles` so all past sales display accurate positive net profits.
- **Searchable Autocomplete for Clients in Quick Sale Modal**: Replace the plain Client `<select>` dropdown in `SalesPage.tsx` with a live searchable text input allowing search by Client Name or Phone number with a custom interactive dropdown list.
- **Searchable Autocomplete for Profiles in Quick Sale Modal**: Replace the plain Profile `<select>` dropdown in `SalesPage.tsx` with a live searchable text input allowing search by Platform Name, Profile Name, or Account Email.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Recalculates historical sales costs and updates the quick sale modal with live searchable client and profile selection inputs.

## Impact

- Backend: Data script / migration endpoint updating `sale` and `saleDetail` records.
- Frontend: `frontend/src/pages/SalesPage.tsx` Quick Sale modal.
