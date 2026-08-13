## 1. Validación y Restricción de Perfiles (Frontend)

- [x] 1.1 Modificar `handleAddProfileField` en `AccountsPage.tsx` para validar que `profiles.length` no supere `selectedProduct.profilesCount`.
- [x] 1.2 Actualizar el botón `+ Añadir Perfil` en `AccountsPage.tsx` para deshabilitarlo y mostrar "Máximo alcanzado (X)" cuando se llegue al límite de la plataforma seleccionada.
- [x] 1.3 Asegurar que al cambiar de plataforma en el dropdown `productId`, se recorte/ajuste la lista de perfiles si excede la cantidad máxima de la nueva plataforma.

## 2. Verificación y Validación

- [x] 2.1 Ejecutar `npm run build` en la carpeta `frontend` para verificar que la compilación de TypeScript finalice sin errores.
- [x] 2.2 Validar en la interfaz que una plataforma con límite de 1 perfil bloquee la adición de más perfiles.
