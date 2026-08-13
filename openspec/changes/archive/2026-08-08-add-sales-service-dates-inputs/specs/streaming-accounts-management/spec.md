# streaming-accounts-management Specification (Delta)

## ADDED Requirements

### Requirement: Selección de Fechas de Inicio y Vencimiento del Servicio en Registro de Ventas
The system MUST provide interactive date input controls for "Fecha de Inicio del Servicio" and "Fecha de Vencimiento" in the quick sale registration modal dialog. The start date MUST default to the current date and the expiration date MUST default to 30 days after the start date while remaining fully editable by the user.

#### Scenario: Visualización e interacción con fechas de servicio al registrar venta
- **WHEN** el usuario abre el modal "Registrar Venta Rápida" en la sección de ventas
- **THEN** el sistema muestra los campos de fecha predeterminados (inicio hoy, vencimiento a 30 días) y permite al usuario ajustar libremente ambas fechas antes de confirmar la venta
