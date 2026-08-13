# streaming-accounts-management Specification (Delta)

## ADDED Requirements

### Requirement: Recálculo Histórico de Costos y Utilidades en Ventas
The system MUST recalculate and update stored historical `unitCost`, `totalCost`, `netProfit`, and `subtotalProfit` records for profile sales where unit cost was registered as full account cost instead of proportional cost (`basePrice / totalProfiles`).

#### Scenario: Corrección automática de ventas pasadas
- **WHEN** se ejecuta el proceso de corrección de datos de ventas históricas
- **THEN** el sistema actualiza los registros en base de datos para reflejar el costo unitario proporcional y recalcular la ganancia neta positiva correspondiente

### Requirement: Búsqueda Interactiva en Tiempo Real para Selección de Cliente y Perfil en Venta Rápida
The system MUST allow users to filter clients by typing Name or Phone number, and filter available profiles by typing Platform Name, Profile Name, or Account Email inside the Quick Sale modal form (`SalesPage.tsx`), displaying live autocomplete dropdown option lists.

#### Scenario: Filtrado en tiempo real de cliente y perfil
- **WHEN** el usuario escribe el nombre/teléfono de un cliente o el nombre/correo de una plataforma en el modal de venta rápida
- **THEN** el sistema filtra dinámicamente las opciones y permite seleccionar la coincidencia deseada
