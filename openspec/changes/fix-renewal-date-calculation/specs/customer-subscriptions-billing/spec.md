## MODIFIED Requirements

### Requirement: Confirmación Visual y Precarga de Precios Unitarios en Modal de Renovación
The system MUST display a summary card inside the renewal modal prior to confirmation showing client, service, profile, email, current cut-off date, and calculated new cut-off date based strictly on calendar date arithmetic without timezone shifts, and MUST prefill the real cost field with the unit cost per profile calculated as `Math.round(defaultCost / profilesCount)` matching the pre-established pricing in quick sales.

#### Scenario: Abrir modal de renovación de perfil
- **WHEN** el usuario hace clic en renovar servicio (+30 días, +60 días o +90 días) para un perfil de suscripción
- **THEN** el sistema renderiza la tarjeta de confirmación del cliente/servicio, calcula la "Nueva Fecha de Corte" sumando exactamente la cantidad de días seleccionada a la fecha de corte actual preservando el día del mes calendario (por ejemplo, 13/08/2026 + 30 días = 12/09/2026 en hora de Colombia), y establece el valor predeterminado del "Costo Real" dividiendo el costo total del producto entre el número de perfiles del servicio (ej: 44900 / 5 = 8980).

#### Scenario: Generación del mensaje de recordatorio de WhatsApp
- **WHEN** el usuario solicita generar el mensaje de recordatorio para un cliente y fecha de corte (ej: 12/08/2026)
- **THEN** el mensaje generado inicia con "Hola buenas tardes," (o según la hora) sin el nombre del cliente y menciona explícitamente "el día 12/08/2026 terminó el mes de..."
