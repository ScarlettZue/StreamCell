## ADDED Requirements

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
