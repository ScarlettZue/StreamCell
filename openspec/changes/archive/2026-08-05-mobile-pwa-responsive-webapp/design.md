## Context

StreamCell is used primary on smartphone viewports (iOS Safari and Android Chrome). Making the app fully responsive with PWA support and mobile bottom navigation drastically enhances daily usability and speed.

## Goals / Non-Goals

**Goals:**
- Add PWA `manifest.json` and iOS/Android standalone web app meta tags.
- Create `BottomNav.tsx` component fixed at screen bottom on mobile (`sm:hidden`).
- Make `Sidebar.tsx` desktop-only (`hidden md:flex`) and add mobile menu drawer in `Header.tsx`.
- Update `ClientsPage.tsx`, `AccountsPage.tsx`, `SalesPage.tsx`, `SubscriptionsPage.tsx` with mobile card grid layouts (`sm:hidden`) alongside desktop tables (`hidden sm:table`).
- Ensure all React Portals modals have safe-area scroll padding (`pb-24`).

**Non-Goals:**
- Publishing native APK or IPA packages to Google Play or Apple App Store (PWA install to home screen is the target mechanism).

## Decisions

### Decision 1: Mobile Bottom Navigation Bar (`BottomNav.tsx`)
- Render fixed bar at bottom of viewport:
  ```tsx
  <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[9990] bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around py-2.5">
    {/* Tabs for Dashboard, Usuarios, Inventario, Ventas, Suscripciones */}
  </nav>
  ```

### Decision 2: Card-View Fallbacks for Mobile Data Tables
- Convert rows to touchable cards on `< 640px` screens:
  - Table: `hidden sm:table w-full`
  - Cards: `sm:hidden space-y-3 pb-24`

### Decision 3: PWA Manifest in `public/manifest.json`
- Add `manifest.json` with brand logo `/assets/logo/logo.png`, `standalone` mode, and dark theme colors (`#090D16`).

## Risks / Trade-offs

- **[Bottom Nav Overlay]** → Bottom-fixed navigation bar can obscure the lowest scrollable content if bottom padding (`pb-24`) is not applied to main container and modals.
