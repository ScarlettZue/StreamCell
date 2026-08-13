## 1. PWA & Web App Setup

- [x] 1.1 Create `frontend/public/manifest.json` with StreamCell brand colors (`#090D16`), logo icon, standalone display, and title
- [x] 1.2 Update `frontend/index.html` adding PWA theme-color, apple-mobile-web-app meta tags, manifest link, and viewport-fit=cover

## 2. Mobile Bottom Navigation & Shell Layout

- [x] 2.1 Create `frontend/src/components/layout/BottomNav.tsx` component fixed at bottom on small viewports (`sm:hidden`)
- [x] 2.2 Update `frontend/src/components/layout/Sidebar.tsx` for desktop rendering (`hidden md:flex`) and mobile drawer compatibility
- [x] 2.3 Update `frontend/src/components/layout/Header.tsx` adding mobile brand title, hamburger menu trigger, and quick actions
- [x] 2.4 Update `frontend/src/App.tsx` container shell embedding `BottomNav` and adding safe-area bottom padding (`pb-24 sm:pb-6`)

## 3. Responsive Card-Based Views for Mobile Data

- [x] 3.1 Update `frontend/src/pages/ClientsPage.tsx` with touchable card layout on mobile (`sm:hidden`) and table on desktop (`hidden sm:table`)
- [x] 3.2 Update `frontend/src/pages/AccountsPage.tsx` with touchable card layout on mobile (`sm:hidden`) and table on desktop (`hidden sm:table`)
- [x] 3.3 Update `frontend/src/pages/SalesPage.tsx` with touchable card layout on mobile (`sm:hidden`) and table on desktop (`hidden sm:table`)
- [x] 3.4 Update `frontend/src/pages/SubscriptionsPage.tsx` with touchable card layout on mobile (`sm:hidden`) and table on desktop (`hidden sm:table`)

## 4. Touch & Modal Safe-Area Optimizations

- [x] 4.1 Update `ClientDetailsModal.tsx` and form modals adding safe-area scroll padding (`pb-24`) so action buttons stay visible above bottom navigation bar

## 5. Verification & Build Checks

- [x] 5.1 Run TypeScript typecheck and build on `frontend` (`npm run build`)
