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
- [x] Registro de Decisiones ADR 001 - 006 ([docs/decisiones.md](file:///c:/Users/Tina/Documents/StreamCell/docs/decisiones.md))
- [x] Actualizar Modelo de Base de Datos PostgreSQL/Prisma ([docs/database.md](file:///c:/Users/Tina/Documents/StreamCell/docs/database.md))

---

## 🚀 Versión 0.1: Reemplazo Total de Excel

### 0.1.1 Infraestructura & Base de Datos
- [ ] Inicializar backend en `backend/` (Express + TypeScript + Prisma)
- [ ] Inicializar frontend en `frontend/` (React + TypeScript + TailwindCSS)
- [ ] Implementar esquemas Prisma (`User`, `Client`, `Account`, `AccountProfile`, `ProfileSubscription`, `DebtRecord`, `Sale`, `SaleDetail`)
- [ ] Servicio de Cifrado para credenciales y PINs

### 0.1.2 Autenticación & CRM Clientes
- [ ] Login de Administradora (JWT)
- [ ] API y Pantalla para Clientes con Nombre, Celular, `clientKey` y indicador de Deuda Acumulada

### 0.1.3 Cuentas & Productos Multi-tipo
- [ ] Wizard de Carga de Cuentas (Multiperfil con PIN, Cuenta Completa, Canva Pro con correo, Spotify con username y dirección de grupo)
- [ ] Configuración de fechas de corte (+30d modificables)

### 0.1.4 Retiros, Deudas & WhatsApp
- [ ] Modal y lógica para Renovar, Retirar Sin Deuda o Retirar Con Deuda
- [ ] Motor de mensajes WhatsApp con saludo dinámico según la hora ("días/tardes/noches") y modal editable en frontend
- [ ] Redirección directa a WhatsApp (`wa.me`)

### 0.1.5 Ventas & Precios Dinámicos
- [ ] Modificación de `unitCost` y `unitPrice` por transacción
- [ ] Registro de ventas y cálculo de ganancia neta en tiempo real
