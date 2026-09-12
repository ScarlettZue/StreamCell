## 1. UI & State Management (Frontend)

- [x] 1.1 Agregar estado local en `ExpirationsPage.tsx` (`motherCancelModalOpen`, `selectedMotherAccountForCancel`) y la mutación de baja `deleteMotherAccountMutation`.
- [x] 1.2 Incorporar el botón visual "Cancelar" / "Dar de baja" (ícono `Trash2` / `XCircle`) en la tabla de escritorio de Cortes de Cuentas Madre.
- [x] 1.3 Incorporar el botón visual "Cancelar Cuenta Madre" en las tarjetas táctiles móviles del apartado Cortes de Cuentas Madre.
- [x] 1.4 Crear el modal interactivo de confirmación de cancelación utilizando React Portals (`createPortal(..., document.body)`) con `z-[9999]`, incluyendo advertencias si existen perfiles con suscripciones activas.

## 2. Frontend Integration & Data Synchronization

- [x] 2.1 Consumir directamente el servicio existente `accountService.deleteAccount(id)` desde el frontend sin modificar ningún archivo del backend.
- [x] 2.2 Asegurar que al completar la cancelación se invaliden adecuadamente las consultas `['accounts']`, `['expirations']`, `['availableProfiles']`, `['clients']`, `['sales']` en TanStack Query.

## 3. Verification & Testing

- [x] 3.1 Ejecutar verificación de tipos TypeScript (`npm run build` en frontend).
- [x] 3.2 Validar que la interfaz responda correctamente tanto en temas claros como oscuros sin errores visuales ni trampas de contexto CSS.
