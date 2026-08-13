## Context

En `AccountsPage.tsx`, la función `handleAddProfileField` agregaba perfiles a la lista local sin validar la propiedad `profilesCount` del producto/plataforma seleccionado. Además, el botón `+ Añadir Perfil` permanecía activo independientemente de la cantidad actual de perfiles.

## Goals / Non-Goals

**Goals:**
- Validar `profiles.length >= (selectedProduct?.profilesCount || 999)` en `handleAddProfileField` de `AccountsPage.tsx`.
- Deshabilitar el botón `+ Añadir Perfil` cuando se alcanza el límite y mostrar el mensaje `"Máximo alcanzado (${maxAllowed})"`.
- En el `useEffect` que reacciona a cambios en `productId` y `accountSaleMode`, recortar el arreglo de perfiles al límite máximo permitido por la plataforma seleccionada.

**Non-Goals:**
- Sin cambios en el backend ni en la base de datos.

## Decisions

- **Decisión 1**: En `handleAddProfileField`:
  ```ts
  const maxAllowed = selectedProduct?.profilesCount || 999;
  if (profiles.length >= maxAllowed) return;
  ```
- **Decisión 2**: En el renderizado del botón `+ Añadir Perfil`:
  ```tsx
  const maxAllowedProfiles = selectedProduct?.profilesCount || 999;
  const isMaxProfilesReached = profiles.length >= maxAllowedProfiles;
  ```
  Renderizar el botón con estado deshabilitado (`disabled={isMaxProfilesReached}`) y la clase visual correspondiente.

## Risks / Trade-offs

- Ninguno.
