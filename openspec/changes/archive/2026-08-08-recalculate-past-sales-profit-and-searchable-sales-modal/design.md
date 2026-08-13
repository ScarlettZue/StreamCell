## Context

See `proposal.md` for motivation. Historical sales records store full account cost (e.g. `$ 40.000`) instead of proportional cost (`$ 40.000 / 5 = $ 8.000`), yielding incorrect negative net profits in the sales ledger table. Also, plain `<select>` dropdowns in `SalesPage.tsx` make selecting clients and inventory profiles tedious.

## Goals / Non-Goals

**Goals:**
- Recalculate historical sales records in PostgreSQL via a backend script/endpoint so that `totalCost`, `unitCost`, `netProfit`, and `subtotalProfit` reflect proportional unit costs and positive profits.
- Upgrade `SalesPage.tsx` Quick Sale modal with searchable text inputs for Client selection (Name/Phone filter) and Profile selection (Platform/Email/Profile filter).

## Decisions

### 1. Database Recalculation Execution
- **Decision**: Create a execution endpoint or auto-run database correction script in `saleController.ts` / server startup that queries all completed sales with associated profiles, calculates `proportionalUnitCost = product.defaultCost / profilesCount`, updates `SaleDetail.unitCost`, `SaleDetail.subtotalProfit`, `Sale.totalCost`, and `Sale.netProfit`.
- **Rationale**: Fixes all historical sales data immediately without requiring manual data editing.

### 2. Autocomplete Search Dropdowns in Quick Sale Modal
- **Decision**: Replace HTML `<select>` elements with `<input type="text">` search controls in `SalesPage.tsx` with filtered floating dropdown option lists.
- **Rationale**: Allows rapid searching by typing client phone/name and searching profiles by platform/email/profile name.

## Risks / Trade-offs

- **[Risk]** Non-profile sales (if any) or missing product profile counts → **Mitigation**: Fallback to `profilesCount || 1`.
