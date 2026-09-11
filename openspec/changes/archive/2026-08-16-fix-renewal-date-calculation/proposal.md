## Why

Al renovar un servicio en el módulo de Vencimientos, la vista previa de la "Nueva Fecha de Corte" muestra un día de menos (por ejemplo, al sumar 30 días a la fecha 13/08/2026 en un mes de 31 días como agosto, se debería obtener 12/09/2026, pero la interfaz calcula y muestra 11/09/2026). Esto ocurre porque las fechas en formato de cadena ISO (`YYYY-MM-DD...`) son interpretadas mediante `new Date(string)` como UTC medianoche, lo cual, al llamar a métodos locales del objeto `Date` de JavaScript en la zona horaria de Colombia (UTC-5), retrocede el día a las 19:00 horas del día anterior antes de realizar el cálculo de adición de días.

## What Changes

- Crear/actualizar la utilidad estandarizada `addDaysToDate` en `frontend/src/utils/formatters.ts` que interprete y sume días a las fechas basándose en sus componentes de fecha calendario (`YYYY-MM-DD`) sin desplazamiento por zona horaria.
- Reemplazar las funciones ad-hoc `calculateNewEndDate` en `ExpirationsPage.tsx` y en cualquier otra vista por la función estandarizada `addDaysToDate`.
- Asegurar que el cálculo de `serviceEndDate` en el backend al renovar una suscripción cuando no se envía `serviceEndDate` explícita mantenga los componentes de fecha calendario sin desajustes por zona horaria local.

## Capabilities

### Modified Capabilities
- `customer-subscriptions-billing`: Ajustar el cálculo de nueva fecha de corte durante la renovación de servicios para garantizar que la suma de días (`+30`, `+60`, `+90`) tome como base la fecha calendario exacta sin desfases de zona horaria.

## Impact

- `frontend/src/utils/formatters.ts`
- `frontend/src/pages/ExpirationsPage.tsx`
- `backend/src/presentation/controllers/subscriptionController.ts`
