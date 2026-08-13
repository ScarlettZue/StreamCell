## Context

See `proposal.md` for motivation. `AccountsPage.tsx` currently renders account cards in a 2-column layout (`grid-cols-1 md:grid-cols-2`) with all profile items expanded directly inside the card body, consuming significant screen real estate.

## Goals / Non-Goals

**Goals:**
- Convert the grid container to `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` in `AccountsPage.tsx`.
- Create an `expandedAccountId` state variable or set of expanded IDs `expandedAccountIds: Set<string>` in `AccountsPage.tsx`.
- Render cards in a compact, sleek form factor showing Platform name, Category tag, Email, Expiration date, Edit button, and a toggle badge showing available profiles count + expansion arrow icon (`ChevronDown`/`ChevronUp`).
- Clicking anywhere on the card header or toggle button expands/collapses the profile details list.

## Decisions

### 1. Per-Card Expansion State with Toggle Icon
- **Decision**: Track expanded card IDs in `AccountsPage.tsx` using `expandedAccountIds: Record<string, boolean>` state.
- **Rationale**: Allows administrators to expand multiple cards simultaneously or toggle individual accounts as needed without page jumps.

## Risks / Trade-offs

- **[Risk]** Edit button click propagation opening/closing accordion → **Mitigation**: Use `e.stopPropagation()` on the `Editar / Renovar` button click handler so clicking edit opens the modal without toggling the accordion state.
