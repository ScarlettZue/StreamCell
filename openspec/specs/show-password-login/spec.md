# show-password-login Specification

## Purpose
Provides a password visibility toggle button on the login screen to allow users to reveal or hide their typed password.

## Requirements

### Requirement: Toggle de Visibilidad de Contraseña en el Inicio de Sesión
The system MUST render a toggle button (`Eye` / `EyeOff` icons) inside the password input field on the login page (`LoginPage.tsx`), enabling the user to switch between masked (`type="password"`) and visible (`type="text"`) password text.

#### Scenario: Revelar la contraseña ingresada
- **WHEN** el usuario hace clic en el ícono del ojo cerrado (`Eye`) en el campo de contraseña
- **THEN** el campo cambia su tipo a `type="text"`, mostrando los caracteres de la contraseña y cambiando el ícono a ojo abierto con tachado (`EyeOff`)

#### Scenario: Ocultar la contraseña visible
- **WHEN** el usuario vuelve a hacer clic en el ícono (`EyeOff`)
- **THEN** el campo cambia su tipo a `type="password"`, ocultando los caracteres con asteriscos/puntos y restaurando el ícono `Eye`
