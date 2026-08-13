## 1. Formateo y Helpers de WhatsApp

- [x] 1.1 Crear/actualizar helper `buildAccountChangeWhatsAppMessage` en `frontend/src/utils/whatsapp.ts` para estructurar el mensaje con servicio, producto, correo, contraseña, perfil, PIN, advertencias de seguridad y fecha en formato latino `DD mes de AAAA`.

## 2. Componente de Notificación Rápida por WhatsApp

- [x] 2.1 Crear `AccountNotificationModal.tsx` usando React Portal (`z-[9999]`) que consulte los perfiles activos de una cuenta madre y genere botones de 1-clic a `https://wa.me/57<telefono>?text=...`.

## 3. Flujo Guiado de Retiro de Servicio y Simplificación de Deuda

- [x] 3.1 Actualizar el modal de retiro en `ExpirationsPage.tsx` para implementar la secuencia: Confirmación + Registro de Deuda -> Pregunta sobre edición de Cuenta Madre -> Edición de Cuenta -> Notificación WhatsApp.
- [x] 3.2 Asegurar la liberación inmediata del perfil asignado a la persona retirada al confirmar.
- [x] 3.3 Eliminar el checkbox de deuda en `ExpirationsPage.tsx` y calcular `withDebt = debtAmount > 0` directamente desde el monto de deuda ingresado.

## 4. Integración en Gestión General de Cuentas y Corrección Backend

- [x] 4.1 Corregir `AccountController.updateAccount` en el Backend para evitar que la edición de datos de una cuenta o perfil cancele involuntariamente suscripciones de otros usuarios activos.
- [x] 4.2 Asegurar que `AccountEditModal.tsx` y `AccountsPage.tsx` envíen el flag de ocupación `isSold` correcto al actualizar perfiles.
- [x] 4.3 Reestablecer las suscripciones activas afectadas en la base de datos si alguna fue cancelada involuntariamente por la actualización previa.

## 5. Verificación y Compilación

- [x] 5.1 Ejecutar compilación de TypeScript en Frontend (`npm run build` en `frontend`).
- [x] 5.2 Ejecutar compilación de TypeScript en Backend (`npm run build` en `backend`).
