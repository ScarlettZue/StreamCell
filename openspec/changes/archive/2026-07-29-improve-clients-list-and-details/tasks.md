## 1. Ajustes en Backend API

- [x] 1.1 Optimizar el endpoint GET `/api/clients/:id` para incluir el historial completo de suscripciones con servicios, perfiles, PINs y ventas asociadas

## 2. Rediseño de la Vista Principal de Clientes

- [x] 2.1 Actualizar la tabla en `ClientsPage.tsx` eliminando la columna visual del ID `CLI-XXXX` y desacoplando el modelado de deudas de la vista principal
- [x] 2.2 Mantener la tabla centrada en Nombre (con avatar de iniciales), Celular (10 dígitos), Fecha de Registro (`DD/MM/AAAA`) y Acciones (Ver Detalle, Editar, Eliminar)
- [x] 2.3 Ajustar la barra de búsqueda en tiempo real para filtrar por Nombre y Celular/Teléfono

## 3. Implementación del Modal de Detalle del Cliente

- [x] 3.1 Crear el componente `ClientDetailsModal.tsx` renderizado vía `createPortal(..., document.body)` con la clase `z-[9999]`
- [x] 3.2 Implementar encabezado del modal con avatar, nombre, teléfono de 10 dígitos y acceso directo a chat de WhatsApp (`wa.me/57...`)
- [x] 3.3 Construir la sección de métricas clave (Total suscripciones adquiridas, servicios activos actualmente y fecha de registro)
- [x] 3.4 Construir el listado/historial detallado de cuentas de streaming adquiridas (plataforma, usuario/email de la cuenta, perfil asignado, PIN, fechas `DD/MM/AAAA` y estado)

## 4. Verificación y Control de Calidad

- [x] 4.1 Ejecutar compilación TypeScript y build en frontend y backend (`npm run build`)
- [x] 4.2 Confirmar commits locales en la rama `develop`
