# ui-theme-and-modals Specification

## Purpose
Define las reglas de interfaz gráfica, conmutación de Modo Oscuro / Claro, botones principales con gradiente azul-morado, renderizado de modales vía React Portals con z-[9999] e iconografía exclusiva con Lucide React sin emojis.
## Requirements
### Requirement: Conmutación de Modo Oscuro y Modo Claro
The system MUST support dynamic switching between Dark Mode (#090D16, slate-900, slate-800) and Light Mode (#F8FAFC, white, slate-200).

#### Scenario: Cambio de tema visual
- **WHEN** el usuario interactúa con el conmutador de tema (ícono Sun / Moon de Lucide React)
- **THEN** el sistema aplica la clase correspondiente en el elemento raíz cambiando instantáneamente la paleta de colores de toda la interfaz

### Requirement: Renderizado de Modales con React Portals y z-[9999]
The system MUST render all interactive modals using React Portals (createPortal(..., document.body)) assigned with z-[9999].

#### Scenario: Apertura de modal de edición o creación
- **WHEN** se activa la apertura de un modal desde cualquier componente de la aplicación
- **THEN** el elemento HTML se inyecta directamente como hijo del document.body con índice z-[9999] sobrepuesto a cualquier otra capa visual

### Requirement: Botones Principales y Cumplimiento del Manual de Marca
The system MUST apply 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-bold' to primary action buttons and strictly forbid emojis, using Lucide React icons instead.

#### Scenario: Renderizado de botones e íconos en vista principal
- **WHEN** se carga cualquier pantalla o panel de la aplicación
- **THEN** los botones principales muestran el gradiente azul a morado y la iconografía utiliza únicamente íconos SVG de Lucide React sin presencia de emojis

