## Why

La vista actual mezcla el registro directo de ventas con métricas financieras globales y carece de funciones clave como búsqueda interactiva, paginación y edición/eliminación de ventas registradas (CRUD completo). Rediseñar la vista a "Venta Rápida" enfocada en la usabilidad móvil y separar el reporte financiero en una vista dedicada de "Flujo de Caja" mejorará la agilidad operativa diaria y la claridad del control financiero.

## What Changes

- **Rediseño de la Sección "Venta Rápida" (`SalesPage.tsx`):**
  - Renombrar la sección de "Ventas & Precios" a "Venta Rápida" y optimizar la interfaz para ser la pantalla principal en dispositivos móviles.
  - Botón prominente de "+ Registrar Venta Rápida" que despliega el formulario optimizado.
  - Reemplazo del bloque superior estático por un resumen concentrado de las ventas del día.
  - Incorporación de una **barra de búsqueda en tiempo real** para el historial de ventas (filtrando por código `VTA-XXXX`, cliente o producto/perfil).
  - Incorporación de **paginación** en la tabla/lista del historial de ventas.
  - **CRUD Completo de Ventas**: permitir editar los datos de una venta o eliminar ventas registradas erróneamente con ajuste en la contabilidad de caja.

- **Nueva Sección "Flujo de Caja" (`CashFlowPage.tsx`):**
  - Creación de una nueva opción en la navegación lateral dedicada al análisis financiero.
  - Métrica de Ingresos Brutos, Ganancia Neta y Ventas Totales con selector de periodo principal (Mes Actual vs. Hoy).
  - Gráficos y tarjetas de métricas comparativas mes a mes.

## Capabilities

### New Capabilities
- `cash-flow-reports`: Métrica y reportes financieros del flujo de caja (mensual, diario y comparativas mes a mes).

### Modified Capabilities
- `customer-subscriptions-billing`: Incorporar búsqueda, paginación y operaciones de edición y eliminación (CRUD completo) sobre las transacciones de ventas registradas.

## Impact

- **Frontend:**
  - Actualización de `SalesPage.tsx` con componentes de búsqueda, paginación y modales de edición/eliminación de ventas.
  - Nueva página `CashFlowPage.tsx` e integración de su enlace en `Sidebar.tsx`.
- **Backend:**
  - Nuevos endpoints para actualización (`PUT /api/sales/:id`) y eliminación (`DELETE /api/sales/:id`) de ventas con reversión/actualización transaccional en Prisma.
  - Nuevos endpoints/consultas para métricas financieras de flujo de caja y comparativa mensual (`GET /api/sales/cash-flow-stats`).
