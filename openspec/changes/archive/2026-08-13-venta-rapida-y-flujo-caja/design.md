## Context

Actualmente `SalesPage.tsx` ("Ventas & Precios") incluye en la parte superior las tarjetas de métricas globales de caja (Ventas Totales, Ingresos Brutos y Ganancia Neta Total) y una tabla sin paginación ni buscador en vivo ni opciones de edición o eliminación de ventas. El usuario requiere optimizar la vista para su uso desde dispositivos móviles centrado en la acción rápida de venta, con buscador, paginación y CRUD completo (editar y eliminar transacciones), trasladando el análisis financiero a una nueva página independiente "Flujo de Caja".

## Goals / Non-Goals

**Goals:**
- **Reorganización e Interfaz Móvil Primaria:**
  - Renombrar la sección principal en el menú de navegación a "Venta Rápida" (`path: '/sales'`).
  - Optimizar la experiencia de usuario móvil con botón prominente "+ Registrar Venta Rápida" y resumen de ventas del día.
  - Añadir barra de búsqueda interactiva en tiempo real (por código `VTA-XXXX`, cliente, producto o perfil).
  - Añadir paginación (10 a 20 registros por página) en la lista de historial de ventas.
  - Implementar CRUD completo para ventas: edición de valores/fechas y eliminación de transacciones registradas por error con ajuste de caja.
- **Nueva Vista de Flujo de Caja (`CashFlowPage.tsx`):**
  - Crear la nueva ruta `/cash-flow` con acceso en el menú lateral.
  - Presentar métricas detalladas de Ingresos Brutos, Ganancias Netas y Ventas Totales comparando el periodo mensual vs. el día de hoy.
  - Incluir métricas comparativas mes a mes con porcentajes de variación.

**Non-Goals:**
- Pasarelas de pago externas automatizadas (los cobros siguen registrándose internamente en la plataforma).

## Decisions

1. **Estructura de Navegación y Rutas (`App.tsx` y `Sidebar.tsx`):**
   - Actualizar el ítem de navegación a "Venta Rápida" (`Zap` / `ShoppingBag`).
   - Agregar el nuevo ítem de navegación "Flujo de Caja" (`BarChart3` / `TrendingUp` / `DollarSign`) apuntando a `/cash-flow`.

2. **Endpoints Backend en `saleController.ts` y `saleRoutes.ts`:**
   - `PUT /api/sales/:id`: Permite actualizar `totalAmount`, `totalCost`, `netProfit` y recalcular el margen de ganancia.
   - `DELETE /api/sales/:id`: Elimina la venta y sus registros hijos (`saleDetail`), ajustando los totales.
   - `GET /api/sales/cash-flow-stats`: Retorna objeto estructurado con métricas de hoy, del mes actual y desglose comparativo de meses anteriores.

3. **Modales Interactivos en Frontend:**
   - `SaleEditModal`: Modal para modificar los valores de costo y precio de una venta realizada.
   - `SaleDeleteConfirmModal`: Modal de confirmación para eliminar una venta por equivocación.
   - Ambos modales se renderizan mediante `createPortal(..., document.body)` con `z-[9999]`.

4. **Estado y Paginación:**
   - Utilizar React State para `searchTerm` y `currentPage`, filtrando en tiempo real con React Query y paginación en memoria o servidor.

## Risks / Trade-offs

- **[Risk]** Que la eliminación de una venta afecte la integridad de métricas históricas.
  - **Mitigation:** Utilizar transacciones de Prisma (`tx`) para eliminar de forma enlazada el `saleDetail` y actualizar las estadísticas en cascada.
