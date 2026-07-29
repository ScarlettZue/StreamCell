# Documentación del Modelo de Base de Datos - Streamcell

## Motor de Base de Datos
- **DBMS:** PostgreSQL
- **ORM:** Prisma

---

## Modelo Entidad-Relación (Específico para Streamcell)

### 1. `User` (Administración de Streamcell)
- `id`: String (UUID, PK)
- `email`: String (Unique)
- `password`: String (Hashed bcrypt)
- `name`: String
- `role`: Enum (`ADMIN`)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 2. `Category` (Categoría de Producto)
- `id`: String (UUID, PK)
- `name`: String (Unique, ej. "Streaming Video", "Música")
- `description`: String?

### 3. `Product` (Definición del Servicio)
- `id`: String (UUID, PK)
- `name`: String (ej. "Netflix 4K Premium")
- `categoryId`: String (FK -> Category)
- `defaultCost`: Decimal
- `defaultPrice`: Decimal
- `profilesCount`: Int
- `isActive`: Boolean (Default: true)

### 4. `Account` (Cuenta Madre / Credenciales Proveedor)
- `id`: String (UUID, PK)
- `productId`: String (FK -> Product)
- `email`: String
- `password`: String (Cifrado)
- `startDate`: DateTime (Fecha registro/inicio de cuenta)
- `dueDate`: DateTime (Fecha de corte de la cuenta, por defecto +30d)
- `status`: Enum (`ACTIVE`, `EXPIRED`, `SUSPENDED`)
- `notes`: String?

### 5. `AccountProfile` (Perfil Individual)
- `id`: String (UUID, PK)
- `accountId`: String (FK -> Account)
- `profileName`: String (ej. "Perfil 1")
- `hasPin`: Boolean (Default: false)
- `pin`: String?
- `status`: Enum (`AVAILABLE`, `SOLD`, `DISABLED`)

### 6. `Client` (Clientes)
- `id`: String (UUID, PK)
- `clientKey`: String (Unique, ej. "CLI-0001")
- `name`: String
- `phone`: String
- `createdAt`: DateTime
- `updatedAt`: DateTime

### 7. `ProfileSubscription` (Asignación de Servicio a Cliente)
- `id`: String (UUID, PK)
- `accountProfileId`: String (FK -> AccountProfile)
- `clientId`: String (FK -> Client)
- `serviceStartDate`: DateTime (Default: Now)
- `serviceEndDate`: DateTime (Default: Now + 30d)
- `status`: Enum (`ACTIVE`, `EXPIRED`, `CANCELLED`)

### 8. `Sale` (Encabezado de Venta)
- `id`: String (UUID, PK)
- `code`: String (Unique, ej. "VTA-2026-0001")
- `clientId`: String (FK -> Client)
- `userId`: String (FK -> User)
- `totalAmount`: Decimal
- `totalCost`: Decimal
- `netProfit`: Decimal (`totalAmount - totalCost`)
- `createdAt`: DateTime

### 9. `SaleDetail` (Detalle Dinámico con Costo/Precio Ajustado)
- `id`: String (UUID, PK)
- `saleId`: String (FK -> Sale)
- `accountProfileId`: String (FK -> AccountProfile)
- `unitCost`: Decimal (Costo ajustado para la venta)
- `unitPrice`: Decimal (Precio ajustado para la venta)
- `subtotalProfit`: Decimal (`unitPrice - unitCost`)

---

## Historial de Cambios en la Base de Datos
- **2026-07-29:** Adaptación del modelo relacional al flujo real de Streamcell (cuentas, perfiles con PIN, clientes simplificados por cel/nombre, precios dinámicos por venta).
