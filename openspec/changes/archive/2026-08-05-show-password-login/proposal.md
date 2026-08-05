## Why

Typing passwords on mobile devices is prone to typos. Adding a password visibility toggle (`Eye` / `EyeOff` icons) allows users to verify their password before submitting, reducing login errors and improving the overall mobile login user experience.

## What Changes

- **Login Screen (`LoginPage.tsx`)**:
  - Introduce `showPassword` boolean toggle state.
  - Add an interactive eye button inside the password field.
  - Dynamically toggle the input field type between `password` and `text`.

## Capabilities

### New Capabilities

- `show-password-login`: Toggle password visibility in the login interface.

### Modified Capabilities

*(None)*

## Impact

- **Frontend (`/frontend`)**: Update `LoginPage.tsx` with Lucide `Eye` and `EyeOff` icons and state control.
- **Backend (`/backend`)**: No backend changes needed.
