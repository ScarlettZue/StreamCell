## Why

El Dashboard General actual muestra paneles estáticos de infraestructura técnica que no aportan valor a la operación comercial diaria y dificultan el uso desde teléfonos móviles. Rediseñar la pantalla principal enfocado en la experiencia móvil, con botón directo de "+ Registrar Venta Rápida", métricas de ventas del día, clientes nuevos (filtrables por Día/Mes/Año) y el listado de cortes pendientes agilizará la toma de decisiones y el trabajo diario del negocio.

## What Changes

- **Rediseño Móvil del Dashboard (`DashboardPage.tsx`):**
  - Incorporar un botón destacado de **"+ Registrar Venta Rápida"** en la cabecera del Dashboard.
  - Tarjeta de **Ventas del Día**: mostrando el número de ventas e ingresos brutos generados en la jornada presente.
  - Tarjeta de **Clientes Nuevos** con selector de periodo (**Día / Mes / Año**).
  - Widget interactivo de **Cortes Pendientes por Realizar**: lista corta de los clientes con suscripciones vencidas o que vencen hoy, con acceso directo a revocar o gestionar.
  - Tarjeta de **Stock Disponible**: recuento en tiempo real de perfiles listos para vender.
- **Optimización de Endpoints en Backend (`dashboardController.ts`):**
  - Extender el endpoint del Dashboard para retornar el desglose de clientes nuevos (hoy, este mes, este año) y el conteo exacto de suscripciones vencidas pendientes de corte.

## Capabilities

### New Capabilities

*(Ninguna)*

### Modified Capabilities

- `customer-subscriptions-billing`: Incorporar en las métricas consolidadas del Dashboard el conteo de clientes nuevos por periodo (Día/Mes/Año), ventas del día y alertas de cortes pendientes.

## Impact

- **Frontend:**
  - Rediseño de `DashboardPage.tsx` con componentes responsive para teléfonos y modales de venta rápida.
- **Backend:**
  - Actualización de `dashboardController.ts` y `dashboardRoutes.ts` para proveer las métricas agregadas por periodo.
