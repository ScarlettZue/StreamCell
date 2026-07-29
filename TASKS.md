# Lista de Tareas - Streamcell

> Leyenda de estado:
> - `[ ]` Pendiente
> - `[/]` En progreso
> - `[x]` Completado

---

## 📚 Fase 0: Documentación Completa del Sistema

- [x] Documentar Visión del Producto y Reemplazo de Excel ([docs/01-vision.md](file:///c:/Users/Tina/Documents/StreamCell/docs/01-vision.md))
- [x] Documentar Requisitos Funcionales ([docs/02-requisitos.md](file:///c:/Users/Tina/Documents/StreamCell/docs/02-requisitos.md))
- [x] Documentar Historias de Usuario ([docs/03-historias-usuario.md](file:///c:/Users/Tina/Documents/StreamCell/docs/03-historias-usuario.md))
- [x] Documentar Modelo de Datos ([docs/04-modelo-datos.md](file:///c:/Users/Tina/Documents/StreamCell/docs/04-modelo-datos.md))
- [x] Documentar Arquitectura DDD ([docs/05-arquitectura.md](file:///c:/Users/Tina/Documents/StreamCell/docs/05-arquitectura.md))
- [x] Documentar Flujos de Negocio ([docs/06-flujo-negocio.md](file:///c:/Users/Tina/Documents/StreamCell/docs/06-flujo-negocio.md))
- [x] Documentar Roadmap de Desarrollo ([docs/07-roadmap.md](file:///c:/Users/Tina/Documents/StreamCell/docs/07-roadmap.md))
- [x] Documentar Especificación de API REST ([docs/08-api.md](file:///c:/Users/Tina/Documents/StreamCell/docs/08-api.md))
- [x] Documentar UI/UX ([docs/09-ui-ux.md](file:///c:/Users/Tina/Documents/StreamCell/docs/09-ui-ux.md))
- [x] Documentar Manual de Marca, Voz, Tono y Colores Azul/Morado ([docs/10-manual-marca.md](file:///c:/Users/Tina/Documents/StreamCell/docs/10-manual-marca.md))
- [x] Registro de Decisiones ADR 001 - 008 ([docs/decisiones.md](file:///c:/Users/Tina/Documents/StreamCell/docs/decisiones.md))
- [x] Actualizar Modelo de Base de Datos PostgreSQL/Prisma ([docs/database.md](file:///c:/Users/Tina/Documents/StreamCell/docs/database.md))

---

## 🚀 Versión 0.1: Reemplazo Total de Excel

### 0.1.1 Infraestructura Backend & Supabase Cloud
- [x] Inicializar backend en `backend/` (Express + TypeScript + Prisma)
- [x] Despliegue de base de datos relacional de 10 tablas en Supabase Cloud PostgreSQL
- [x] Seed inicial de usuario Administradora y categorías en Supabase
- [x] Hashing Bcrypt, JWT y Cifrado AES-256 para contraseñas de cuentas y PINs

### 0.1.2 Frontend Base & Sistema de Diseño
- [x] Inicializar proyecto frontend en `frontend/` (React + TypeScript + Vite + TailwindCSS)
- [x] Configuración del tema oscuro con colores oficiales (Azul & Morado)
- [x] Vistas construidas e integradas: Login, Dashboard, Clientes, Cuentas/Perfiles, Ventas y Alertas
- [x] Integración de modal WhatsApp con saludo dinámico según hora de Colombia (COT)
