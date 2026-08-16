# Digital Store Manager

## Descripción

Este proyecto consiste en una plataforma web para administrar la venta de productos digitales.

Inicialmente solamente existirá un usuario administrador.

A futuro evolucionará hacia una plataforma SaaS donde los clientes podrán comprar productos digitales automáticamente.

---

## Objetivos

- Escalable
- Modular
- Código limpio
- Arquitectura mantenible
- Documentación completa

---

## Stack

Frontend

- React
- TypeScript
- TailwindCSS
- React Router
- React Query

Backend

- Node.js
- Express
- Prisma

Base de datos

- PostgreSQL

Autenticación

- JWT

---

## Arquitectura

La aplicación estará dividida por dominios.

- Auth
- Usuarios
- Productos
- Clientes
- Ventas
- Inventario
- Finanzas
- Dashboard

Nunca crear código mezclando responsabilidades entre módulos.

---

## Reglas

- Siempre usar TypeScript.
- Evitar código duplicado.
- Seguir principios SOLID.
- Aplicar Clean Architecture cuando sea posible.
- Priorizar componentes reutilizables.
- No romper funcionalidades existentes.
- Documentar decisiones importantes.
- **Rama por defecto**: Estar siempre ubicado en la rama `develop`.
- **Despliegue y Pruebas**: No mantener ni ejecutar despliegues locales. Las pruebas se ejecutan directamente en Vercel vinculadas a la rama `develop`.
- **Commits y Push**: Queda estrictamente prohibido ejecutar `git commit` o `git push` a menos que el usuario lo ordene explícitamente.


---

## Convenciones

Componentes

PascalCase

Hooks

useNombreHook

Interfaces

IProducto

Servicios

product.service.ts

Controladores

product.controller.ts

---

## Antes de escribir código

Siempre revisar

PROJECT.md

ROADMAP.md

TASKS.md

docs/

---

## Cuando termines una tarea

Actualizar

TASKS.md

CHANGELOG.md

si fue necesario.