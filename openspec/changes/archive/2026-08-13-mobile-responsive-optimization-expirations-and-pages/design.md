## Context

En la página de Alertas de Corte (`ExpirationsPage.tsx`), la pestaña "Cortes de Cuentas Madre" sólo implementaba la vista de tabla para escritorio (`<table>`). En dispositivos móviles, esto causaba que el usuario tuviera que desplazar la tabla horizontalmente o que el botón de "Renovar (+30 Días)" quedara recortado fuera de pantalla.

Adicionalmente, la barra superior de pestañas ("Cortes de Usuarios" y "Cortes de Cuentas Madre") y el campo de búsqueda requerían soporte para apilamiento fluido en pantallas angostas (`< 640px`).

## Goals / Non-Goals

**Goals:**
- Implementar la vista responsiva de tarjetas móviles (`sm:hidden`) para la pestaña "Cortes de Cuentas Madre" en `ExpirationsPage.tsx`.
- Asegurar que la barra de pestañas y búsqueda en `ExpirationsPage.tsx` utilice flexbox responsivo (`flex-wrap`, `w-full` en móvil) para evitar recortes.
- Auditar y verificar que los modales y tarjetas en `AccountsPage.tsx`, `SalesPage.tsx` y `ClientsPage.tsx` mantengan márgenes y padding seguro en dispositivos móviles (`p-4` / `pb-24` para no chocar con la barra de navegación inferior móvil).

**Non-Goals:**
- Modificar componentes de backend o modelos de base de datos.

## Decisions

### 1. Vista de Tarjetas Móviles para Cuentas Madre (`ExpirationsPage.tsx`)
Separar la renderización de Cuentas Madre en dos bloques según el breakpoint `sm`:
- `hidden sm:block`: Tabla de escritorio tradicional.
- `sm:hidden space-y-3 pb-24`: Lista de tarjetas móviles donde cada tarjeta incluye:
  - Título del servicio y badge de estado (Vence hoy / Vencida hace Xd / Vence en Xd / Al día).
  - Correo electrónico de la cuenta madre y desglose de perfiles vendidos/totales.
  - Fecha de vencimiento global en formato latino.
  - Botón de acción táctil "Renovar (+30 Días)" a ancho completo (`w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold`).

### 2. Responsividad de Barra de Pestañas
Ajustar la barra superior en `ExpirationsPage.tsx`:
```tsx
<div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
  <div className="flex flex-wrap items-center gap-2">
    <button className="flex-1 sm:flex-none ...">Cortes de Usuarios</button>
    <button className="flex-1 sm:flex-none ...">Cortes de Cuentas Madre</button>
  </div>
  <div className="w-full sm:w-64">
    <input className="w-full ..." />
  </div>
</div>
```

## Risks / Trade-offs

- **[Espacio vertical en pantallas muy pequeñas]** → Mitigación: Usar padding inferior `pb-24` en listas móviles para garantizar que los elementos inferiores no queden ocultos detrás del menú de navegación inferior del teléfono.
