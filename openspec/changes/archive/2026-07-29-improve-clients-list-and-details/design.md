## Context

Ver `proposal.md` para la motivación de este rediseño. Actualmente la vista `ClientsPage.tsx` muestra columnas de ID de cliente (`CLI-XXXX`) y campos de deudas directas. Esta propuesta simplifica la tabla principal enfocándola exclusivamente en **Nombre**, **Celular**, **Fecha de Registro** y **Acciones**, y despliega un modal enriquecido de detalle al interactuar con el cliente.

## Goals / Non-Goals

**Goals:**
- Simplificar la tabla de clientes en `ClientsPage.tsx`:
  - Remover la columna visible del ID (`CLI-XXXX`).
  - Filtrar en la barra de búsqueda por **Nombre** y **Celular**.
  - Mantener la tabla enfocada únicamente en la información de perfil: **Nombre**, **Celular/Teléfono**, **Fecha de Registro (DD/MM/AAAA)** y **Acciones**.
- Crear un nuevo modal de detalle de cliente `ClientDetailsModal` mediante `createPortal(..., document.body)` con `z-[9999]`:
  - Muestra la tarjeta del cliente con botón directo de WhatsApp (`wa.me/57...`).
  - Muestra métricas del cliente (servicios activos, histórico acumulado).
  - Muestra una pestaña/listado de suscripciones y perfiles de streaming asignados (nombre de plataforma, correo de acceso, PIN del perfil, estado de servicio, fechas de inicio y vencimiento en `DD/MM/AAAA`).
  - Muestra el historial de compras y pagos.

**Non-Goals:**
- Eliminar el ID `clientKey` de la base de datos (se mantiene en la BD Prisma para relaciones e integridad de datos).

## Decisions

### 1. Reestructuración de la Tabla de Clientes
- **Decisión**: Ocultar el ID `CLI-XXXX` de la tabla principal y presentar al cliente por su Nombre completo con su inicial destacada y su Celular de 10 dígitos.
- **Razón**: Mejora la legibilidad y la búsqueda natural por personas reales en lugar de códigos internos.

### 2. Modal de Detalle Enriquecido (`ClientDetailsModal`)
- **Decisión**: Utilizar `React Portals` (`createPortal(..., document.body)`) con clase `z-[9999]` para proyectar el modal completo de perfil del cliente.
- **Razón**: Mantiene la arquitectura limpia evitando problemas de z-index y stacking context CSS.

### 3. API GET `/api/clients/:id` para Detalle Extendido
- **Decisión**: El backend consulta e incluye la relación `subscriptions` con sus respectivos `profile` -> `account` -> `product` e historial de ventas `sales`.
- **Razón**: Permite al frontend listar todas las cuentas de streaming que el cliente ha adquirido a lo largo del tiempo.

## Risks / Trade-offs

- **[Riesgo]** Clientes con un volumen extenso de suscripciones pasadas pueden saturar el modal.
  - **Mitigación**: Implementar desplazamiento vertical contenido (`max-h-[60vh] overflow-y-auto`) con badges distintivos de estado (Activo, Expirado).
