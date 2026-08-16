## Context

Actualmente en `DashboardPage.tsx`, la tarjeta de "Cortes Pendientes A Realizar" efectúa una comparación de fechas que genera valores negativos o invertidos de días restantes en relación con `ExpirationsPage.tsx`. Por ejemplo, para una suscripción con vencimiento el `14/08/2026` cuando hoy es `13/08/2026`, se mostraba "Vencido hace 1 día", mientras que en Alertas de Corte marcaba adecuadamente "Vence en 1 día".

Adicionalmente, se requiere separar conceptual y visualmente las alertas de corte en dos categorías:
1. **Alertas de Suscripción de Usuario**: Perfiles vendidos a clientes finales.
2. **Alertas de Cuentas Madre**: Servicios de la plataforma (`Account.dueDate`) comprados a proveedores.

## Goals / Non-Goals

**Goals:**
- Unificar la función de utilidad de cálculo de días restantes (`getDaysRemaining` en `formatters.ts`) en `DashboardPage.tsx` y `ExpirationsPage.tsx`.
- En `ExpirationsPage.tsx`, añadir pestañas superiores para alternar entre "Cortes de Usuarios" y "Cortes de Cuentas Madre".
- En la pestaña "Cuentas Madre", listar las cuentas con su fecha de vencimiento (`dueDate`), servicio/plataforma, correo y estado (Vence hoy, Vence en X días, Vencido hace X días).
- Proveer un botón de acción en Cuentas Madre: "Renovar Cuenta Madre (+30 Días)" que invoque la API de actualización de fecha de la cuenta `updateAccount`.

**Non-Goals:**
- Modificar el esquema de la base de datos (se utilizan los campos existentes `Account.dueDate` y `ProfileSubscription.serviceEndDate`).

## Decisions

### 1. Unificación de `getDaysRemaining` en DashboardPage
Reemplazar cualquier cálculo local ad-hoc de diferencia de fechas en `DashboardPage.tsx` por la función estandarizada `getDaysRemaining` y `formatDateCO`:

```typescript
const daysLeft = getDaysRemaining(sub.serviceEndDate);
const isToday = daysLeft === 0;
const isExpired = daysLeft < 0;
const isWarning = daysLeft > 0 && daysLeft <= 3;
```

Esto asegurará que si hoy es 13 de agosto:
- Vencimiento 13/08: `daysLeft === 0` -> "Vence hoy"
- Vencimiento 14/08: `daysLeft === 1` -> "Vence en 1 día"
- Vencimiento 12/08: `daysLeft === -1` -> "Vencido hace 1 día"

### 2. Estructura de Pestañas en Alertas de Corte (`ExpirationsPage.tsx`)
Añadir estado `activeTab: 'USER_SUBSCRIPTIONS' | 'MOTHER_ACCOUNTS'` en `ExpirationsPage.tsx`:
- **Tab 1: Cortes de Usuarios**: Tabla y tarjetas actuales de suscripciones activas (`activeSubscriptions`).
- **Tab 2: Cortes de Cuentas Madre**: Consulta de cuentas (`accounts`) filtrando u ordenando por `acc.dueDate`.

### 3. Modal de Renovación de Cuenta Madre
Permitir renovar la fecha de vencimiento (`dueDate`) de una cuenta madre sumando 30 días a la fecha previa o asignando una fecha explícita mediante `accountService.updateAccount`.

## Risks / Trade-offs

- **[Zonas horarias al parsear fechas]** → Mitigación: Toda conversión a Date debe usar el formateador `America/Bogota` en `formatters.ts` para evitar saltos de día por desfase UTC.
