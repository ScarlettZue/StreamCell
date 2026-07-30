## Context

Ver `proposal.md` para la motivación general del proyecto. Este documento define la arquitectura técnica del frontend (React 18 + Vite + Tailwind CSS + TanStack React Query v5 + Lucide Icons) y backend (Node.js + Express + TypeScript + Prisma ORM + PostgreSQL en Supabase Cloud).

## Goals / Non-Goals

**Goals:**
- Implementar la estructura completa de base de datos con Prisma en PostgreSQL (Supabase Cloud Pooler en puerto 6543 con `pgbouncer=true` y zona horaria `America/Bogota`).
- Configurar endpoints RESTful seguros e higiénicos con Express y TypeScript para Clientes (`CLI-XXXX`), Cuentas de Streaming, Suscripciones, Deudas y Notificaciones de WhatsApp.
- Crear una interfaz web moderna en React 18 que alterne entre Modo Oscuro (`#090D16`, `slate-900`, `slate-800`) y Modo Claro (`#F8FAFC`, `white`, `slate-200`).
- Implementar modales seguros utilizando exclusivamente `React Portals` (`createPortal(..., document.body)`) y `z-[9999]`.
- Garantizar formateadores universales para Moneda (`$ COP`), Fechas (`DD/MM/AAAA`) y enlaces WhatsApp (`wa.me/57...`).

**Non-Goals:**
- Integración directa con APIs propietarias no oficiales de WhatsApp (se utiliza wa.me URL con prefijo 57 dinámico).
- Pasarelas de pago automáticas con cobro directo con tarjeta (los cobros y ventas se registran comercialmente y se gestionan con avisos).

## Decisions

### 1. Manejo de Modales con React Portals y z-[9999]
- **Decisión**: Implementar un componente unificado `ModalPortal` utilizando `createPortal(children, document.body)` con wrapper `z-[9999]`.
- **Razón**: Previene problemas de desbordamiento, apilamiento de contextos CSS (`stacking context`) y z-index heredados de contenedores o paneles.
- **Alternativas**: Renderizado en árbol DOM hijo normal (descartado por colisiones de CSS y overflow hidden).

### 2. Generador y Formateador de WhatsApp con Prefijo Dinámico 57
- **Decisión**: Los teléfonos se guardan limpios en la base de datos como números de 10 dígitos (ej: `3126622931`). Las URLs de WhatsApp se construyen dinámicamente: `https://wa.me/57${phone}?text=${encodeURIComponent(msg)}`.
- **Razón**: Permite mantener integridad de datos en la BD sin duplicar prefijos de país y asegura compatibilidad directa con WhatsApp Web y Móvil en Colombia.

### 3. Paleta de Colores y Alternancia de Tema (Theme Context)
- **Decisión**: Utilizar `ThemeProvider` en React que gestione las clases en `document.documentElement` (`dark` / `light`) usando íconos `Sun` y `Moon` de Lucide React.
- **Razón**: Cumple estrictamente con el manual de marca `#090D16` / `#F8FAFC` y botones gradiente `from-blue-600 to-purple-600`.

### 4. Prisma Schema y Secuencia CLI-XXXX para Clientes
- **Decisión**: Definir modelo `Customer` con un campo autogenerado o calculado para `clientCode` (`CLI-0001`, `CLI-0002`) basado en el `id` autoincremental o la secuencia de Postgres.
- **Razón**: Proporciona identificadores amigables y legibles para facturación y comunicación comercial.

## Risks / Trade-offs

- **[Riesgo]** Confusión con prefijos en teléfonos ingresados por el usuario.
  - **Mitigación**: Expresión regular en la API y cliente que remueve espacios, guiones y prefijos +57 al guardar, asegurando que siempre se guarden 10 dígitos limpios.
- **[Riesgo]** Trampas de z-index al abrir modales anidados.
  - **Mitigación**: `ModalPortal` se inyecta directamente en `document.body` garantizando `z-[9999]`.
