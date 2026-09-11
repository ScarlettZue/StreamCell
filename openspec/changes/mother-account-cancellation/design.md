## Context

Ver `proposal.md`. Actualmente, la pestaña "Cortes de Cuentas Madre" en `frontend/src/pages/ExpirationsPage.tsx` lista las cuentas madre con su fecha de vencimiento (`dueDate`), ofreciendo únicamente la opción de renovar la fecha de corte (`handleOpenMotherRenewModal`). Cuando un usuario desea dar de baja una cuenta madre que dejará de pagar, no existe un flujo visual directo en esta pantalla para efectuar la cancelación.

## Goals / Non-Goals

**Goals:**
- Proveer un botón interactivo "Cancelar Cuenta" / "Dar de baja" tanto en la vista de escritorio como en tarjetas móviles dentro del apartado "Cortes de Cuentas Madre" (`ExpirationsPage.tsx`).
- Desplegar un modal de confirmación con React Portal (`z-[9999]`) que informe los datos de la cuenta madre y advierta claramente al usuario en caso de existir perfiles con suscripciones activas.
- Ejecutar la mutación de cancelación mediante `accountService.deleteAccount(id)` invalidando la caché de TanStack Query para reflejar los cambios instantáneamente en todo el sistema.
- Respetar de forma estricta las reglas de UI/UX de StreamCell (modo claro/oscuro, sin emojis, uso exclusivo de íconos Lucide como `Trash2` o `XCircle`).

**Non-Goals:**
- No se modificarán los esquemas de base de datos de Prisma ni se agregarán endpoints redundantes, ya que `AccountController.deleteAccount` maneja la transacción de baja e invoca la limpieza en cascada.

## Decisions

### 1. Ubicación de Botón y Flujo de Interacción
- **Decisión**: Añadir un botón rojo/rose con ícono `Trash2` o `XCircle` al lado del botón de "Renovar (+30 Días)" en la tabla de escritorio y en las tarjetas móviles del tab `MOTHER_ACCOUNTS`.
- **Razón**: Permite al administrador tomar una acción rápida e intuitiva cuando decide dejar de pagar un proveedor o servicio.

### 2. Design del Modal de Confirmación (`createPortal`)
- **Decisión**: Implementar el modal de confirmación mediante `createPortal` en `document.body` utilizando `z-[9999]` y backdrop borroso.
- **Detalle de Contenido**: Mostrar la plataforma, correo, número de perfiles vendidos/disponibles y una alerta visual condicional (`bg-rose-500/10 border-rose-500/30`) si hay perfiles con suscripciones activas.

### 3. Invalidación de Caché y Mutaciones de TanStack Query
- **Decisión**: Usar una mutación `deleteMotherAccountMutation` que invoque `accountService.deleteAccount(selectedMotherAccount.id)`. Al resultar exitosa, invalidará las queryKeys `['accounts']`, `['expirations']`, `['availableProfiles']`, `['clients']`, `['sales']`.

## Risks / Trade-offs

- **[Riesgo]** Cancelar una cuenta madre con suscripciones activas retira automáticamente el acceso de los clientes asociados.
  → **Mitigación**: El modal de confirmación exige validación activa del usuario indicando cuántos perfiles/clientes se verán afectados antes de ejecutar el borrado en backend.
