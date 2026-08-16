## 1. Utilitario de Formateo de Mensaje de Renovación

- [x] 1.1 Crear o extender la función `formatRenewalWhatsAppMessage` en `frontend/src/utils/whatsappUtils.ts` (o `formatters.ts`) que genere la plantilla formateada con datos de acceso y fecha de vencimiento en español completo.
- [x] 1.2 Añadir pruebas unitarias o de verificación para la generación correcta del mensaje con perfiles con PIN, cuentas completas e invitaciones.

## 2. Integración en el Flujo de Renovación y Modal Pos-Renovación

- [x] 2.1 Actualizar el callback `onSuccess` de `renewMutation` en `frontend/src/pages/ExpirationsPage.tsx` para capturar la información actualizada de la suscripción y fecha de vencimiento.
- [x] 2.2 Diseñar e implementar el modal pos-renovación (`RenewalSuccessModal` o sección en `ExpirationsPage.tsx`) con React Portals (`z-[9999]`).
- [x] 2.3 Incluir vista previa editable del mensaje de confirmación de renovación en el modal pos-renovación.
- [x] 2.4 Agregar acciones para abrir WhatsApp (`wa.me/57...`) y copiar el texto al portapapeles.

## 3. Renovación Continua (+30, +60, +90 días) y Precios Dinámicos

- [x] 3.1 Actualizar el cálculo de la fecha de corte en el backend (`backend/src/services/subscription.service.ts`) para sumar los días de renovación sobre la fecha previa `serviceEndDate` y no sobre la fecha actual `now`.
- [x] 3.2 Añadir botones de período rápido (`+30 Días`, `+60 Días`, `+90 Días`) en el modal de renovación de `ExpirationsPage.tsx`.
- [x] 3.3 Implementar el cálculo automático proporcional de costo real y precio cobrado según la duración seleccionada (1x, 2x, 3x).
- [x] 3.4 Previsualizar la **Nueva Fecha de Corte Calculada** en tiempo real en el modal de renovación.
- [x] 3.5 Actualizar el envío de renovación (`renewMutation`) enviando las fechas y la duración a la API y al formateador de WhatsApp.

## 4. Edición Completa de Ventas (Fechas, Precios y Reasignación de Cuenta/Perfil)

- [x] 4.1 Actualizar los controladores y servicios del backend (`backend/src/controllers/sale.controller.ts`, `backend/src/services/sale.service.ts`) para permitir la edición de `serviceStartDate`, `serviceEndDate`, `saleCost`, `salePrice` y la reasignación de `profileId`.
- [x] 4.2 Extender la interfaz y modal de edición de ventas en el frontend (`SalesPage.tsx` / `EditSaleModal`) agregando controles de fecha de inicio/corte y selector desplegable de reasignación de cuenta/perfil.
- [x] 4.3 Implementar la reasignación de perfil garantizando la liberación del perfil anterior y actualización de la suscripción.

## 5. Verificación y Calidad de Código

- [x] 5.1 Ejecutar `npm run build` en el frontend y en el backend para validar que TypeScript compile sin errores.
- [x] 5.2 Probar manualmente la renovación acumulativa desde fecha previa, opciones +30/+60/+90 días y la edición/reasignación completa de ventas.
