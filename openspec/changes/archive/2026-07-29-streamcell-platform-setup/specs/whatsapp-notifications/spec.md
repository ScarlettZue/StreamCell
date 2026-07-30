## Purpose

Permite la generación e interacción con alertas de vencimiento y recordatorios de pago para clientes vía WhatsApp anteponiendo dinámicamente el prefijo 57.

## ADDED Requirements

### Requirement: Generación Dinámica de Enlaces de WhatsApp wa.me
The system MUST construct the wa.me link by automatically prepending country code 57 to the customer's 10-digit phone number (e.g. wa.me/573126622931).

#### Scenario: Generación de enlace de cobro por WhatsApp
- **WHEN** el usuario presiona el botón de notificar por WhatsApp para un cliente CLI-XXXX
- **THEN** el sistema genera una URL de WhatsApp wa.me/57... con el mensaje codificado preformateado conteniendo el detalle del servicio, fecha DD/MM/AAAA y valor en $ COP

### Requirement: Plantillas de Mensaje Formales sin Emojis
The system MUST use message templates in a friendly, helpful, formal, and welcoming tone, completely omitting emojis across all text.

#### Scenario: Selección de plantilla de vencimiento de cuenta
- **WHEN** se selecciona la alerta de vencimiento para una suscripción a punto de expirar
- **THEN** el texto del mensaje incluye los datos del servicio de streaming, perfil, fecha de vencimiento DD/MM/AAAA y monto $ COP de forma clara y sin emojis
