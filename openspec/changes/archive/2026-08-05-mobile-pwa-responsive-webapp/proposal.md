## Why

StreamCell is predominantly used on mobile devices (Android and iOS). To provide a native app-like experience without app store distribution, StreamCell needs to be configured as a Progressive Web App (PWA) with full responsiveness, bottom navigation tabs, touch-optimized layouts, and viewport safe-area handling.

## What Changes

- **PWA Manifest & Web App Headers**: Add `manifest.json` and meta tags for iOS/Android `standalone` display mode, application title ("StreamCell"), brand theme colors (`#090D16`), app icons, and viewport safe-area support (`viewport-fit=cover`).
- **Mobile Bottom Navigation Bar**: Implement a fixed bottom navigation bar on mobile devices (`sm:hidden fixed bottom-0 left-0 right-0 z-50`) with direct access to Dashboard, Usuarios, Inventario, Ventas, and Suscripciones.
- **Responsive Navigation Drawer / Header**: Update `Header` and `Sidebar` to hide sidebar on small screens (`hidden md:block`) and offer a sleek mobile hamburger menu for secondary options (dark mode, settings, profile).
- **Responsive Table-to-Card Conversions**: Transform tabular views (Usuarios, Cuentas, Ventas, Suscripciones) into touchable, compact cards on mobile screens (`sm:hidden`), while retaining full tables on tablet/desktop (`hidden sm:table`).
- **Full-Screen Mobile Modals & Bottom Sheets**: Update React Portals modals to fill the mobile screen or slide up smoothly as bottom sheets with safe-area padding (`pb-20` for bottom navbar clearance).

## Capabilities

### New Capabilities

- `mobile-pwa-responsive`: Web App PWA capabilities, iOS standalone installation headers, mobile bottom navigation bar, responsive table-to-card transformations, touch-first inputs, and mobile modal bottom sheets.

### Modified Capabilities

*(None - new mobile layout capability)*

## Impact

- **Frontend (`/frontend`)**: Update `index.html`, add `manifest.json`, create `BottomNav.tsx` component, update `Header.tsx`, `Sidebar.tsx`, `App.tsx`, `ClientsPage.tsx`, `AccountsPage.tsx`, `SalesPage.tsx`, `SubscriptionsPage.tsx`, and `ClientDetailsModal.tsx`.
- **Backend (`/backend`)**: No database or backend changes required.
