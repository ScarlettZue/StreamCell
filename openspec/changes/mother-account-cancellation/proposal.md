## Why

Actualmente en el apartado de "Cortes de Cuentas Madre" dentro de la vista de Vencimientos (`ExpirationsPage.tsx`), únicamente existe la opción de renovar la fecha de corte de la cuenta madre por +30 días o una fecha personalizada. Cuando el administrador decide dejar de pagar una cuenta madre con su proveedor o descontinuarla, no existe una opción directa desde la interfaz para cancelarla / darla de baja, lo que ocasiona que permanezca indeterminadamente en la lista de vencidas o requiera eliminaciones manuales.

Esta funcionalidad integra la opción explícita de "Cancelar Cuenta Madre" directamente en las secciones de escritorio y móvil de Cortes de Cuentas Madre, con una confirmación clara y control del impacto sobre perfiles o usuarios activos.

## What Changes

- **Opción "Cancelar Cuenta Madre" en Alertas de Corte**: Se añade un botón/acción de "Cancelar" (Dar de baja) junto al botón de "Renovar" en la tabla y tarjetas táctiles del apartado "Cortes de Cuentas Madre".
- **Modal de Confirmación de Cancelación**: Se añade un modal interactivo con advertencias si la cuenta madre posee perfiles con suscripciones activas a clientes, permitiendo al administrador confirmar la baja segura.
- **Gestión de Baja en Backend y Frontend**: Se invoca el borrado/desactivación de la cuenta madre y sus asociaciones correspondientes a través de las mutaciones de TanStack React Query, refrescando automáticamente el listado de vencimientos y cuentas.

## Capabilities

### Modified Capabilities
- `dashboard-and-account-expirations-management`: Se incorpora la especificación y requisitos para la Cancelación / Dar de baja de Cuentas Madre desde la vista de Alertas de Corte.

## Impact

- **Frontend**: `frontend/src/pages/ExpirationsPage.tsx` (nueva acción, modal de confirmación con modal portal, mutaciones).
- **Backend**: `backend/src/presentation/controllers/accountController.ts` y `backend/src/services/accountService.ts` (verificación de endpoints para baja de cuentas y perfiles).
