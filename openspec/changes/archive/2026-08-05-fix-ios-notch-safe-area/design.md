## Context

iOS Safari PWA uses `viewport-fit=cover` to render full-screen. Without safe area padding, elements at the very top (`top: 0`) get rendered directly under the system clock and notch.

## Goals / Non-Goals

**Goals:**
- Apply `pt-[env(safe-area-inset-top)]` or inline `style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}` to `Navbar.tsx`.
- Adjust `Navbar` container height from fixed `h-16 sm:h-20` to dynamic `min-h-[4rem] sm:min-h-[5rem]`.
- Apply top safe area insets to mobile `Sidebar.tsx` drawer top header.
- Apply top safe area margin/padding to `LoginPage.tsx` top theme switcher button.

**Non-Goals:**
- Modifying bottom navigation (already configured with safe bottom area).

## Decisions

### Decision 1: Dynamic Safe Area Padding in `Navbar.tsx`
Using CSS `env(safe-area-inset-top, 0px)` ensures that non-notched devices (or desktop browsers) fall back gracefully to `0px`, while iPhones with notches receive their required 44px-59px top offset.

```tsx
<header
  style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 0.5rem)' }}
  className="glass-panel border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8 pb-3 ml-0 md:ml-64 transition-all duration-300"
>
```

## Risks / Trade-offs

- None. Fully supported in WebKit CSS standards.
