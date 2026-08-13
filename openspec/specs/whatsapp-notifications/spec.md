# whatsapp-notifications Specification

## Purpose
Permite la generación e interacción con alertas de vencimiento y recordatorios de pago para clientes vía WhatsApp anteponiendo dinámicamente el prefijo 57.
## Requirements
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

### Requirement: Notificación Rápida por WhatsApp de Cambio de Credenciales a Usuarios Activos
The system MUST provide a quick option/modal whenever account credentials or details (email, password, profiles, PINs) are updated (or after completing account edition in the withdrawal flow) to send individual WhatsApp notification messages to relevant active customers on that mother account.

- If account credentials (email and/or password) were modified, the notification list MUST include ALL active profile holders on that account.
- If only a specific profile's details (profile name or PIN) were modified, the notification list MUST target the specific active customer(s) occupying the modified profile(s).

The generated WhatsApp message format MUST match:
"Se ha realizado un cambio en tu servicio de {plataforma}:
{producto}
Correo: {correo}
Contraseña: {contraseña}
Perfil: {perfil}
Pin: {pin}
No compartir o cambiar contraseñas, evitar tener mas de un dispositivo conectado a su pantalla para evitar suspensión de la cuenta.
Válido hasta {fecha_vencimiento}"

Each message MUST be generated with a direct `https://wa.me/57<telefono>?text=...` link for 1-click delivery via WhatsApp.

#### Scenario: Envío rápido de notificación tras cambio de credenciales de cuenta madre
- **WHEN** el usuario confirma o guarda cambios en la cuenta madre (correo, contraseña o perfiles)
- **THEN** el sistema muestra una interfaz con botones de acción rápida para enviar por WhatsApp el mensaje estructurado a los clientes activos correspondientes según el cambio realizado.

