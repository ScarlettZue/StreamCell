## ADDED Requirements

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
