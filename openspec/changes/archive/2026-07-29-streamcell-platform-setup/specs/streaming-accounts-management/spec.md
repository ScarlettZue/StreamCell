## Purpose

Proporciona la gestión completa de plataformas de streaming, cuentas principales con sus credenciales y el control detallado de perfiles asignados a clientes.

## ADDED Requirements

### Requirement: Gestión de Cuentas Principales de Streaming
The system MUST allow registering, listing, editing, and disabling main streaming accounts by specifying the platform (Netflix, Spotify, Prime Video, Disney+, Max, etc.), email, password, and max profiles.

#### Scenario: Registro de nueva cuenta de streaming
- **WHEN** el administrador envía el formulario de registro de cuenta con la plataforma, correo de acceso y contraseña
- **THEN** el sistema guarda la cuenta en PostgreSQL mediante Prisma ORM y responde con la cuenta registrada y sus perfiles disponibles inicializados

### Requirement: Control de Perfiles y Asignación
The system MUST define the PIN and profile name for each individual profile within a streaming account and track availability status.

#### Scenario: Consulta de perfiles disponibles por plataforma
- **WHEN** se solicita la lista de perfiles para venta
- **THEN** el sistema retorna únicamente los perfiles activos que no se encuentran asignados a una suscripción vigente
