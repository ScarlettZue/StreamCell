## Purpose

Garantiza que todos los modales de la interfaz de usuario en móvil y escritorio deshabiliten los botones de envío durante la petición y cierren/restablezcan automáticamente el modal al completarse la operación para evitar registros duplicados, además de asegurar que el retiro de un servicio libere inmediatamente la pantalla dejándola disponible en el inventario y permitiendo notificar al cliente vía WhatsApp de la asignación del servicio tras registrar una venta.

## ADDED Requirements

### Requirement: Bloqueo de Botón de Envío Durante Mutación Activa
Todos los modales de la aplicación MUST deshabilitar el botón primario de guardado/confirmación (`disabled={isPending}`) e indicar estado visual de carga (`Loader2 animate-spin`) tan pronto como el usuario envía el formulario.

#### Scenario: Intento de doble clic en guardar cliente o venta
- **WHEN** el usuario presiona el botón "Guardar" o "Confirmar" en cualquier modal
- **THEN** el sistema deshabilita inmediatamente el botón de envío impidiendo clics adicionales mientras la solicitud HTTP está en proceso (`isPending === true`).

### Requirement: Cierre Automático de Modal y Reset de Estado al Completar
Al recibir una respuesta exitosa del servidor (`onSuccess`), el sistema MUST cerrar inmediatamente el modal interactivo y limpiar las variables de estado del formulario para evitar envíos repetidos accidentalmente.

#### Scenario: Creación exitosa de cliente o eliminación de registro
- **WHEN** la API responde con éxito tras crear, editar o eliminar un cliente, venta o servicio
- **THEN** el modal interactivo correspondiente se cierra automáticamente (`setModalOpen(false)`) y el formulario vuelve a su estado inicial.

### Requirement: Feedback Inmediato e Invalidación de Caché
Al cerrarse el modal por una operación exitosa, el sistema MUST invalidar las consultas de React Query afectadas para refrescar instantáneamente la tabla/lista de datos en la pantalla sin recargar la página.

#### Scenario: Visualización inmediata del nuevo cliente o venta
- **WHEN** la mutación finaliza con éxito y el modal se cierra
- **THEN** la vista principal actualiza la lista reflejando inmediatamente el nuevo registro sin mostrar duplicados.

### Requirement: Liberación Inmediata y Actualización de Perfiles Disponibles al Retirar Servicio
Al realizar el retiro/corte de un servicio de un cliente, el sistema MUST actualizar el estado del perfil asignado a `AVAILABLE` e invalidar la consulta `availableProfiles` y `accounts` en React Query.

#### Scenario: Perfil vuelve a aparecer disponible tras corte de servicio
- **WHEN** el usuario confirma el retiro de servicio de una pantalla/perfil
- **THEN** la suscripción cambia de estado a cancelada y el perfil pasa a estado `AVAILABLE`, reflejándose de inmediato como disponible en el inventario de servicios y en el selector de venta rápida sin necesidad de recargar la página.

### Requirement: Notificación por WhatsApp Pos-Venta de Asignación de Servicio
Al completar exitosamente la creación de una venta directa, el sistema MUST generar el mensaje estructurado de asignación del servicio con las credenciales de acceso y fecha de corte, desplegando un modal emergente pos-venta para enviar por WhatsApp o copiar al portapapeles.

#### Scenario: Generación y envío del mensaje pos-venta por WhatsApp
- **WHEN** el usuario confirma la creación de una venta directa con perfil asignado
- **THEN** la venta se registra, el modal de formulario se cierra y se despliega la ventana pos-venta con el mensaje de asignación formateado en español y el botón directo para enviar a WhatsApp.
