## Why

Al confirmar la renovación de un servicio/suscripción desde el sistema, el administrador necesita notificar de manera inmediata al cliente a través de WhatsApp con un mensaje estructurado que incluya las credenciales de acceso, recomendaciones de uso y la nueva fecha de vencimiento. Además, se requiere garantizar que la renovación preserve el ciclo de cobro continuo a partir de la fecha de corte previa (sin resetear desde el día de la acción), permitir opciones de renovación multimes (+30, +60, +90 días) con cálculo dinámico proporcional de precios, y habilitar la **edición completa de ventas** para ajustar libremente fechas de servicio, precios y reasignación a otras cuentas/perfiles.

## What Changes

- **Cálculo Continuo de Fecha de Corte**: La nueva fecha de corte se calcula sumando los días seleccionados a la fecha de corte previa del servicio (`serviceEndDate`), no a la fecha actual del sistema. (Ej: si vencía el 12 de agosto y se renueva +30 días el 13 de agosto, la nueva fecha de corte es el 11 de septiembre).
- **Opciones Rápidas Multimes en Modal**: Selector con botones de período rápido: `+30 Días` (1x), `+60 Días` (2x) y `+90 Días` (3x).
- **Cálculo Dinámico de Precios y Previsualización**: Ajuste automático del costo real y precio cobrado al cambiar el período (multiplicando costo/precio base por 1, 2 o 3) y previsualización visible de la nueva fecha de corte resultante antes de confirmar.
- **Edición Completa de Ventas / Suscripciones**: Modificación integral en la sección de Ventas (`SalesPage.tsx`) que permite ajustar:
  - **Tiempo/Duración**: Modificar directamente la fecha de inicio (`serviceStartDate`) y fecha de corte (`serviceEndDate`).
  - **Reasignación de Cuenta/Perfil**: Cambiar/reasignar la suscripción a otro perfil o cuenta madre disponible.
  - **Ajuste de Precios**: Editar libremente costo real y precio cobrado de la transacción.
- **Modal de Confirmación de Renovación**: Pantalla pos-renovación para enviar WhatsApp con el mensaje estructurado de renovación.
- **Formateador de Mensaje de Renovación por WhatsApp**: Plantilla dinámica con el nombre del servicio, días de duración (ej: `NETFLIX 1 PANTALLA X60 DIAS`), credenciales, recomendaciones y fecha exacta en español.

## Capabilities

### New Capabilities

- `renewal-confirmation-whatsapp`: Notificación estructurada por WhatsApp enviada al usuario inmediatamente después de renovar exitosamente un servicio/suscripción con los datos de acceso, duración elegida y la nueva fecha de vencimiento.
- `full-sales-editing`: Edición avanzada de ventas y suscripciones que permite modificar fechas de servicio, precios y reasignar cuentas/perfiles a clientes.

### Modified Capabilities

(Ninguna)

## Impact

- **Frontend**:
  - `ExpirationsPage.tsx` / modal de renovación: Selector de período +30/+60/+90 días, cálculo dinámico de costo/precio y visualización de la nueva fecha de corte.
  - `SalesPage.tsx` / modal de edición de venta: Campos para editar fechas (`serviceStartDate`, `serviceEndDate`), precios y selector para reasignar a otro perfil/cuenta madre.
  - `formatters.ts`: Soporte para duraciones multimes en el formateador de WhatsApp.
- **Backend**:
  - `subscription.service.ts` / endpoint `/subscriptions/:id/renew`: Garantizar el cálculo acumulativo de fecha de corte desde la fecha previa de la suscripción.
  - `sale.service.ts` / endpoint `/sales/:id`: Permitir actualización de fechas de servicio, precios y migración de `profileId`.
