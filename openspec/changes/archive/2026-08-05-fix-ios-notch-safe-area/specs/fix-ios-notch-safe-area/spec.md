# fix-ios-notch-safe-area Specification

## Purpose
Ensures the top navigation header and floating elements adapt dynamically to iOS safe-area top insets (`env(safe-area-inset-top)`), preventing UI overlap with iPhone notches, camera punch-holes, and Dynamic Island.

## Requirements

### Requirement: Área de Seguridad Superior (Safe Area Inset Top) para iOS Notch
The system MUST apply dynamic top safe-area padding (`env(safe-area-inset-top)`) to the sticky top header (`Navbar.tsx`), drawer sidebar (`Sidebar.tsx`), and login screen elements when rendered in PWA standalone mode on iOS devices.

#### Scenario: Visualización del encabezado en iPhone con Notch o Dynamic Island
- **WHEN** el usuario abre StreamCell en un iPhone en modo PWA standalone
- **THEN** la barra de navegación superior se desplaza automáticamente hacia abajo respetando la altura de la barra de estado y el notch/Dynamic Island del dispositivo, manteniendo el título, botón hamburguesa e íconos visibles y táctiles
