## ADDED Requirements

### Requirement: Confirmación Visual y Precarga de Precios Unitarios en Modal de Renovación
The system MUST display a summary card inside the "Renovar Servicio (+30 Días)" modal prior to confirmation showing client, service, profile, email, and current cut-off date, and MUST prefill the real cost field with the unit cost per profile calculated as `Math.round(defaultCost / profilesCount)` matching the pre-established pricing in quick sales.

#### Scenario: Abrir modal de renovación de perfil
- **WHEN** el usuario hace clic en renovar servicio (+30 días) para un perfil de suscripción
- **THEN** el sistema renderiza la tarjeta de confirmación del cliente/servicio y establece el valor predeterminado del "Costo Real" dividiendo el costo total del producto entre el número de perfiles del servicio (ej: 44900 / 5 = 8980)

#### Scenario: Generación del mensaje de recordatorio de WhatsApp
- **WHEN** el usuario solicita generar el mensaje de recordatorio para un cliente y fecha de corte (ej: 12/08/2026)
- **THEN** el mensaje generado inicia con "Hola buenas tardes," (o según la hora) sin el nombre del cliente y menciona explícitamente "el día 12/08/2026 terminó el mes de..."
