## ADDED Requirements

### Requirement: Búsqueda Interactiva y Paginación en Historial de Ventas
The system MUST provide real-time search filtering and table pagination in the "Venta Rápida" sales history view (`SalesPage.tsx`). The search control MUST filter records instantly by transaction code (`VTA-XXXX`), client name, or platform product/profile name.

#### Scenario: Filtrado en tiempo real del historial de ventas
- **WHEN** el usuario escribe un código de venta, nombre de cliente o plataforma en la barra de búsqueda de Venta Rápida
- **THEN** la tabla filtra inmediatamente las filas coincidentes sin recargar la página.

#### Scenario: Paginación de transacciones de ventas
- **WHEN** la cantidad de transacciones de venta excede el límite de página (ej. 10 registros por página)
- **THEN** el sistema habilita controles de paginación (Página anterior / Siguiente) manteniendo la fluidez en pantallas móviles y escritorio.

### Requirement: Edición y Eliminación de Transacciones de Ventas (CRUD Completo)
The system MUST allow editing and deleting existing sales transactions. Deleting or updating a sale MUST recalculate cash register balances, profit metrics, and adjust stored transaction records accordingly.

#### Scenario: Edición de una transacción de venta
- **WHEN** el usuario modifica los montos (costo o precio cobrado) o datos de una venta existente desde la interfaz y confirma los cambios
- **THEN** el sistema actualiza la transacción en PostgreSQL mediante Prisma ORM y recalcula la ganancia neta correspondiente.

#### Scenario: Eliminación de una transacción de venta registrada por error
- **WHEN** el usuario selecciona la opción de eliminar una venta y confirma la acción
- **THEN** el sistema elimina el registro de venta y detalles asociados, revirtiendo el impacto financiero en caja.
