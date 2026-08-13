## Context

See `proposal.md` for motivation. Currently, `SalesPage.tsx` defines `startDate` and `endDate` as non-reactive `useState` values without exposing `<input type="date">` elements in the "Registrar Venta Rápida" modal form.

## Goals / Non-Goals

**Goals:**
- Make `startDate` and `endDate` state variables fully reactive with setters (`setStartDate`, `setEndDate`) in `SalesPage.tsx`.
- Render a 2-column `<input type="date">` container in the Quick Sale modal form (`Fecha Inicio del Servicio` and `Fecha Vencimiento (+30 días por defecto)`).
- Automatically update `endDate` to +30 days whenever `startDate` is changed by the user, while still allowing manual override of `endDate`.

## Decisions

### 1. Reactive Date State and Auto-30 Days recalculation
- **Decision**: Update `startDate` handler so when the user selects a new start date, `endDate` automatically recalculates to `startDate + 30 days`. The user can also directly edit `endDate` to set any custom duration.
- **Rationale**: Provides speed by default (+30 days) while preserving complete flexibility.

## Risks / Trade-offs

- **[Risk]** Timezone offset shifts when formatting `YYYY-MM-DD` strings → **Mitigation**: Use local date component getters (`getFullYear()`, `getMonth()`, `getDate()`) to stringify `YYYY-MM-DD`.
