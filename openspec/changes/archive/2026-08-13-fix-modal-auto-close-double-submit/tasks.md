## 1. Auditoría y Protección Anti-Doble Envío en Modales de Clientes y Ventas

- [x] 1.1 Auditar `frontend/src/pages/ClientsPage.tsx`: Deshabilitar botones de submit con `isPending`, mostrar spinner `Loader2` y garantizar cierre de modal + reset de estado en `onSuccess`.
- [x] 1.2 Auditar `frontend/src/pages/SalesPage.tsx`: Deshabilitar botones en modal de Venta Rápida, Editar Venta y Eliminar Venta mientras `isPending === true`, cerrando modales y reseteando estado en `onSuccess`.

## 2. Auditoría y Protección en Modales de Cuentas, Productos y Renovaciones/Retiros

- [x] 2.1 Auditar `frontend/src/pages/AccountsPage.tsx`: Asegurar cierre inmediato y estado `disabled={isPending}` en modales de Crear/Editar Cuenta Madre, Perfiles y Eliminación.
- [x] 2.2 Auditar `frontend/src/pages/ExpirationsPage.tsx` y `ProductsPage.tsx`: Verificar deshabilitado de botones e inhabilitación inmediata tras envío en modales de renovación, retiro y productos.
- [x] 2.3 Garantizar la liberación inmediata de perfiles (`AccountProfile.status = 'AVAILABLE'`) e invalidación de `availableProfiles` y `accounts` en `ExpirationsPage.tsx` al retirar un servicio.

## 3. Notificación por WhatsApp Pos-Venta de Asignación de Servicio

- [x] 3.1 Crear la función `formatSaleAssignmentWhatsAppMessage` en `frontend/src/utils/formatters.ts` que construya el mensaje estructurado de asignación (producto, correo, clave, perfil, PIN, advertencias y fecha válida hasta).
- [x] 3.2 Extender la respuesta de `createSale` en el backend (`saleController.ts`) o consulta para retornar los datos completos del perfil asignado y cliente.
- [x] 3.3 Diseñar e implementar el modal pos-venta `SaleSuccessModal` en `SalesPage.tsx` con React Portals (`z-[9999]`), previsualización editable, botón "Enviar por WhatsApp" (`wa.me`) y "Copiar Texto".

## 4. Verificación y Compilación

- [x] 4.1 Ejecutar `npm run build` en el frontend para validar compilación de TypeScript de todos los modales.
- [x] 4.2 Verificar que el registro de una venta directa abra inmediatamente el modal pos-venta WhatsApp con las credenciales formateadas correctamente.
