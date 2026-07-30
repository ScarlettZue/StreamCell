# customer-subscriptions-billing Specification

## Purpose
Administra el registro y seguimiento de clientes con ID consecutivo CLI-XXXX, ventas, suscripciones activas, cobros y deudas en formato de moneda colombiana $ COP.
## Requirements
### Requirement: Registro de Clientes con ID Consecutivo CLI-XXXX
The system MUST automatically generate a consecutive ID with format CLI-XXXX (e.g. CLI-0001) for each new customer, store a clean 10-digit phone number, allow searching strictly by Name or Mobile Phone, and hide the CLI-XXXX ID from the main list table UI.

#### Scenario: Creación exitosa de un cliente
- **WHEN** el usuario registra un nuevo cliente especificando nombre y número móvil de 10 dígitos
- **THEN** el sistema asigna el siguiente ID consecutivo CLI-XXXX, limpia el número celular y retorna el cliente registrado

#### Scenario: Búsqueda de cliente por Nombre o Celular sin ID visible
- **WHEN** el usuario consulta o busca en el listado principal de clientes
- **THEN** la interfaz filtra por Nombre o Celular sin mostrar la columna visual del ID CLI-XXXX ni saldos deudores en la tabla principal

### Requirement: Formateo de Moneda y Fechas Colombia
The system MUST format all billing and debt amounts in Colombian currency $ COP (e.g. $ 15.000) and present dates in DD/MM/AAAA format adjusted to America/Bogota timezone.

#### Scenario: Visualización de lista de cobros y ventas
- **WHEN** el usuario consulta el panel de ventas o suscripciones
- **THEN** los precios se muestran en formato $ COP (ej: $ 25.000) y las fechas de vencimiento se muestran en formato DD/MM/AAAA

### Requirement: Control de Suscripciones y Deudas
The system MUST register subscriptions linking a CLI-XXXX customer to a streaming profile, managing billed amount, start date, expiration date, and payment status.

#### Scenario: Registro de nueva suscripción con deuda
- **WHEN** se crea una suscripción marcándola como pendiente de pago
- **THEN** el sistema calcula el saldo pendiente en $ COP, actualiza el perfil a ocupado y registra la deuda asociada al cliente CLI-XXXX

### Requirement: Modal de Detalle de Historial del Cliente
The system MUST display a detailed modal via React Portals (z-[9999]) when clicking a customer, showing contact info, registration date (DD/MM/AAAA), WhatsApp chat button, and complete streaming subscriptions history.

#### Scenario: Visualización del detalle del cliente
- **WHEN** el usuario selecciona un cliente del listado principal
- **THEN** el sistema abre un modal en document.body con z-[9999] mostrando la información de contacto del cliente, fecha de registro y la lista histórica de sus cuentas y perfiles de streaming adquiridos

