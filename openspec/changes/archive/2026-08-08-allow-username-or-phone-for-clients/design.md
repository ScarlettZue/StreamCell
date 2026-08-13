## Context

See `proposal.md` for motivation. Currently `phone` fields in client/user creation schemas require digits. With WhatsApp usernames, `phone` should accept either a phone number or a `@username`.

## Goals / Non-Goals

**Goals:**
- Update Zod validation in `backend/src/presentation/controllers/clientController.ts` and `userController.ts` so `phone` field allows strings containing digits or starting with `@` (min length 3).
- Update frontend input placeholders and labels from "Número de Celular" to "Número de Celular o @Usuario" with placeholder `Ej. 300 123 4567 o @usuario`.
- Update `formatWhatsAppLink` helper in `frontend/src/utils/formatters.ts` so that:
  - If input starts with `@` or contains letters: strip `@` or keep username format and generate `https://wa.me/username` (or `https://wa.me/@username`).
  - If input is strictly numeric: strip non-digits and add Colombia prefix `57` (`https://wa.me/573...`).

## Decisions

### 1. Unified `phone` Field Storage
- **Decision**: Store both numeric phone numbers and WhatsApp `@usernames` in the existing `phone` database column without requiring DB migration.
- **Rationale**: Keeps database schema unchanged while providing immediate support across all pages (`UsersPage`, `ClientsPage`, `AccountsPage`, `ExpirationsPage`, `SalesPage`).

## Risks / Trade-offs

- **[Risk]** WhatsApp web link formatting for usernames vs numbers → **Mitigation**: Update `formatWhatsAppLink` helper to check if the string starts with `@` or contains letters before applying numeric cleaning.
