# Lista de Tareas - Streamcell

> Leyenda de estado:
> - `[ ]` Pendiente
> - `[/]` En progreso
> - `[x]` Completado

---

## 📚 Fase 0: Documentación Completa del Sistema

- [x] Documentar Visión del Producto y Reemplazo de Excel ([docs/01-vision.md](file:///c:/Users/Tina/Documents/StreamCell/docs/01-vision.md))
- [x] Documentar Requisitos Funcionales (Deudas, WhatsApp, Canva, Spotify, Cuentas completas) ([docs/02-requisitos.md](file:///c:/Users/Tina/Documents/StreamCell/docs/02-requisitos.md))
- [x] Documentar Historias de Usuario ([docs/03-historias-usuario.md](file:///c:/Users/Tina/Documents/StreamCell/docs/03-historias-usuario.md))
- [x] Documentar Modelo de Datos con Deudas, Tipos de Producto y Spotify/Canva ([docs/04-modelo-datos.md](file:///c:/Users/Tina/Documents/StreamCell/docs/04-modelo-datos.md))
- [x] Documentar Arquitectura DDD y Servicios de Dominio ([docs/05-arquitectura.md](file:///c:/Users/Tina/Documents/StreamCell/docs/05-arquitectura.md))
- [x] Documentar Flujos de Negocio (WhatsApp por horario, Retiro con/sin deuda) ([docs/06-flujo-negocio.md](file:///c:/Users/Tina/Documents/StreamCell/docs/06-flujo-negocio.md))
- [x] Documentar Roadmap de Desarrollo ([docs/07-roadmap.md](file:///c:/Users/Tina/Documents/StreamCell/docs/07-roadmap.md))
- [x] Documentar Especificación de API REST ([docs/08-api.md](file:///c:/Users/Tina/Documents/StreamCell/docs/08-api.md))
- [x] Documentar UI/UX (Modal WhatsApp editable, Modal Deudas, Selector de Tipos) ([docs/09-ui-ux.md](file:///c:/Users/Tina/Documents/StreamCell/docs/09-ui-ux.md))
- [x] Registro de Decisiones ADR 001 - 008 ([docs/decisiones.md](file:///c:/Users/Tina/Documents/StreamCell/docs/decisiones.md))
- [x] Actualizar Modelo de Base de Datos PostgreSQL/Prisma ([docs/database.md](file:///c:/Users/Tina/Documents/StreamCell/docs/database.md))

---

## 🚀 Versión 0.1: Reemplazo Total de Excel

### 0.1.1 Infraestructura & Base de Datos Backend
- [x] Inicializar backend en `backend/` (Express + TypeScript + Prisma)
- [x] Configurar esquema Prisma relacional (`User`, `Category`, `Product`, `Account`, `AccountProfile`, `Client`, `ProfileSubscription`, `DebtRecord`, `Sale`, `SaleDetail`)
- [x] Implementar Servicio de Hashing Bcrypt, JWT y Cifrado AES-256 para credenciales y PINs
- [x] Implementar middleware global de manejo de errores (`AppError`) y respuestas estandarizadas
- [x] Implementar Servicio de Dominio `WhatsAppDomainService` con franja horaria colombiana (`America/Bogota`)

### 0.1.2 Autenticación & CRM Clientes
- [x] Seed de usuario Administradora inicial (`POST /api/v1/auth/seed-admin`)
- [x] Endpoint de Login (`POST /api/v1/auth/login`) con generación de JWT
- [ ] API REST CRUD para Clientes (Alta con Nombre, Celular, `clientKey` y Saldo Deudor)

### 0.1.3 Cuentas & Productos Multi-tipo
- [ ] Controller y Use Cases para productos `MULTI_PROFILE`, `FULL_ACCOUNT` y `PERSONAL_INVITATION` (Canva con correo, Spotify con dirección)
- [ ] Configuración de fechas de corte (+30d modificables)

### 0.1.4 Retiros, Deudas & WhatsApp
- [ ] API para Renovar, Retirar Sin Deuda o Retirar Con Deuda
- [ ] Endpoint `POST /api/v1/whatsapp/generate-reminder` con mensaje editable y redirección a `wa.me`

### 0.1.5 Ventas & Precios Dinámicos
- [ ] Modificación de `unitCost` y `unitPrice` por transacción
- [ ] Registro de ventas y cálculo de ganancia neta en tiempo real
