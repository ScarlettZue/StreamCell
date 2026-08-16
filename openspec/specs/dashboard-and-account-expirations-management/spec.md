# dashboard-and-account-expirations-management Specification

## Purpose
Normaliza la lógica de fechas de vencimiento en el Dashboard para alinearse 100% con Alertas de Corte y divide las alertas en dos secciones independientes: Vencimientos de Usuarios y Vencimientos de Cuentas Madre.
## Requirements
### Requirement: Normalización Identica de Fechas entre Dashboard y Alertas de Corte
El sistema MUST utilizar la misma lógica normalizada de cálculo de días restantes ajustada a la hora oficial de Colombia (`America/Bogota`) tanto en el Dashboard como en Alertas de Corte.

#### Scenario: Visualización consistente de fecha actual 13 de agosto
- **WHEN** hoy es 13 de agosto de 2026 y una suscripción vence el 13 de agosto de 2026
- **THEN** tanto en el Dashboard como en Alertas de Corte el sistema MUST mostrar "Vence hoy" sin indicar atraso negativo.

### Requirement: División en Secciones de Alertas de Corte (Usuarios vs Cuentas Madre)
La pantalla de Alertas de Corte MUST permitir al usuario alternar entre la pestaña de "Vencimientos de Usuarios" (suscripciones de clientes) y "Vencimientos de Cuentas Madre" (`Account.dueDate`).

#### Scenario: Filtrado por Cuentas Madre próximas a vencer
- **WHEN** el usuario selecciona la pestaña de "Cuentas Madre" en Alertas de Corte
- **THEN** el sistema MUST listar únicamente las cuentas principales registradas con sus respectivas fechas globales de vencimiento, proveedor y número de perfiles asignados/disponibles.

### Requirement: Renovación Rápida de Cuenta Madre
El sistema MUST permitir al administrador renovar la fecha de vencimiento global (`dueDate`) de una Cuenta Madre por +30 días o una fecha personalizada.

#### Scenario: Extensión de fecha de corte de cuenta madre
- **WHEN** el administrador hace clic en "Renovar (+30 Días)" sobre una cuenta madre vencida o próxima a vencer
- **THEN** el sistema MUST extender la fecha de corte global de la cuenta madre y actualizar la disponibilidad en el inventario.

