## Why

Actualmente en el apartado de "Cortes de Cuentas Madre" dentro de la vista de Vencimientos (`ExpirationsPage.tsx`), únicamente existe la opción de renovar la fecha de corte de la cuenta madre por +30 días o una fecha personalizada. Cuando el administrador decide dejar de pagar una cuenta madre con su proveedor o descontinuarla, no existe una opción directa desde la interfaz para cancelarla / darla de baja, lo que ocasiona que permanezca indeterminadamente en la lista de vencidas.

Esta funcionalidad integra la opción explícita de "Cancelar Cuenta Madre" directamente en las secciones de escritorio y móvil de Cortes de Cuentas Madre, con una confirmación clara y control del impacto sobre perfiles o usuarios activos.

## What Changes

- **Opción "Cancelar Cuenta Madre" en Alertas de Corte**: Se añade un botón/acción de "Cancelar" (Dar de baja) junto al botón de "Renovar" en la tabla y tarjetas táctiles del apartado "Cortes de Cuentas Madre".
- **Modal de Confirmación de Cancelación**: Se añade un modal interactivo con advertencias si la cuenta madre posee perfiles con suscripciones activas a clientes, permitiendo al administrador confirmar la baja segura.
- **Gestión Exclusiva en Frontend**: Se invoca el borrado de la cuenta madre consumiendo el servicio existente `accountService.deleteAccount(id)` y actualizando la caché de TanStack React Query, sin alterar ningún archivo del Backend para garantizar 100% de estabilidad en las APIs.

## Capabilities

### Modified Capabilities
- `dashboard-and-account-expirations-management`: Se incorpora la especificación y requisitos para la Cancelación / Dar de baja de Cuentas Madre desde la vista de Alertas de Corte.

## Impact

- **Frontend**: `frontend/src/pages/ExpirationsPage.tsx` (nueva acción, modal de confirmación con React Portal `z-[9999]`, mutación TanStack Query).
- **Backend**: **Sin modificaciones en el Backend**. Se preserva la arquitectura y los endpoints existentes en producción intactos (`DELETE /api/v1/accounts/:id`).
