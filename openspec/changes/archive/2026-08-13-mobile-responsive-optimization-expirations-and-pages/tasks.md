## 1. Vista Responsiva Táctil para Cortes de Cuentas Madre en `ExpirationsPage.tsx`

- [x] 1.1 Implementar la vista móvil de tarjetas táctiles (`sm:hidden`) para la pestaña "Cortes de Cuentas Madre" en `ExpirationsPage.tsx`, con título, badge de días restantes, correo, perfiles vendidos/totales y botón "Renovar (+30 Días)" a ancho completo.
- [x] 1.2 Hacer la barra superior de pestañas ("Cortes de Usuarios" y "Cortes de Cuentas Madre") y el input de búsqueda totalmente responsivos con `flex-wrap` y anchos flexibles para móviles.

## 2. Auditoría Responsiva Móvil en Páginas Principales

- [x] 2.1 Auditar `AccountsPage.tsx`: Garantizar que la lista de cuentas madre, perfiles y modales se ajusten al ancho de pantalla en teléfono sin recorte horizontal.
- [x] 2.2 Auditar `SalesPage.tsx` y `ClientsPage.tsx`: Verificar espaciado y márgenes inferiores `pb-24` para no chocar con el menú de navegación móvil.

## 3. Verificación y Compilación

- [x] 3.1 Ejecutar `npm run build` en el frontend y `npx tsc --noEmit` en el backend para validar la compilación limpia de TypeScript.
- [x] 3.2 Verificar visualmente que la pestaña de Cortes de Cuentas Madre funcione perfectamente en vistas móviles y de escritorio.
