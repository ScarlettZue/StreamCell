## Purpose

Proporciona la funcionalidad para notificar al cliente vía WhatsApp inmediatamente después de renovar exitosamente su suscripción o servicio, garantizando un cálculo continuo de la nueva fecha de corte desde el vencimiento previo, ofreciendo selecciones rápidas multimes (+30, +60, +90 días) con precios proporcionales y permitiendo la edición completa de ventas (fechas, precios y reasignación de cuenta/perfil).

## ADDED Requirements

### Requirement: Cálculo de Renovación Continua Basado en Fecha Previa
El sistema DEBE calcular la nueva fecha de corte sumando el período seleccionado a la fecha de corte previa de la suscripción (`serviceEndDate`), manteniendo la continuidad del ciclo de servicio independientemente del día en que se procese la renovación en la plataforma.

#### Scenario: Renovación de servicio cuya fecha previa expiró días antes
- **WHEN** el administrador renueva un servicio cuya fecha de corte actual era el 12 de agosto de 2026 y selecciona 30 días
- **THEN** el sistema establece la nueva fecha de corte como el 11 de septiembre de 2026 (sumando 30 días a la fecha previa, no al día actual).

### Requirement: Opciones Rápidas Multimes (+30, +60, +90 Días) y Cálculo Dinámico de Precios
El modal de renovación DEBE ofrecer botones de selección rápida de período (`+30 Días`, `+60 Días`, `+90 Días`) y recalcular automáticamente el costo real, el precio cobrado y la nueva fecha de corte.

#### Scenario: Selección de renovación de 60 días
- **WHEN** el administrador selecciona la opción `+60 Días` en el modal de renovación
- **THEN** el sistema ajusta la nueva fecha de corte calculada (+60 días desde la fecha previa) y multiplica automáticamente el costo real base y precio cobrado base por 2.

### Requirement: Edición Completa de Ventas y Suscripciones (Fechas, Precios y Reasignación de Cuenta)
El sistema DEBE permitir al administrador editar completamente cualquier venta o suscripción registrada, pudiendo modificar costo real, precio cobrado, fechas de servicio (`serviceStartDate`, `serviceEndDate`) y reasignar la suscripción a otro perfil o cuenta madre disponible.

#### Scenario: Reasignación de perfil y modificación de fechas en una venta
- **WHEN** el administrador edita una venta desde la interfaz y selecciona un nuevo perfil de cuenta junto con nuevas fechas de corte
- **THEN** el sistema desvincula el perfil previo, vincula el nuevo perfil al cliente y actualiza el rango de fechas y montos financieros correspondientes.

### Requirement: Modal de Notificación Pos-Renovación
El sistema DEBE presentar un modal o vista de confirmación inmediatamente después de procesar con éxito la renovación de un servicio o suscripción, ofreciendo al administrador la opción explícita de enviar la notificación de renovación por WhatsApp al cliente.

#### Scenario: Renovación exitosa desplegando opción de envío por WhatsApp
- **WHEN** el administrador confirma la renovación de un servicio en la interfaz y la API responde exitosamente
- **THEN** el sistema muestra la confirmación de la renovación junto con una vista previa editable del mensaje de WhatsApp y el botón "Enviar mensaje por WhatsApp"

### Requirement: Generación del Mensaje Estructurado de Renovación
El sistema DEBE generar automáticamente el mensaje de confirmación de renovación con la siguiente plantilla estructurada:
- Confirmación inicial del servicio renovado.
- Nombre del servicio, tipo de cuenta/pantalla y días de renovación (ej: `NETFLIX 1 PANTALLA X60 DIAS`).
- Credenciales completas del servicio según aplique: Correo, Contraseña, Perfil y PIN.
- Advertencia/Recomendaciones de uso de la cuenta ("No compartir o cambiar contraseñas, evitar tener más de un dispositivo conectado a su pantalla para evitar suspensión de la cuenta.").
- Nueva fecha de vencimiento formateada en español (ej: `Válido hasta 11 de septiembre de 2026`).

#### Scenario: Generación correcta del mensaje para perfiles con PIN
- **WHEN** se renueva una suscripción tipo perfil independiente con PIN
- **THEN** el mensaje generado incluye el nombre del servicio con la duración elegida, correo de la cuenta, contraseña, nombre del perfil, PIN, la nota de restricción de uso y la fecha de corte formateada en español.

### Requirement: Redirección directa a WhatsApp Web / App
El sistema DEBE proporcionar una acción directa para abrir `https://wa.me/57<telefono>?text=<mensaje_url_encoded>` con el número del cliente normalizado a 10 dígitos y prefijo internacional de Colombia (`57`), además de permitir copiar el mensaje al portapapeles.

#### Scenario: Clic en Enviar por WhatsApp
- **WHEN** el usuario presiona "Enviar por WhatsApp" desde la pantalla pos-renovación
- **THEN** el navegador abre una nueva pestaña redirigiendo a la URL de WhatsApp con el número del cliente y el mensaje codificado correctamente.
