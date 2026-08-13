# services-inventory-management Specification

## Purpose
Renames "Cuentas & Perfiles" to "Servicios", unifies platform entries with dual pricing, enables full editing and deletion of created services including adding new profiles after account creation, provides mobile-optimized modal views with centered action buttons, adds brand-aligned Toast notifications, implements searchable client selection, and fixes database transaction timeouts.

## Requirements

### Requirement: Adición Dinámica de Perfiles a Servicios Existentes
The system MUST allow administrators to add new profiles/slots to an existing service during editing. The backend `PUT /accounts/:id` endpoint MUST persist newly added profiles (`!p.id`) into the database alongside any assigned subscriptions.

#### Scenario: Agregar un perfil faltante a un servicio creado
- **WHEN** el usuario edita un servicio existente y hace clic en "+ Agregar Perfil / Cupo" y guarda los cambios
- **THEN** el sistema crea el nuevo perfil en la base de datos asociado a la cuenta madre y lo refleja en la interfaz

### Requirement: Interfaz Móvil Amigable y Botones Centrados en Modales
The system MUST render interactive service modal dialogs with a touch-friendly mobile layout, including generous tap targets, clean profile card containers, and centered action buttons (`Guardar Cambios`, `Cancelar`, `Eliminar Servicio`) using StreamCell brand gradient styling.

### Requirement: Notificaciones Toast con Tono y Personalidad de Marca
The system MUST display visual Toast notifications upon completing actions (updating a service, deleting a service, creating a product). Toasts MUST feature StreamCell brand colors (blue/purple gradients, glassmorphism), Lucide React icons, and a warm, formal, welcoming tone of voice without emojis.

### Requirement: Garantía de Persistencia en Edición con Fallback de Usuario y Timeout Configurado
The system MUST guarantee that updating any service or profile field persists successfully in database transactions with a 30-second timeout configuration (`timeout: 30000`) for Supabase Cloud Pooler compatibility.

### Requirement: Renombrado a "Servicios" y Categorización de Productos
The system MUST rename navigation labels and page headers to **"Servicios"** and classify products into **STREAMING**, **SOFTWARE**, and **IA**.
