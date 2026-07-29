# 01 - Visión del Producto: Streamcell

## 1. Declaración de Visión
**Streamcell** es una plataforma web integral diseñada para optimizar y automatizar la gestión administrativa y comercial de una empresa distribuidora de productos y servicios digitales (cuentas de streaming, licencias, cuentas completas y servicios por invitación como Canva o Spotify).

---

## 2. Antecedentes y Problema a Resolver
Actualmente, las operaciones de Streamcell (registro de clientes, cuentas digitales, perfiles con PIN, cuentas completas, invitaciones personales, fechas de corte, deudas y recordatorios de cobro) se gestionan de forma manual mediante hojas de cálculo en Excel.

### Problemas principales identificados:
- **Gestión de vencimientos y atrasos:** Frecuentemente se pasan las fechas de corte sin avisar a tiempo al cliente, o el cliente no paga inmediatamente. Se requiere un control claro para renovar o retirar el perfil/cuenta con o sin saldo deudor.
- **Comunicación manual repetitiva en WhatsApp:** Generar manualmente mensajes de cobro según la hora del día ("buenos días/tardes/noches"), nombre del cliente, producto y fecha de vencimiento toma mucho tiempo y es propenso a errores.
- **Diversidad de Tipos de Productos Digitales:**
  - Cuentas multiservicio divididas en perfiles con PIN (ej. Netflix).
  - Cuentas completas vendidas a un solo cliente.
  - Servicios personales/invitaciones individuales (ej. Canva Pro que requiere correo del usuario, o Spotify Familiar que requiere username y dirección física del grupo).

---

## 3. Solución Propuesta (Streamcell Platform)

### Fase 1: Panel Administrativo Interno (Enfoque Propietaria/Vendedora)
Un sistema web seguro para uso exclusivo de Streamcell que sustituye 100% el Excel y permite:
- **Gestión Multi-tipo de Productos:**
  - *Modo Perfiles:* Cuentas madre con sub-perfiles independientes y PIN.
  - *Modo Cuenta Completa:* Venta de la totalidad de la cuenta a un solo cliente.
  - *Modo Invitación / Uso Personal:* Cuentas individuales (ej. Canva Pro con correo de usuario, Spotify Familiar con dirección de grupo "Cra 23 67-09" y username).
- **Gestión de Retiros y Deudas:**
  - Opción de renovación normal.
  - Opción de retirar el perfil/cuenta sin registrar deuda.
  - Opción de retirar el perfil/cuenta registrando una deuda por días de servicio no pagados (monto editable).
- **Integración y Plantillas Inteligentes de WhatsApp:**
  - Generación automática del saludo según la hora del sistema: "Buenos días", "Buenas tardes" o "Buenas noches".
  - Plantilla dinámica con nombre del cliente, fecha y producto, con vista previa editable antes de abrir el chat.
- **CRM de Clientes con Historial de Deudas:** Nombre, celular, ID único y saldo pendiente de cobro.
- **Precios Dinámicos:** Modificación de costos reales y precios de venta al momento de cada transacción.

### Fase 2: Evolución a Tienda Online & SaaS Autónomo
- Portal público donde los clientes compran automáticamente vía pasarelas de pago y reciben las credenciales, enlaces de invitación o credenciales asignadas al instante.
