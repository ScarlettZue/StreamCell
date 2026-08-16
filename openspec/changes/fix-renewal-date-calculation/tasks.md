## 1. Frontend - Utilidades de Fecha y Modal de Renovación

- [x] 1.1 Implementar/Actualizar la función `addDaysToDate` en `frontend/src/utils/formatters.ts` para parsear componentes `YYYY-MM-DD` sin traslación UTC-a-Local.
- [x] 1.2 Actualizar `frontend/src/pages/ExpirationsPage.tsx` para reemplazar `calculateNewEndDate` por `addDaysToDate`.

## 2. Backend - Controlador de Suscripciones

- [x] 2.1 Actualizar `backend/src/presentation/controllers/subscriptionController.ts` para asegurar que el cálculo defensivo de `sEndDate` al renovar no pierda un día por zona horaria local.

## 3. Verificación

- [x] 3.1 Ejecutar la compilación del Frontend con `npm run build` en `frontend`.
- [x] 3.2 Ejecutar la compilación del Backend con `npm run build` en `backend`.
