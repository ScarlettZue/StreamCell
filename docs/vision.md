# Visión del Producto y Arquitectura - StreamCell

## Visión General
**StreamCell** nace como una plataforma administrativa diseñada para gestionar la comercialización de productos digitales (licencias de software, cuentas, suscripciones, llaves de activación y servicios digitales).

Su arquitectura está conceptualizada para crecer evolutivamente sin necesidad de reescritura:
1. **Fase 1 (Actual):** Panel Administrativo Interno (ERP/CRM enfocado en productos digitales).
2. **Fase 2 (Próxima):** Tienda/Marketplace abierto al público con flujo de compra automatizado, entrega inmediata de digitales y autogestión para clientes.

---

## Principios de Diseño y Arquitectura

### 1. Domain-Driven Design (DDD) & Clean Architecture
El sistema se organiza en **dominios de negocio independientes** para asegurar acoplamiento débil y alta cohesión.

- **Capa de Dominio (Domain):** Entidades de negocio, interfaces de repositorios y reglas de validación sin dependencias externas.
- **Capa de Aplicación (Application):** Casos de uso (Use Cases) que orquestan el flujo de datos.
- **Capa de Infraestructura (Infrastructure):** Adaptadores de base de datos (Prisma), autenticación (JWT), envíos de correos, pasarelas de pago.
- **Capa de Presentación / API (Interfaces/Controllers):** Express REST Controllers, middlewares y rutas.

### 2. Dominios del Sistema
- `Auth`: Autenticación, generación de tokens, hashing de claves.
- `User`: Usuarios administrativos y permisos.
- `Product`: Catálogo de productos, tipos (físico/digital), precios, categorías.
- `Inventory`: Gestión de licencias/claves individuales, stock disponible, kardex/movimientos.
- `Client`: CRM de clientes, historial de compras, datos de contacto.
- `Sale`: Procesamiento de ventas, cálculo de montos, asignación de inventario digital, generación de comprobantes.
- `Finance`: Registro de flujo de caja, ingresos por ventas y egresos/gastos operativos.
- `Dashboard`: Agregación de datos analíticos para la toma de decisiones.

---

## Estrategia de Escalabilidad
- **Base de datos relacional (PostgreSQL):** Garantiza consistencia ACID en transacciones de inventario y ventas.
- **ORM Prisma:** Facilita migraciones seguras y tipado estricto extremo a extremo (TypeScript).
- **Separación Frontend/Backend:** API REST desacoplada para permitir consumo futuro desde aplicaciones móviles o clientes externos.
