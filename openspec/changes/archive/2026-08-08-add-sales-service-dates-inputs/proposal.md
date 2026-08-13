## Why

In the StreamCell sales section (`SalesPage.tsx`), administrators registering a quick sale ("Registrar Venta Rápida") cannot view or modify the service start date or expiration date because the modal currently lacks date input fields. This prevents setting custom billing periods or adjusting subscription durations (defaulting to 30 days but fully customizable).

## What Changes

- **Interactive Service Dates in Quick Sale Modal**: Add interactive `<input type="date">` fields for `Fecha de Inicio del Servicio` (defaulting to today) and `Fecha de Vencimiento / Fin del Servicio` (defaulting to +30 days from start date, but dynamically recalculating or allowing direct user edit) in `frontend/src/pages/SalesPage.tsx`.
- **Dynamic Date Binding**: Ensure `startDate` and `endDate` state variables are fully reactive and editable by the user before submitting the sale transaction to the backend.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Adds interactive start and expiration date configuration fields during quick sale registration.

## Impact

- Frontend: `frontend/src/pages/SalesPage.tsx`
- Backend API: `saleController.ts` already accepts `serviceStartDate` and `serviceEndDate` parameters.
