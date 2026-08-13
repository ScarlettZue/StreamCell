# mobile-pwa-responsive Specification

## Purpose
Configures StreamCell as a full Progressive Web App (PWA) with iOS/Android standalone installation support, bottom navigation bar for mobile devices, card-based mobile layout views, and notch/safe-area compatibility.

## Requirements

### Requirement: PWA Manifest & iOS Mobile Web App Support
The system MUST include web app manifest (`manifest.json`) and meta headers configuring `standalone` display mode, brand theme color `#090D16`, application title "StreamCell", app icons, and `viewport-fit=cover` for iOS/Android device notch handling.

#### Scenario: Instalación como Web App en iOS y Android
- **WHEN** el usuario abre StreamCell en Safari iOS o Chrome Android y selecciona "Agregar a la pantalla de inicio"
- **THEN** la aplicación se instala como Web App independiente sin barras de navegación del navegador, utilizando el color de fondo `#090D16` y el logo oficial de StreamCell

### Requirement: Barra de Navegación Inferior (Bottom Nav Bar) para Celulares
The system MUST display a fixed, touch-friendly bottom navigation bar on mobile screen sizes (`sm:hidden fixed bottom-0 left-0 right-0 z-50`), providing immediate 1-tap switching between Dashboard, Usuarios, Inventario, Ventas, and Suscripciones.

#### Scenario: Navegación móvil táctil
- **WHEN** el usuario navega desde un dispositivo móvil (pantalla menor a 640px)
- **THEN** la barra de navegación inferior permanece fija en la pantalla con íconos de Lucide React, resaltando el ítem activo y permitiendo cambiar de vista instantáneamente

### Requirement: Adaptación Responsive de Tablas a Tarjetas Táctiles
The system MUST present data records (Usuarios, Cuentas, Ventas, Suscripciones) as compact, touchable cards on mobile viewports (`sm:hidden`), and preserve tabular views on tablet/desktop viewports (`hidden sm:table`).

#### Scenario: Visualización de usuarios en celular
- **WHEN** el usuario entra al directorio de usuarios desde un teléfono celular
- **THEN** la lista se renderiza como tarjetas touch responsivas con el nombre, celular, rol, distribuidor y botón de acción rápido a WhatsApp

### Requirement: Modales Responsivos Táctiles
The system MUST render React Portals modals as full-height or bottom-sheet overlays on mobile viewports, with bottom padding (`pb-24`) ensuring modal actions are not obscured by the mobile navigation bar.

#### Scenario: Apertura de modal en celular
- **WHEN** el usuario abre el modal de registro o detalle en pantalla móvil
- **THEN** el modal se ajusta a la pantalla con scroll vertical fluido y botones finales visibles sin traslaparse con la barra inferior
