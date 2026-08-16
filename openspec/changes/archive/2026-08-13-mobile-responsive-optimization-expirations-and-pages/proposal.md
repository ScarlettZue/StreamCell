## Why

En dispositivos móviles (teléfonos), la vista de "Cortes de Cuentas Madre" en la página de Alertas de Corte no se visualiza correctamente porque dependía únicamente de una tabla de escritorio horizontal que recortaba o desbordaba la columna de acciones ("Renovar (+30 Días)"). Asimismo, la barra superior de pestañas y búsqueda se desproporcionaba en pantallas angostas.

Es indispensable adaptar la vista de Cuentas Madre y revisar el comportamiento de las tablas/modales en toda la aplicación para garantizar que sean 100% responsivos en móviles mediante tarjetas táctiles (`sm:hidden`) y botones de ancho completo.

## What Changes

- **Diseño Responsivo Móvil para Cortes de Cuentas Madre en `ExpirationsPage.tsx`**:
  - Implementar la vista móvil de tarjetas táctiles (`sm:hidden`) para la pestaña "Cortes de Cuentas Madre", mostrando la plataforma, correo, número de perfiles vendidos/totales, fecha de corte, insignia de estado y el botón de acción rápida "Renovar (+30 Días)" a ancho completo.
  - Hacer la barra de pestañas ("Cortes de Usuarios" / "Cortes de Cuentas Madre") y el campo de búsqueda responsivos con ajuste flexible (`flex-wrap`, `w-full` en móvil y `sm:w-auto` en escritorio).
- **Auditoría y Optimización Responsiva Móvil en Páginas Principales**:
  - **`AccountsPage.tsx`**: Verificar que las tarjetas de cuentas madre, perfiles y modales se ajusten al ancho de pantalla en móviles sin desbordamiento horizontal.
  - **`SalesPage.tsx`**: Ajustar modales y tablas para experiencia táctil fluida en celular.
  - **`ClientsPage.tsx`**: Optimizar tarjetas de clientes y botones de acción rápida en móvil.

## Capabilities

### New Capabilities

- `mobile-responsive-optimization`: Adaptación completa a diseño responsivo táctil para teléfonos en Alertas de Corte (Cuentas Madre), tablas e interfaces de usuario.

### Modified Capabilities

(Ninguna)

## Impact

- **Frontend**:
  - `ExpirationsPage.tsx`: Vista de tarjetas táctiles para la pestaña de Cuentas Madre y ajuste responsivo de la barra superior.
  - `AccountsPage.tsx`, `SalesPage.tsx`, `ClientsPage.tsx`: Inspección y ajuste de layouts responsivos en resoluciones móviles (`< 640px`).
