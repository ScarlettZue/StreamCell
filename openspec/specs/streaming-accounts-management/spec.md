# streaming-accounts-management Specification

## Purpose
Proporciona la gestión completa de plataformas de streaming, cuentas principales con sus credenciales, control detallado de perfiles asignados a clientes y cálculo preciso de utilidades y costos.
## Requirements
### Requirement: Gestión de Cuentas Principales de Streaming
The system MUST allow registering, listing, editing, and disabling main streaming accounts by specifying the platform (Netflix, Spotify, Prime Video, Disney+, Max, etc.), email, password, and max profiles.

#### Scenario: Registro de nueva cuenta de streaming
- **WHEN** el administrador envía el formulario de registro de cuenta con la plataforma, correo de acceso y contraseña
- **THEN** el sistema guarda la cuenta en PostgreSQL mediante Prisma ORM y responde con la cuenta registrada y sus perfiles disponibles inicializados

### Requirement: Control de Perfiles y Asignación
The system MUST define the PIN and profile name for each individual profile within a streaming account, return and display PINs in legible plain text without encryption hashes in all client and account management views, and track availability status.

#### Scenario: Consulta de perfiles disponibles por plataforma
- **WHEN** se solicita la lista de perfiles para venta
- **THEN** el sistema retorna únicamente los perfiles activos que no se encuentran asignados a una suscripción vigente

#### Scenario: Visualización del PIN en texto claro en detalle del usuario
- **WHEN** el usuario consulta la pestaña "Cuentas & Perfiles" en la ficha de un cliente
- **THEN** el sistema muestra el PIN del perfil en texto legible de 4 dígitos (o "Sin PIN"), sin hashes de cifrado ni superposiciones de interfaz

### Requirement: Cálculo Proporcional de Costo por Perfil en Ventas
The system MUST calculate the unit acquisition cost of an individual profile/screen proportionally as `motherAccountBaseCost / totalProfiles` when sold as a profile subscription, reserving the full `motherAccountBaseCost` only for complete account sales ("Venta Cuenta Completa"). Financial cash register records MUST reflect this proportional unit cost for profile sales.

#### Scenario: Registro de venta por pantalla individual
- **WHEN** se registra o reporta la venta de un perfil individual cuya cuenta madre tiene costo de adquisición `$ 44.900` y 5 perfiles en total
- **THEN** el sistema registra en caja como costo unitario de esa venta `$ 8.980` (`$ 44.900 / 5`), calculando la utilidad sobre dicho costo unitario

#### Scenario: Registro de venta de cuenta completa
- **WHEN** se registra o reporta la venta de una cuenta completa
- **THEN** el sistema asigna el costo total de adquisición de la cuenta madre (`$ 44.900`) como costo de la transacción

### Requirement: Permisividad de Valores Numéricos Libres en Formularios
The system MUST allow entering any numeric integer or decimal value (such as `$ 44.900`) in monetary cost and price inputs by using unrestricted step attributes (`step="any"` or `step="1"`), preventing browser step-validation errors.

#### Scenario: Ingreso de precio base sin restricciones de paso
- **WHEN** el usuario ingresa un valor como `44900` en el campo de costo base de adquisición de la cuenta madre
- **THEN** el formulario acepta y guarda el valor sin mostrar advertencias de validación de paso del navegador

### Requirement: Selección de Fechas de Inicio y Vencimiento del Servicio en Registro de Ventas
The system MUST provide interactive date input controls for "Fecha de Inicio del Servicio" and "Fecha de Vencimiento" in the quick sale registration modal dialog. The start date MUST default to the current date and the expiration date MUST default to 30 days after the start date while remaining fully editable by the user.

#### Scenario: Visualización e interacción con fechas de servicio al registrar venta
- **WHEN** el usuario abre el modal "Registrar Venta Rápida" en la sección de ventas
- **THEN** el sistema muestra los campos de fecha predeterminados (inicio hoy, vencimiento a 30 días) y permite al usuario ajustar libremente ambas fechas antes de confirmar la venta

### Requirement: Recálculo Histórico de Costos y Utilidades en Ventas
The system MUST recalculate and update stored historical `unitCost`, `totalCost`, `netProfit`, and `subtotalProfit` records for profile sales where unit cost was registered as full account cost instead of proportional cost (`basePrice / totalProfiles`), and remove specified invalid test sale entries.

#### Scenario: Corrección automática de ventas pasadas
- **WHEN** se ejecuta el proceso de corrección de datos de ventas históricas
- **THEN** el sistema actualiza los registros en base de datos para reflejar el costo unitario proporcional y recalcular la ganancia neta positiva correspondiente

### Requirement: Búsqueda Interactiva en Tiempo Real para Selección de Cliente y Perfil en Venta Rápida
The system MUST allow users to filter clients by typing Name or Phone number, and filter available profiles by typing Platform Name, Profile Name, or Account Email inside the Quick Sale modal form (`SalesPage.tsx`), displaying live autocomplete dropdown option lists.

#### Scenario: Filtrado en tiempo real de cliente y perfil
- **WHEN** el usuario escribe el nombre/teléfono de un cliente o el nombre/correo de una plataforma en el modal de venta rápida
- **THEN** el sistema filtra dinámicamente las opciones y permite seleccionar la coincidencia deseada

### Requirement: Cuadrícula Compacta de 4 Columnas y Perfiles Desplegables en Inventario
The system MUST render streaming accounts in a 4-column responsive grid layout on desktop viewports (`lg:grid-cols-4`). Each account card MUST display a compact header summary by default containing platform name, category badge, masked email toggle, expiration date, and edit button, with profile details collapsed. Clicking the card header or toggle button MUST expand or collapse the detailed list of profiles and PINs.

#### Scenario: Visualización compacta y despliegue de perfiles al dar clic en tarjeta de cuenta
- **WHEN** el usuario navega a la sección "Catálogo e Inventario de Servicios"
- **THEN** las cuentas se presentan en una cuadrícula compacta de 4 columnas con perfiles colapsados, y al hacer clic en una tarjeta de cuenta, se pliega/despliega la lista detallada de sus perfiles

### Requirement: Límite Estricto de Perfiles por Plataforma en Registro de Cuentas
The system MUST enforce `selectedProduct.profilesCount` as the maximum allowed number of profiles when registering or configuring a streaming account in "Venta por Perfiles Individuales" mode (`AccountsPage.tsx`), disabling and blocking the "+ Añadir Perfil" button when `profiles.length >= selectedProduct.profilesCount`, and automatically trimming/adjusting profile fields when switching platforms.

#### Scenario: Bloqueo de botón de añadir perfil al alcanzar el máximo permitido
- **WHEN** el usuario configura los perfiles de un servicio en la modal de registro y la cantidad de perfiles alcanza el límite `profilesCount` de la plataforma elegida (ej. 1 perfil para "Primevideo Pantalla")
- **THEN** el sistema deshabilita el botón "+ Añadir Perfil", cambia su texto a "Máximo alcanzado (X)" e impide agregar más perfiles al formulario

#### Scenario: Ajuste dinámico de perfiles al cambiar de plataforma en el formulario
- **WHEN** el usuario cambia la plataforma seleccionada en el menú desplegable por una plataforma con menor o igual límite de perfiles (ej. de 5 perfiles a 1 perfil)
- **THEN** el sistema ajusta automáticamente la lista de perfiles en el formulario al número de perfiles permitido por la nueva plataforma seleccionada

### Requirement: Flujo Guiado de Retiro de Persona y Edición Opcional de Cuenta Madre
The system MUST provide a multi-step guided confirmation flow when withdrawing a customer/subscription from a profile. The flow MUST prompt the user for:
1. Withdrawal confirmation with direct input for debt amount (`debtAmount`) defaulting to 0 and withdrawal reason. A value of `0` in `debtAmount` MUST automatically indicate no debt (`withDebt: false`), while any value greater than `0` MUST indicate debt registration (`withDebt: true`). The checkbox toggle MUST be omitted.
2. Option to edit parent/mother account details (email, password, profile names, PINs, max profiles).
Upon final confirmation of withdrawal and account updates, ONLY the subscription of the withdrawn user MUST be cancelled, and their assigned profile MUST immediately become available. Active subscriptions of all other users on that account MUST remain untouched and active.

#### Scenario: Retiro de persona con monto de deuda cero (sin deuda)
- **WHEN** el usuario confirma el retiro de un servicio e ingresa `0` en el campo de monto de deuda
- **THEN** el sistema procesa el retiro sin registrar saldo deudor al cliente (`withDebt: false`), libera el perfil asignado y procede al paso de pregunta para editar la cuenta madre.

#### Scenario: Retiro de persona con monto de deuda mayor a cero
- **WHEN** el usuario confirma el retiro de un servicio e ingresa un valor superior a `0` (ej: `$ 15.000`) en el monto de deuda
- **THEN** el sistema registra automáticamente la deuda al cliente (`withDebt: true`), libera el perfil asignado y procede al paso de pregunta para editar la cuenta madre.

#### Scenario: Preservación de suscripciones activas al editar la cuenta madre
- **WHEN** el usuario edita datos de la cuenta madre (correo, contraseña, notas, nombres de perfil o PINs)
- **THEN** el sistema guarda las credenciales y perfiles sin cancelar ni alterar el estado `ACTIVE` de las suscripciones de los demás usuarios que ocupan perfiles en dicha cuenta madre.

