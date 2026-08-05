## Context

Users want to reveal their typed password on the login screen to verify correct input before logging in.

## Goals / Non-Goals

**Goals:**
- Update `LoginPage.tsx` with a `showPassword` React state.
- Position the toggle button on the right side of the password input using absolute positioning (`absolute right-3 top-1/2 -translate-y-1/2`).
- Switch input `type` dynamically (`showPassword ? 'text' : 'password'`).

**Non-Goals:**
- Modifying backend authentication API endpoints.

## Decisions

### Decision 1: Inline Eye Toggle in `LoginPage.tsx`
- Add Lucide icons `Eye` and `EyeOff`.
- Structure:
  ```tsx
  <div className="relative">
    <input
      type={showPassword ? 'text' : 'password'}
      // ...
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
    >
      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
    </button>
  </div>
  ```

## Risks / Trade-offs

- None. Minor frontend UI addition.
