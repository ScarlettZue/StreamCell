## Why

Al interactuar con los modales de la aplicación (crear o editar clientes, eliminar registros, guardar productos, ventas o renovaciones), especialmente en dispositivos móviles, las ventanas emergentes no se cierran de inmediato ni deshabilitan el botón de envío tras presionar "Guardar" o "Confirmar". Esto provoca que el usuario vuelva a presionar el botón repetidamente por falta de feedback inmediato, generando registros duplicados en el servidor (como usuarios o ventas duplicadas).

Además, al realizar el retiro o corte de servicio de una pantalla/perfil, la pantalla no quedaba disponible inmediatamente en el inventario ni en el selector de ventas debido a la falta de sincronización de caché en React Query y actualización de estados.

Asimismo, al registrar una nueva venta directa, los administradores requieren una opción rápida para notificar al cliente vía WhatsApp con los datos formateados de acceso al perfil asignado (correo, contraseña, nombre de perfil, PIN e instrucciones de uso).

## What Changes

- **Cierre Inmediato y Bloqueo Anti-Doble Clic en Modales**:
  - En todos los modales de la aplicación (`ClientsPage.tsx`, `SalesPage.tsx`, `AccountsPage.tsx`, `ExpirationsPage.tsx`, `ProductsPage.tsx`), el botón principal de confirmación se deshabilita instantáneamente apenas se envía el formulario (`isPending === true`).
  - Cierre automático inmediato de los modales de confirmación/creación/edición al completarse con éxito la operación (`onSuccess`).
  - Restablecimiento del estado del formulario (`resetForm`) para evitar re-envíos involuntarios.
  - Feedback visual claro con spinner de carga (`Loader2 animate-spin`) e indicador en el botón mientras se procesa la solicitud.
- **Liberación Inmediata de Perfiles al Cortar Servicio**:
  - Garantizar que al realizar el retiro/corte de una suscripción en `ExpirationsPage.tsx` o la API, el perfil asociado (`AccountProfile`) quede marcado como `AVAILABLE` en la base de datos y se invaliden las cachés de `availableProfiles` y `accounts` en React Query para que vuelva a aparecer inmediatamente disponible en el inventario de servicios y ventas.
- **Notificación por WhatsApp Pos-Venta de Asignación de Servicio**:
  - Al completar el registro de una venta directa en `SalesPage.tsx`, abrir automáticamente un modal pos-venta con el mensaje formateado de asignación de perfil (correo, clave, perfil, PIN y fecha de vencimiento en español completo) y botones de acción rápida para enviar por WhatsApp (`wa.me`) o copiar al portapapeles.

## Capabilities

### New Capabilities

- `prevent-duplicate-modal-submit`: Prevención estricta de doble envío en modales interactivos, cierre/reset automático de formularios, liberación/sincronización de perfiles disponibles tras retiros de servicio y modal pos-venta con notificación por WhatsApp.

### Modified Capabilities

(Ninguna)

## Impact

- **Frontend**:
  - `ClientsPage.tsx` (crear, editar, eliminar clientes).
  - `SalesPage.tsx` (crear venta rápida, modal pos-venta WhatsApp, editar venta, eliminar venta).
  - `AccountsPage.tsx` (crear, editar, eliminar cuentas madre y perfiles).
  - `ExpirationsPage.tsx` (modales de renovación y retiro, invalidación de `availableProfiles`).
  - `formatters.ts` (función `formatSaleAssignmentWhatsAppMessage`).
- **Backend**:
  - `subscriptionController.ts` (verificación de liberación de perfiles a `AVAILABLE` en retiros).
  - `saleController.ts` (retornar datos del cliente y perfil asignado al crear venta).
