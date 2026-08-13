## Why

Actualmente al retirar a un cliente de un perfil, el flujo no ofrece la posibilidad inmediata de editar la cuenta madre (correo, contraseña, perfiles) ni de enviar notificaciones por WhatsApp a los demás clientes activos que comparten la cuenta para informarles de las credenciales actualizadas. Integrar un flujo ordenado de retiro con confirmación de deuda, edición de la cuenta madre y notificación rápida por WhatsApp mejorará la eficiencia operativa y mantendrá la información de acceso sincronizada entre todos los usuarios activos.

## What Changes

- **Flujo Guiado al Retirar un Cliente/Perfil:**
  - Confirmación inicial al retirar al usuario.
  - Preguntar y registrar si el cliente queda con deuda (monto y motivo).
  - Tras confirmar el retiro, preguntar si se desea editar la cuenta madre.
  - Permitir la edición completa de la cuenta (correo, contraseña, perfiles, PINs, etc.) si se confirma la edición.
  - El perfil ocupado por la persona retirada queda disponible/libre al confirmar.
- **Notificación Rápida por WhatsApp a Usuarios Activos:**
  - Al guardar cambios en la cuenta madre (durante el retiro o en cualquier edición de cuentas), mostrar la opción rápida para enviar un mensaje individual por WhatsApp a cada cliente activo que ocupa un perfil.
  - Generar el mensaje con el formato predeterminado conteniendo servicio, plan, correo, contraseña, perfil, PIN, recomendaciones de seguridad y fecha de vencimiento.
  - Habilitar la opción rápida de notificaciones por WhatsApp en todas las vistas de edición de cuentas.

## Capabilities

### Modified Capabilities
- `streaming-accounts-management`: Flujo guiado de retiro con edición inmediata de la cuenta madre y liberación del perfil.
- `whatsapp-notifications`: Generación de mensajes de notificación de cambio de credenciales de cuenta y envío rápido por WhatsApp a perfiles activos.

## Impact

- **Frontend:** Actualización del modal de retiro de servicios, componentes de edición de cuentas y componentes de envío de WhatsApp en `AccountEditModal` / `ProfilesTable`.
- **Backend:** Soporte en endpoints de perfiles y cuentas para retiro, registro de deuda y consulta de perfiles activos con sus números de WhatsApp y fechas de vencimiento.
