## Context

Al renovar un servicio de suscripción, la fecha de vencimiento actual (ej. `"2026-08-13T00:00:00.000Z"`) se convierte a un objeto `Date` en JavaScript. Cuando la aplicación se ejecuta en zonas horarias con desfase negativo respecto a UTC (como Colombia UTC-5), llamar a `date.getDate()` sobre un ISO String en UTC medianoche retorna el día anterior (`12` en lugar de `13`) debido a la conversión a hora local (`2026-08-12 19:00:00`). Luego, la adición de días (`+30`) se realiza sobre la base incorrecta del día 12, produciendo como resultado el 11 de septiembre en lugar del 12 de septiembre.

## Goals / Non-Goals

**Goals:**
- Implementar la función de utilidad `addDaysToDate` en `frontend/src/utils/formatters.ts` que parsee limpiamente las fechas ISO o cadenas `YYYY-MM-DD` extrayendo año, mes y día de forma independiente antes de realizar la adición de días.
- Reemplazar las funciones ad-hoc de cálculo de fecha como `calculateNewEndDate` en `ExpirationsPage.tsx` para usar `addDaysToDate`.
- Corregir el cálculo en el backend en `subscriptionController.ts` cuando no se envía `serviceEndDate` de forma explícita, asegurando que la adición de días sobre `subscription.serviceEndDate` no sufra desfases por hora local.

**Non-Goals:**
- Alterar el formato visual de despliegue de fechas `DD/MM/AAAA` (manejado por `formatDateCO`).
- Modificar el esquema de la base de datos o el modelo de Prisma.

## Decisions

- **Decisión 1: Extracción explícita de componentes de fecha `YYYY-MM-DD` en `addDaysToDate`**:
  En lugar de confiar en `new Date(isoString)` que asume UTC medianoche y sufre traslación a hora local en getters como `getDate()`, la función parsea los primeros 10 caracteres mediante Regex `/^(\d{4})-(\d{2})-(\d{2})/`. Se construye un `Date` local con `new Date(year, month - 1, day)` (o manipulando directamente el valor de los días), garantizando que el día del mes sea exacto.

- **Decisión 2: Ajuste defensivo en Backend (`subscriptionController.ts`)**:
  En el controlador de renovaciones de suscripción, cuando la fecha base se procesa para calcular `sEndDate`, se extraerán igualmente los componentes de año/mes/día o se operará en UTC (`getUTCDate()`, `setUTCDate()`) para evitar que el servidor Node en UTC-5 altere el día original.

## Risks / Trade-offs

- **Riesgo:** Inconsistencias si se pasan fechas como objetos `Date` ya ajustados vs cadenas ISO.
  - **Mitigación:** `addDaysToDate` soporta ambos tipos de entrada (`string | Date`), verificando si la entrada es un `string` para hacer el matching de componentes `YYYY-MM-DD` antes de recurrir a getters defensivos.
