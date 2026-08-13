## Context

See `proposal.md` for motivation. `pin` fields in `AccountProfile` are currently encrypted via `encryptField` or stored/returned as encrypted hex strings (`iv:content`), displaying long hash strings like `54e315152443195ce7828c708da5dd04:...` in client detail views.

## Goals / Non-Goals

**Goals:**
- Decrypt `pin` in `clientController.ts` (`getClientById`) when loading subscriptions and profile accounts, or ensure `decryptField(pin)` is called before returning client detail data.
- Update `ClientsPage.tsx` profile card layout in the User Detail modal ("Cuentas & Perfiles" tab) to use flexbox/grid layout (`grid-cols-3` or `flex justify-between`) so "PIN DE PERFIL" and "FECHAS DE SERVICIO" do not overlap or break visual alignment.
- Handle fallback display: if `pin` is present, render plain 4-digit PIN (e.g. `1010`), otherwise render `Sin PIN`.

## Decisions

### 1. Backend Decryption at Controller Level
- **Decision**: In `clientController.ts` (`getClientById`), map over subscriptions and decrypt `accountProfile.pin` (and `account.password` if encrypted) using `decryptField` from `security.ts`.
- **Rationale**: Ensures the API returns clean, readable PINs to the client detail modal without changing database records or breaking profile mutations.

### 2. Layout Grid Correction in User Detail Modal
- **Decision**: Update `ClientsPage.tsx` tab layout using `grid grid-cols-1 sm:grid-cols-3 gap-2 items-start` and `truncate` text handling to ensure text never overflows container boundaries.

## Risks / Trade-offs

- **[Risk]** Existing unencrypted PINs throwing decryption errors → **Mitigation**: Wrap `decryptField` in a try/catch or helper check: if the PIN does not contain a colon `:` or is a simple string, return it as-is.
