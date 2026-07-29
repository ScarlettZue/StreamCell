# 02 - Requisitos del Sistema: Streamcell

## 1. Requisitos Funcionales (RF)

### Módulo: Autenticación & Usuarios (Auth)
- **RF-AUTH-01:** Inicio de sesión seguro de Administrador con JWT.

### Módulo: Gestión de Clientes & Deudas (CRM)
- **RF-CLI-01:** Registro rápido de cliente con **Nombre** y **Número de Celular** (extraídos del formato Excel actual).
- **RF-CLI-02:** Generación automática de ID o Llave Única por cliente.
- **RF-CLI-03:** Control de **Saldo Deudor**: El sistema debe registrar deudas acumuladas por días de servicio usados no pagados.
- **RF-CLI-04:** Consultar historial de compras, deudas pendientes y estado de pagos de cada cliente.

### Módulo: Tipos de Productos & Inventario Digital (Modelado sobre Excel Base)
- **RF-PROD-01:** Soporte para modalidades de producto basadas en el archivo Excel `Plataformas Streaming, archivo base.xlsm`:
  1. **Multiperfil (`MULTI_PROFILE`):** Cuentas (ej. Netflix, Disney+, PrimeVideo, HBO, Crunchyroll, Vix, MagisTv) divididas en "1 pantalla", "2 pantallas", "3 pantallas", etc.
  2. **Cuenta Completa (`FULL_ACCOUNT`):** Venta de la totalidad de la cuenta (ej. "PrimeVideoCompleta", "HBOCompleta", "NetflixCompleta").
  3. **Invitación / Uso Personal (`PERSONAL_INVITATION`):**
     - Canva Pro: Registra el correo personal del cliente final.
     - Spotify Familiar: Registra el username/correo de la cuenta y la dirección del grupo (ej. *"Cra. 12b #56-30, Cali"*).
     - ChatGPT / Licencias personales.
- **RF-PROD-02:** Configuración de Perfiles: Nombre del perfil, indicador `tiene_pin`, clave PIN.
- **RF-PROD-03:** Selección de estado vendido durante el registro o posterior, asociando el cliente y definiendo fechas de servicio inicio/fin (+30 días por defecto, modificables).

### Módulo: Renovaciones, Retiros y Deudas
- **RF-REN-01:** Al llegar o sobrepasar la fecha de corte, el sistema debe ofrecer 3 opciones de gestión sobre el perfil/servicio:
  1. **Renovar Servicio:** Registra el cobro, actualiza la fecha inicio (hoy) y fecha fin (+30 días por defecto, editable).
  2. **Retirar Servicio SIN Deuda:** Libera el perfil/cuenta a estado `DISPONIBLE` o desactiva la invitación sin generar saldo pendiente al cliente.
  3. **Retirar Servicio CON Deuda:** Libera/cancela el perfil pero registra una deuda en la cuenta del cliente por los días transcurridos no pagados (monto editable).
- **RF-REN-02:** Permite consultar y liquidar deudas pendientes registradas a los clientes.

### Módulo: Integración y Mensajería Inteligente WhatsApp (Hora Colombia)
- **RF-WSP-01:** Generador de Mensaje Predeterminado de Recordatorio evaluando la **hora oficial de Colombia (`America/Bogota` - UTC-5)**:
  - 05:00 a 11:59 (COT) -> *"Buenos días"*
  - 12:00 a 18:59 (COT) -> *"Buenas tardes"*
  - 19:00 a 04:59 (COT) -> *"Buenas noches"*
  - Plantilla dinámica: *"Hola [Buenos días/tardes/noches], el día [Fecha Vencimiento en formato DD/MM/AAAA] terminó el mes de [Nombre Producto/Servicio], ¿deseas renovar el servicio?"*
- **RF-WSP-02:** Vista Previa & Edición: Antes de iniciar el chat, la administradora puede editar el texto final en un modal.
- **RF-WSP-03:** Botón de un solo clic que abre WhatsApp Web o App Móvil (`https://wa.me/PHONE?text=ENCODED_MESSAGE`).

### Módulo: Ventas & Precios Dinámicos (Sustituto de 'Ventas' y 'Listado Precios' Excel)
- **RF-VENT-01:** Cargar precios predeterminados sugeridos desde el catálogo (`Listado Precios`) y permitir modificar en tiempo real el Costo Real ($) y Precio de Venta ($) en cada venta.
- **RF-VENT-02:** Descuento automático de stock e impacto inmediato en el cálculo de Ganancia Neta.

---

## 2. Requisitos No Funcionales (RNF)

- **RNF-01 (Normalización de Zona Horaria):** Todas las operaciones de fecha (conteo de días de corte, saludo horario de WhatsApp, cierres diarios de caja) deben procesarse y mostrarse en la zona horaria **`America/Bogota` (UTC-5)**.
- **RNF-02 (Seguridad):** Cifrado en reposo de contraseñas de cuentas, PINs y datos sensibles.
- **RNF-03 (Compatibilidad Excel):** Estructura de base de datos 100% preparada para importar el histórico de las hojas `Registro`, `Ventas` y `Gastos` del archivo `Plataformas Streaming, archivo base.xlsm`.
