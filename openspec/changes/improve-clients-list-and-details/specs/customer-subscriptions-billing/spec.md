## MODIFIED Requirements

### Requirement: Registro de Clientes con ID Consecutivo CLI-XXXX
The system MUST store a clean 10-digit phone number for each customer, allow searching strictly by Name or Mobile Phone, and hide the CLI-XXXX ID from the main list table UI.

#### Scenario: Búsqueda de cliente por Nombre o Celular sin ID visible
- **WHEN** el usuario consulta o busca en el listado principal de clientes
- **THEN** la interfaz filtra por Nombre o Celular sin mostrar la columna visual del ID CLI-XXXX ni saldos deudores en la tabla principal

## ADDED Requirements

### Requirement: Modal de Detalle de Historial del Cliente
The system MUST display a detailed modal via React Portals (z-[9999]) when clicking a customer, showing contact info, registration date (DD/MM/AAAA), WhatsApp chat button, and complete streaming subscriptions history.

#### Scenario: Visualización del detalle del cliente
- **WHEN** el usuario selecciona un cliente del listado principal
- **THEN** el sistema abre un modal en document.body con z-[9999] mostrando la información de contacto del cliente, fecha de registro y la lista histórica de sus cuentas y perfiles de streaming adquiridos
