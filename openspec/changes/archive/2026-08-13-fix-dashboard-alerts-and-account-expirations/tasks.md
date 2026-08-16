## 1. Unificación de Fechas de Vencimiento en el Dashboard

- [x] 1.1 Modificar `frontend/src/pages/DashboardPage.tsx`: Estandarizar la lógica de días de atraso/vencimiento utilizando la función `getDaysRemaining` de `formatters.ts`, alineando exactamente los badges "Vence hoy", "Vence en X días" y "Vencido hace X días" con la página de Alertas de Corte.

## 2. Pestañas de Alertas de Corte: Usuarios vs Cuentas Madre

- [x] 2.1 Actualizar `frontend/src/pages/ExpirationsPage.tsx`: Añadir pestañas de navegación ("Cortes de Usuarios" y "Cortes de Cuentas Madre").
- [x] 2.2 Implementar la vista de **Vencimientos de Cuentas Madre**: Tabla interactiva con filtro de búsqueda por plataforma/correo, fecha de vencimiento global (`dueDate`), días restantes y badges de estado.
- [x] 2.3 Añadir la acción y modal de **Renovación de Cuenta Madre (+30 días)** en `ExpirationsPage.tsx` invocando `accountService.updateAccount` para actualizar `dueDate`.

## 3. Verificación y Compilación

- [x] 3.1 Ejecutar `npm run build` en el frontend y `npx tsc --noEmit` en el backend para validar la ausencia de errores de compilación de TypeScript.
- [x] 3.2 Verificar que el Dashboard muestre exactamente la misma información de días restantes que Alertas de Corte para el 13 de agosto.
