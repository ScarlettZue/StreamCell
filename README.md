# Streamcell - Plataforma Administrativa de Productos Digitales

Plataforma web integral modular diseñada bajo **Clean Architecture** y **Domain-Driven Design (DDD)** para la gestión administrativa, ventas, inventario por perfiles con PIN, cuentas completas, servicios por invitación (Canva, Spotify) y control financiero de la empresa **Streamcell**.

---

## 📐 Convenciones del Proyecto

### 1. Nomenclatura y Estilos de Código
- **Componentes React (Frontend):** `PascalCase` (ej: `ClientListModal.tsx`, `AccountWizard.tsx`).
- **Hooks Personalizados:** `useNombreHook` (ej: `useAccounts.ts`, `useWhatsAppReminder.ts`).
- **Interfaces y Tipos TypeScript:** Prefijo `I` para interfaces de dominio o tipos descriptivos (ej: `IClient`, `IAccountProfile`, `WhatsAppTemplateData`).
- **Servicios:** `nombreDominio.service.ts` o `NombreService` (ej: `whatsappService.ts`, `auth.service.ts`).
- **Controladores:** `nombreDominio.controller.ts` o `NombreController` (ej: `clientController.ts`, `accountController.ts`).
- **Archivos de Rutas:** `nombreDominioRoutes.ts` (ej: `clientRoutes.ts`, `whatsappRoutes.ts`).

### 2. Estructura Arquitectónica (Clean Architecture + DDD)
```
src/
├── domain/           # Entidades puras, Value Objects y Servicios de Dominio (Sin dependencias externas)
├── application/      # Casos de uso (Use Cases) y DTOs
├── infrastructure/   # Prisma ORM, Adaptadores de seguridad (Bcrypt, AES-256), Repositorios
└── presentation/     # Controladores Express, Middlewares y Enrutadores REST API
```

### 3. Zona Horaria & Normalización de Fechas
- **Estándar:** Todas las operaciones de fecha y hora se calculan en la zona horaria **`America/Bogota` (Colombia - UTC-5)**.
- **Base de Datos:** Almacena timestamps en formato UTC ISO-8601.
- **Formato de Presentación:** Representación latina `DD/MM/AAAA`.

### 4. Flujo de Git y Commits
- **Estrategia de Ramas:**
  - `main`: Producción y versiones estables aprobadas.
  - `develop`: Rama principal de desarrollo activo.
  - `feature/nombre-caracteristica`: Ramas secundarias para tareas específicas.
- **Formato de Commits (Conventional Commits):**
  - `feat(modulo): ...` -> Nuevas funcionalidades.
  - `fix(modulo): ...` -> Corrección de errores.
  - `docs: ...` -> Cambios en documentación o comentarios.
  - `refactor: ...` -> Mejoras de código sin cambiar comportamiento.
- **Política de Git Push:** **NUNCA** realizar `git push` automáticamente. El envío a remoto requiere autorización explícita del usuario.

---

## 🗄️ Configuración de Base de Datos (Supabase)

Para conectar el backend de Streamcell a la instancia de **Supabase PostgreSQL**:

1. Abre el archivo `backend/.env`.
2. Actualiza la variable `DATABASE_URL` con tu cadena de conexión proporcionada por Supabase:
   ```env
   DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres?schema=public"
   ```
3. Ejecuta el comando de migración de Prisma:
   ```bash
   cd backend
   npx prisma db push
   ```

---

## 🚀 Scripts Disponibles (Backend)

En el directorio `backend/`:
- `npm run dev`: Inicia el servidor de desarrollo con recarga en tiempo real.
- `npm run build`: Compila el código TypeScript a JavaScript en `dist/`.
- `npm start`: Inicia el servidor en producción.
- `npx prisma generate`: Genera los tipos de Prisma Client.
- `npx prisma db push`: Sincroniza el esquema del modelo con PostgreSQL en Supabase.
- `npx prisma studio`: Abre la interfaz gráfica para gestionar los datos de la base de datos.
