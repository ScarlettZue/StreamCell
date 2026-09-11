## ADDED Requirements

### Requirement: Cancelación de Cuenta Madre en Alertas de Corte
El sistema MUST permitir al administrador cancelar / dar de baja una Cuenta Madre directamente desde el apartado de "Cortes de Cuentas Madre" en la pantalla de Alertas de Corte.

#### Scenario: Apertura del modal de confirmación de cancelación
- **WHEN** el administrador hace clic en el botón "Cancelar" o "Dar de baja" sobre una Cuenta Madre en la lista de vencimientos de cuentas madre
- **THEN** el sistema MUST desplegar un modal de confirmación mostrando el correo, la plataforma y el resumen de perfiles vendidos/disponibles asociados.

#### Scenario: Confirmación de baja de cuenta madre sin perfiles vendidos
- **WHEN** el administrador confirma la cancelación de una cuenta madre que no posee suscripciones activas a clientes
- **THEN** el sistema MUST dar de baja la cuenta madre, liberarla de las alertas de corte y refrescar los listados del sistema.

#### Scenario: Confirmación de baja de cuenta madre con perfiles vendidos
- **WHEN** el administrador confirma la cancelación de una cuenta madre que posee perfiles vendidos con suscripciones activas
- **THEN** el sistema MUST presentar una advertencia de perfiles afectados, dar de baja la cuenta y cancelar sus suscripciones asociadas, e invalidar las consultas de React Query (`accounts`, `expirations`, `clients`, `availableProfiles`) para mantener la consistencia total del inventario.
