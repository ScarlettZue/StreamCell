## Why

Streamcell requiere la arquitectura base y el sistema completo para la gestión de cuentas de streaming, perfiles, suscripciones, cobros, ventas, deudas de clientes y alertas automatizadas de vencimientos vía WhatsApp. Este cambio establece la base completa del frontend y backend cumpliendo estrictamente con el manual de marca, la arquitectura técnica (Node/Express/Prisma/Supabase PostgreSQL + React/Vite/Tailwind/React Query) y las reglas de negocio específicas.

## What Changes

- **Backend & Database Core**:
  - Configuración del esquema Prisma ORM para PostgreSQL en Supabase Cloud.
  - Modelado de datos para Clientes (ID consecutivo CLI-XXXX, teléfono de 10 dígitos), Cuentas de Streaming, Perfiles, Suscripciones, Transacciones/Ventas y Deudas.
  - Endpoints REST en Express + TypeScript para la gestión integral del sistema.
- **Frontend Architecture & Design System**:
  - Implementación del sistema de diseño en React 18 + Vite + Tailwind CSS con Google Font Inter y paleta oficial (Azul `#3B82F6` y Morado `#8B5CF6`).
  - Soporte completo para Modo Oscuro (fondo `#090D16`, paneles `slate-900`, bordes `slate-800`) y Modo Claro (fondo `#F8FAFC`, paneles `white`, bordes `slate-200`).
  - Botones principales con gradiente `bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md font-bold`.
  - Reutilización de modales con React Portals (`createPortal(..., document.body)`) y `z-[9999]`.
  - Reemplazo absoluto de emojis por íconos de `lucide-react`.
- **Business Logic & WhatsApp Integration**:
  - Formateo estándar de Moneda en `$ COP` (ej: `$ 15.000`).
  - Manejo de fechas en formato `DD/MM/AAAA` (Hora de Colombia `America/Bogota`).
  - Generación dinámica de enlaces `wa.me/57XXXXXXXXXX` para recordatorios y deudas de clientes.

## Capabilities

### New Capabilities
- `streaming-accounts-management`: Gestión completa de plataformas de streaming, cuentas principales, credenciales y asignación de perfiles individuales.
- `customer-subscriptions-billing`: Administración de clientes (con código CLI-XXXX), historial de compras, suscripciones activas, cobros y control de deudas.
- `whatsapp-notifications`: Módulo de alertas y notificaciones de vencimiento por WhatsApp anteponiendo dinámicamente el prefijo 57 a los 10 dígitos del cliente.
- `ui-theme-and-modals`: Sistema UI global con soporte Dark/Light mode, modales en Portals con z-[9999] e iconografía Lucide React sin emojis.

### Modified Capabilities
<!-- No modified capabilities - initial project capabilities setup -->

## Impact

- **Backend**: API REST con Express, TypeScript y Prisma.
- **Database**: PostgreSQL en Supabase Cloud (Puerto 6543, pgbouncer=true, zona horaria America/Bogota).
- **Frontend**: Dashboard y vistas del sistema en React 18, Vite, Tailwind CSS, TanStack React Query v5.
- **Git**: Commits locales organizados en la rama `develop`.
