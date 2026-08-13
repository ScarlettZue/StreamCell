## Why

El usuario prefiere simplificar la tabla principal de clientes enfocándola en la identificación natural por Nombre y Celular/Teléfono, eliminando la columna visual del ID de cliente (`CLI-XXXX`) y desacoplando la gestión directa de deudas de la vista principal de clientes. Además, se requiere un modal de detalle interactivo por cliente para consultar su historial completo de cuentas/suscripciones adquiridas, estado de servicios y métricas clave.

## What Changes

- **Simplificación de la Vista de Clientes**:
  - Eliminación de la columna visible de ID de cliente (`CLI-XXXX`) en la tabla principal (mantenida internamente en el backend si se requiere).
  - Búsqueda en vivo optimizada por **Nombre** y **Celular/Teléfono**.
  - Remoción del modelado directo de saldos deudores de la tabla principal de clientes para mantener una tabla limpia enfocada en el perfil (Nombre, Celular, Fecha de Registro y Acciones).
- **Nuevo Modal de Detalle de Cliente (React Portal con z-[9999])**:
  - Al hacer clic en una fila o botón de ver detalle de un cliente, se despliega un modal enriquecido con:
    - Información de contacto y botón directo de chat de WhatsApp (`wa.me/57...`).
    - Fecha de registro en formato `DD/MM/AAAA`.
    - Historial completo de cuentas y perfiles de streaming adquiridos (plataforma, perfil, PIN, estado de suscripción, fecha de inicio y vencimiento).
    - Métricas del cliente: total de suscripciones adquiridas, estado actual y resumen de historial.
- **Formateo y Estética**:
  - Adherencia estricta al manual de marca (Colores Azul `#3B82F6` y Morado `#8B5CF6`, Dark/Light Mode, Lucide React Icons y cero emojis).

## Capabilities

### New Capabilities
<!-- No new capabilities -->

### Modified Capabilities
- `customer-subscriptions-billing`: Modifica la presentación del listado de clientes (enfoque en Nombre y Celular sin ID visible ni columnas de deuda en la vista principal) y añade la vista detallada de historial de suscripciones por cliente.

## Impact

- **Frontend**: Rediseño de `ClientsPage.tsx` con soporte para modal de detalle enriquecido vía `React Portals` (`createPortal(..., document.body)`) y `z-[9999]`.
- **Backend**: Endpoint GET `/api/clients/:id` optimizado para retornar la información detallada con historial de suscripciones y servicios del cliente.
- **Git**: Commits locales en la rama `develop`.
