## ADDED Requirements

### Requirement: Modal Pos-Venta de Confirmación WhatsApp en Dashboard
Al registrar exitosamente una Venta Rápida desde el Dashboard General, el sistema MUST mostrar inmediatamente un modal interactivo con la confirmación de la venta, el mensaje de asignación de servicio formateado y los botones de acción para WhatsApp y copiado.

#### Scenario: Confirmación y envío por WhatsApp tras venta rápida en Dashboard
- **WHEN** el usuario completa y confirma el formulario de Venta Rápida en el Dashboard
- **THEN** el sistema MUST cerrar el modal de formulario de venta y abrir un modal modal con el mensaje formateado (`formatSaleAssignmentWhatsAppMessage`) que incluye las credenciales del perfil, PIN y fecha de vencimiento, junto a las opciones de "Enviar por WhatsApp" (`wa.me`) y "Copiar Texto".
