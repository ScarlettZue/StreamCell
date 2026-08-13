# streaming-accounts-management Specification (Delta)

## ADDED Requirements

### Requirement: Cuadrícula Compacta de 4 Columnas y Perfiles Desplegables en Inventario
The system MUST render streaming accounts in a 4-column responsive grid layout on desktop viewports (`lg:grid-cols-4`). Each account card MUST display a compact header summary by default containing platform name, category badge, masked email toggle, expiration date, and edit button, with profile details collapsed. Clicking the card header or toggle button MUST expand or collapse the detailed list of profiles and PINs.

#### Scenario: Visualización compacta y despliegue de perfiles al dar clic en tarjeta de cuenta
- **WHEN** el usuario navega a la sección "Catálogo e Inventario de Servicios"
- **THEN** las cuentas se presentan en una cuadrícula compacta de 4 columnas con perfiles colapsados, y al hacer clic en una tarjeta de cuenta, se pliega/despliega la lista detallada de sus perfiles
