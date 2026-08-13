## Context

El `DashboardPage.tsx` actual muestra datos estáticos de infraestructura técnica que no resultan útiles en la operación diaria móvil. El usuario requiere rediseñar el Dashboard optimizándolo para teléfonos inteligentes con acceso directo a "+ Registrar Venta Rápida", métricas esenciales (Ventas del día, Clientes nuevos con selector de periodo Día/Mes/Año, Stock disponible) y un widget interactivo con los cortes de suscripción pendientes de realizar.

## Goals / Non-Goals

**Goals:**
- **Acceso Rápido Móvil:**
  - Botón prominente de "+ Registrar Venta Rápida" en la parte superior del Dashboard.
  - Al hacer clic, abre inmediatamente el modal de Venta Rápida vía React Portal (`z-[9999]`).
- **Métricas Clave Operativas:**
  - **Ventas del Día:** Conteo de transacciones del día de hoy e Ingresos Brutos de hoy.
  - **Clientes Nuevos con Selector de Periodo:** Filtro interactivo de **Día / Mes / Año** para visualizar los nuevos registros.
  - **Stock Disponible:** recuento en vivo de perfiles listos para vender.
  - **Cortes Pendientes:** recuento total de suscripciones vencidas.
- **Widget de Cortes Pendientes:**
  - Reemplazar paneles estáticos por un listado en vivo de las principales cuentas vencidas a cortar con botón directo hacia `/expirations`.

**Non-Goals:**
- Alterar la lógica de base de datos de Prisma (se reutilizan las consultas existentes de `clients`, `sales`, `accounts` y `subscriptions`).

## Decisions

1. **Estado Dinámico del Filtro de Clientes Nuevos en Frontend:**
   - Estado `newClientsPeriod: 'day' | 'month' | 'year'`.
   - Filtrar los clientes retornados por `clientService.getClients()` según su fecha `createdAt`:
     - `day`: Mismo año, mes y día de hoy.
     - `month`: Mismo año y mes actual.
     - `year`: Mismo año actual.

2. **Integración del Modal Venta Rápida en el Dashboard:**
   - Reutilizar la lógica de selección de Cliente, Perfil, Fechas y Precios Dinámicos con `createPortal` para que el usuario pueda registrar ventas sin cambiar de pantalla.

3. **Navegación Fluida de Cortes Pendientes:**
   - Calcular las suscripciones vencidas filtrando aquellas activas cuyo `serviceEndDate < now`.
   - Listar hasta 5 suscripciones urgentes en el Dashboard con botón para revocar/notificar o ir a la sección de Alertas de Corte.

## Risks / Trade-offs

- Ninguno. Mejora radicalmente la velocidad de uso móvil y la experiencia diaria del usuario.
