## Context

See `proposal.md` for motivation. Administrators encounter browser HTML5 step validation blocking inputs like `44900` in price fields, and cash register calculations attribute full mother account cost to individual sold profiles instead of dividing the base cost among total profiles/screens.

## Goals / Non-Goals

**Goals:**
- Update all `<input type="number">` fields for pricing/cost across frontend modal dialogs to use `step="any"` or `step="1"`.
- Implement proportional cost per profile logic (`motherAccountBaseCost / totalProfiles`) in financial metrics, cash register reporting, and account sales endpoints.

**Non-Goals:**
- Modifying client debt tracking or modifying database table schemas.

## Decisions

### 1. Change HTML step attributes to `step="any"`
- **Decision**: Update form inputs for price and cost fields from `step="500"` to `step="any"`.
- **Rationale**: Allows users to type exact custom amounts (e.g., `$ 44.900`) without triggering native browser step validation popups.

### 2. Proportional Unit Cost per Profile Calculation
- **Decision**: In financial metrics calculations and account sale handlers, when a profile subscription is sold, set profile acquisition cost = `account.basePrice / account.profiles.length` (or `account.totalProfiles`). When a full account is sold, set acquisition cost = `account.basePrice`.
- **Rationale**: Reflects realistic profit margins in cash register summaries when selling individual screens of a multi-profile account.

## Risks / Trade-offs

- **[Risk]** Potential division by zero if total profiles is 0 → **Mitigation**: Fallback to `totalProfiles || 1`.
