# streaming-accounts-management Specification (Delta)

## MODIFIED Requirements

### Requirement: Control de Perfiles y Asignación
The system MUST define the PIN and profile name for each individual profile within a streaming account, return and display PINs in legible plain text without encryption hashes in all client and account management views, and track availability status.

#### Scenario: Consulta de perfiles disponibles por plataforma
- **WHEN** se solicita la lista de perfiles para venta
- **THEN** el sistema retorna únicamente los perfiles activos que no se encuentran asignados a una suscripción vigente

#### Scenario: Visualización del PIN en texto claro en detalle del usuario
- **WHEN** el usuario consulta la pestaña "Cuentas & Perfiles" en la ficha de un cliente
- **THEN** el sistema muestra el PIN del perfil en texto legible de 4 dígitos (o "Sin PIN"), sin hashes de cifrado ni superposiciones de interfaz
