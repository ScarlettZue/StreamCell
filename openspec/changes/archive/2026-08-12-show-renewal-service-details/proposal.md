## Why

Al abrir la ventana modal "Renovar Servicio (+30 Días)" desde el panel de vencimientos, el campo "Costo Real" mostraba el costo total de la cuenta completa (ej: $44.900) en lugar del costo unitario preestablecido por perfil (ej: $8.980), a diferencia de la sección de Venta Rápida.

## What Changes

- **Resumen en Modal de Renovación**: Agregar una tarjeta informativa compacta dentro de la modal de renovación que muestre:
  - Nombre del Cliente
  - Nombre de la Plataforma / Servicio y Perfil asignado
  - Correo electrónico de la cuenta
  - Fecha de vencimiento actual
- **Precarga de Costo Real Unitario de Perfil**:
  - Al abrir la modal de renovación, calcular y precargar el costo real unitario dividiendo el costo total del producto entre la cantidad de perfiles de la cuenta (`Math.round(defaultCost / profilesCount)`), garantizando consistencia con los precios preestablecidos en el inventario y venta rápida.
- **Simplificación del Saludo en WhatsApp**:
  - Eliminar el nombre del cliente del saludo de WhatsApp (`Hola buenas tardes, ...` o `Hola buenas noches, ...`).
- **Corrección Estricta de Fecha de Corte en WhatsApp (UTC/Colombia)**:
  - Parsear la fecha de corte sin desfasamiento UTC para que `12/08/2026` imprima siempre la fecha exacta del día configurado.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `customer-subscriptions-billing`: Precarga de costo unitario por perfil en renovación de servicios y visualización de resumen descriptivo.

## Impact

- **Frontend**: Componente `ExpirationsPage.tsx`.
- **Backend**: Sin cambios adicionales.
