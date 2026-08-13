## Why

In `AccountsPage.tsx` ("Catálogo e Inventario de Servicios"), account cards display all profiles inline by default across 2 wide columns, creating long vertical lists that make catalog navigation cumbersome. Administrators need a compact, high-density 4-column desktop grid where account cards display summary headers (Platform, Category, Email, Expiration, Edit button) by default, allowing profile details to expand dynamically when the card is clicked.

## What Changes

- **4-Column Responsive Grid Layout**: Re-layout the account cards grid in `AccountsPage.tsx` using `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` for high density on desktop viewports.
- **Compact Card View with Expandable Profile Accordion**: By default, render cards in compact mode showing platform name, service type badge, account email, expiration date, edit/renew button, and a profile summary pill. Clicking on the card toggles an expandable accordion displaying the full profile list and PINs without cluttering the main grid view.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Updates the inventory visual layout to a 4-column grid with collapsible profile details.

## Impact

- Frontend UI: `frontend/src/pages/AccountsPage.tsx`
