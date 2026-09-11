## Why

Al registrar una Venta Rápida desde el Dashboard (especialmente en dispositivos móviles), el modal de registro de venta se cierra exitosamente pero no muestra el recuadro modal posterior para enviar la confirmación y las credenciales de acceso al cliente vía WhatsApp. Esto rompe la paridad de funcionalidad con el módulo de Ventas (`SalesPage`) y obliga al administrador a ir manualmente a buscar al cliente o a la sección de ventas para notificarle.

## What Changes

- **Dashboard Page (`DashboardPage.tsx`)**:
  - Agregar estado y lógica para gestionar el modal de confirmación WhatsApp Pos-Venta tras la creación exitosa de una Venta Rápida.
  - Formatear automáticamente el mensaje con `formatSaleAssignmentWhatsAppMessage` incluyendo producto, usuario, contraseña, perfil, PIN y fecha de vencimiento.
  - Implementar los botones de "Enviar por WhatsApp" (`wa.me`) y "Copiar Texto" con React Portal (`createPortal`) en `z-[9999]`.

## Capabilities

### Modified Capabilities

- `dashboard-and-account-expirations-management`: El registro de Venta Rápida desde el Dashboard debe desplegar inmediatamente el modal de confirmación pos-venta con el mensaje formateado y el botón para enviar por WhatsApp al cliente.

## Impact

- **Frontend**: `frontend/src/pages/DashboardPage.tsx`
- **Backend/DB**: Sin cambios requeridos en backend ni base de datos.
