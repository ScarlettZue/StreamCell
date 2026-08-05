## Why

When StreamCell is installed as a PWA on iOS devices (iPhones with notches or Dynamic Island), `viewport-fit=cover` expands the web application into the full display area. Without explicit top safe-area padding (`env(safe-area-inset-top)`), the top navigation header and menu buttons overlap with the iPhone status bar and notch, obscuring top content.

## What Changes

- **Top Navigation Bar (`Navbar.tsx`)**:
  - Add dynamic top padding using `env(safe-area-inset-top)` so the header container automatically adjusts its height and padding below the status bar notch.
- **Mobile Sidebar Drawer (`Sidebar.tsx`)**:
  - Add top safe-area padding to the mobile drawer header.
- **Login Screen (`LoginPage.tsx`)**:
  - Adjust top floating theme button position with safe-area top inset padding.

## Capabilities

### New Capabilities

- `fix-ios-notch-safe-area`: Top safe-area inset compatibility for iOS notch and Dynamic Island.

### Modified Capabilities

*(None)*

## Impact

- **Frontend (`/frontend`)**: Update layout components (`Navbar.tsx`, `Sidebar.tsx`, `LoginPage.tsx`) with safe-area top inset styles.
- **Backend (`/backend`)**: No backend changes required.
