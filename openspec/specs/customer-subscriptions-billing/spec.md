# customer-subscriptions-billing Specification

## Purpose
Administra el registro y seguimiento de clientes y distribuidores con ID consecutivo CLI-XXXX, ventas, suscripciones activas, cobros y deudas en formato de moneda colombiana $ COP.

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

### Requirement: Renombrado de la Sección a Usuarios
The system MUST display the main navigation menu entry and page title as "Usuarios" instead of "Clientes & Deudas", serving as the single repository of clients and distributors.

#### Scenario: Visualización del menú de navegación
- **WHEN** el usuario navega por la interfaz de StreamCell
- **THEN** la barra lateral muestra el ítem "Usuarios" con la ruta `/users` (o `/clients`) y el ícono correspondiente

### Requirement: Gestión de Usuarios con Roles (Cliente Final y Distribuidor)
The system MUST store a user role (`CLIENTE` or `DISTRIBUIDOR`) for every registered user, allow selecting the role during user creation, and provide filtering by role in the users list.

#### Scenario: Creación de usuario con selección de rol
- **WHEN** el usuario abre el modal de registro y selecciona el rol (Cliente Final o Distribuidor)
- **THEN** el sistema guarda el usuario asignándole el rol seleccionado y el ID consecutivo `CLI-XXXX`

#### Scenario: Filtrado de usuarios por rol
- **WHEN** el usuario aplica el filtro de rol "Distribuidor" o "Cliente Final" en la barra superior
- **THEN** la tabla principal muestra exclusivamente los usuarios que coinciden con el rol seleccionado

### Requirement: Vista Detallada de Usuario con Historial, Cuentas Activas y Deudas
The system MUST render a detailed modal/drawer when selecting a user from the list, displaying their profile info, active streaming accounts/profiles, full purchase history, debt breakdown (handling unpaid service days), and direct WhatsApp interaction.

#### Scenario: Consulta del detalle de un usuario
- **WHEN** el usuario hace clic sobre una fila del listado de usuarios
- **THEN** el sistema despliega un modal mediante React Portals (`z-[9999]`) que incluye:
  - Información de contacto y etiqueta de Rol (`CLIENTE` / `DISTRIBUIDOR`)
  - Pestaña/Sección de Cuentas & Perfiles Activos
  - Pestaña/Sección de Historial de Compras
  - Pestaña/Sección de Deudas (monto adeudado en $ COP y días en mora/pendientes)
  - Botón de acción directa para chatear por WhatsApp (`wa.me/57...`)

### Requirement: Vinculación de Clientes a un Distribuidor
The system MUST allow linking an end-user client to a registered distributor via an optional `distributorId` field, displaying the distributor association in user lists and profile details.

#### Scenario: Asignación de distribuidor durante la creación del cliente
- **WHEN** el usuario registra un nuevo cliente especificando un distribuidor en la lista desplegable
- **THEN** el sistema guarda el cliente enlazado al ID del distribuidor seleccionado

#### Scenario: Visualización del distribuidor en el listado de usuarios
- **WHEN** el usuario consulta la tabla principal de usuarios
- **THEN** las filas de los clientes finales muestran el nombre o etiqueta del distribuidor al que pertenecen

#### Scenario: Pestaña de Clientes Asignados en el modal del Distribuidor
- **WHEN** el usuario abre la ficha detallada de un usuario con rol Distribuidor
- **THEN** el modal incluye una pestaña "Clientes Asignados" mostrando el listado de clientes bajo su red, sus cuentas activas y su saldo acumulado
