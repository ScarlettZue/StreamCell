# 03 - Historias de Usuario: Streamcell

---

## 👤 Módulo: Clientes & Deudas

### HU-CLI-01: Registrar Cliente Nuevo y Ver Deudas
**Como** Administradora de Streamcell  
**Quiero** registrar clientes solo con Nombre y Celular y poder visualizar sus deudas pendientes  
**Para** controlar quién debe días de servicio sin necesidad de buscar en anotaciones sueltas.

- **Criterios de Aceptación:**
  1. Solicita Nombre y Celular, generando la llave única `clientKey`.
  2. Muestra badge rojo con el monto total de deuda acumulada si la tiene.
  3. Permite abonar o saldar deudas de forma manual.

---

## 📦 Módulo: Productos Multi-tipo (Perfiles, Cuentas Completas e Invitaciones)

### HU-PROD-03: Registrar Servicio por Invitación (Canva Pro / Spotify)
**Como** Administradora de Streamcell  
**Quiero** registrar servicios individuales que requieren correo del usuario o dirección de grupo  
**Para** administrar Canva Pro o Spotify Familiar de forma precisa.

- **Criterios de Aceptación:**
  1. Permite seleccionar el tipo `PERSONAL_INVITATION`.
  2. Solicita el correo del cliente usuario para invitaciones (ej. Canva Pro).
  3. Solicita username y Dirección del Grupo Familiar si el servicio es Spotify (ej. "Cra 23 67-09").
  4. Asigna la fecha inicio y corte (+30 días modificable).

### HU-PROD-04: Venta de Cuenta Completa
**Como** Administradora de Streamcell  
**Quiero** vender una cuenta madre completa a un solo cliente  
**Para** asignar todos los perfiles simultáneamente en un solo clic.

- **Criterios de Aceptación:**
  1. Permite seleccionar `FULL_ACCOUNT`.
  2. Asigna la totalidad de la cuenta al cliente seleccionado.
  3. Aplica un precio de venta total para toda la cuenta.

---

## ⏳ Módulo: Vencimientos, Renovación y Retiro con/sin Deuda

### HU-REN-01: Retirar Perfil o Servicio con/sin Deuda
**Como** Administradora de Streamcell  
**Quiero** que al vencer o pasar la fecha de corte pueda retirar el perfil decidiendo si se le cobra deuda o no  
**Para** llevar las cuentas claras cuando un cliente se atrasa en pagar.

- **Criterios de Aceptación:**
  1. Ante un servicio vencido o atrasado, muestra 3 botones: `[Renovar]`, `[Retirar Sin Deuda]`, `[Retirar Con Deuda]`.
  2. Al seleccionar `Retirar Con Deuda`, permite ingresar o calcular el monto adeudado por los días de atraso.
  3. Registra el saldo deudor en la cuenta del cliente y libera el perfil en el inventario.

---

## 📱 Módulo: Recordatorios por WhatsApp con Saludo Horario

### HU-WSP-01: Generar Mensaje Personalizado por Hora del Día
**Como** Administradora de Streamcell  
**Quiero** enviar un recordatorio por WhatsApp con el saludo automático (días/tardes/noches) y texto predeterminado editable  
**Para** cobrar renovaciones rápidamente con un toque profesional.

- **Criterios de Aceptación:**
  1. Evalúa la hora actual y coloca automáticamente "Buenos días", "Buenas tardes" o "Buenas noches".
  2. Genera el texto: *"Hola [Saludo], el día [Fecha] terminó el mes de [Servicio], ¿deseas renovar el servicio?"*.
  3. Abre un modal que permite editar el mensaje antes de ser enviado.
  4. Redirige a WhatsApp Web o App con un solo clic.
