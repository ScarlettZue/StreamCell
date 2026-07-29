# 04 - Modelo de Datos Detallado: Streamcell

Este documento describe el esquema de base de datos relacional para PostgreSQL utilizando Prisma ORM.

---

## Definición de Entidades

### 1. `Category` (Categorías)
- `id`: String (UUID, PK)
- `name`: String (ej. "Streaming Video", "Música", "Diseño & Software")
- `description`: String?

### 2. `Product` (Definición del Producto/Servicio)
- `id`: String (UUID, PK)
- `name`: String (ej. "Netflix 4K", "Canva Pro Invitación", "Spotify Familiar", "Disney+ Cuenta Completa")
- `categoryId`: String (FK -> Category)
- `type`: Enum (`MULTI_PROFILE`, `FULL_ACCOUNT`, `PERSONAL_INVITATION`)
- `defaultCost`: Decimal
- `defaultPrice`: Decimal
- `profilesCount`: Int (Default 1 para cuentas individuales)
- `isActive`: Boolean

### 3. `Account` (Cuenta Madre o Registro de Servicio)
- `id`: String (UUID, PK)
- `productId`: String (FK -> Product)
- `email`: String (Correo principal o correo de la cuenta)
- `password`: String? (Contraseña, cifrada)
- `startDate`: DateTime (Fecha inicio/registro)
- `dueDate`: DateTime (Fecha corte principal de la cuenta, por defecto +30d)
- `status`: Enum (`ACTIVE`, `SUSPENDED`, `EXPIRED`)
- `notes`: String?

### 4. `AccountProfile` (Perfil o Cupo Individual)
- `id`: String (UUID, PK)
- `accountId`: String (FK -> Account)
- `profileName`: String (ej. "Perfil 1" o "Cupo Invitación")
- `hasPin`: Boolean (Default false)
- `pin`: String?
- `userEmail`: String? (Para servicios tipo Canva Pro: correo personal del cliente final)
- `spotifyUsername`: String? (Para Spotify: usuario o correo de la cuenta)
- `familyAddress`: String? (Para Spotify Familiar: ej. "Cra 23 67-09")
- `status`: Enum (`AVAILABLE`, `SOLD`, `DISABLED`)

### 5. `Client` (Clientes)
- `id`: String (UUID, PK)
- `clientKey`: String (Unique, ej. "CLI-0001")
- `name`: String
- `phone`: String
- `totalDebt`: Decimal (Monto total acumulado de deudas no pagadas, Default: 0.00)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 6. `ProfileSubscription` (Asignación y Estado de Servicio)
- `id`: String (UUID, PK)
- `accountProfileId`: String (FK -> AccountProfile)
- `clientId`: String (FK -> Client)
- `serviceStartDate`: DateTime
- `serviceEndDate`: DateTime (Default +30d, modificable)
- `status`: Enum (`ACTIVE`, `EXPIRED`, `CANCELLED_NO_DEBT`, `CANCELLED_WITH_DEBT`)
- `debtAmount`: Decimal (Monto adeudado si se retiró con deuda)

### 7. `DebtRecord` (Historial de Deudas por Atraso)
- `id`: String (UUID, PK)
- `clientId`: String (FK -> Client)
- `subscriptionId`: String? (FK -> ProfileSubscription)
- `amount`: Decimal (Monto adeudado)
- `reason`: String (ej. "Atraso de 5 días en perfil Netflix Cuenta 2")
- `isPaid`: Boolean (Default false)
- `createdAt`: DateTime

### 8. `Sale` & `SaleDetail` (Ventas y Precios Dinámicos)
- Entidades para guardar `unitCost` y `unitPrice` cobrados por cada venta o renovación.
