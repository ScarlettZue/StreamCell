# 09 - Especificación UI/UX: Streamcell

---

## Componentes UI Específicos

### 1. Modal de Envío de Recordatorio por WhatsApp
- **Comportamiento:** Al presionar el botón `[WhatsApp]` en cualquier fila de vencimiento:
- **Vista Previa Editable:**
  - El sistema detecta la hora (ej. 14:30) y sugiere en el título *"Buenas tardes"*.
  - Un área de texto (`textarea`) contiene la plantilla precargada:
    > *"Hola buenas tardes [Nombre Cliente], el día [Fecha] terminó el mes de [Producto], ¿deseas renovar el servicio?"*
  - La administradora puede modificar cualquier palabra del mensaje en vivo antes de presionar `[Enviar a WhatsApp]`.

### 2. Modal de Gestión de Retiro / Deuda
- Al presionar `[Retirar]` sobre un perfil atrasado/vencido, despliega un modal con 2 opciones clarísimas:
  1. `[Retirar Sin Deuda]`: Finaliza la suscripción inmediatamente y libera el perfil en inventario.
  2. `[Retirar Con Deuda]`: Muestra un campo de entrada numérico `Monto de Deuda ($)` (calculado automáticamente por los días de atraso, pero editable). Al guardar, se almacena en la ficha del cliente y libera el perfil.

### 3. Selector de Tipo de Producto en Formulario
- Selector de tipo:
  - 🟣 **Multiperfil (ej. Netflix):** Habilita tarjetas de perfiles con PIN.
  - 🔵 **Cuenta Completa:** Asigna todos los perfiles de la cuenta a 1 solo cliente en 1 clic.
  - 🟢 **Invitación Personal (ej. Canva / Spotify):** Habilita campos para Correo de Usuario y Dirección de Grupo Familiar.
