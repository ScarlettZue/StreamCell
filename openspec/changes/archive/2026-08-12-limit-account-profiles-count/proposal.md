## Why

Al registrar un nuevo servicio o cuenta madre desde la interfaz de administración, la adición de perfiles permitía presionar el botón "+ Añadir Perfil" indefinidamente y generar más perfiles de los especificados en el límite máximo de la plataforma/producto (`profilesCount`). Por ejemplo, en plataformas configuradas para 1 sola pantalla o perfil, el formulario permitía agregar 6 o más perfiles sin ningún bloqueo.

## What Changes

- **Límite Estricto de Perfiles por Plataforma**:
  - Restringir la generación y adición de perfiles en el formulario de creación de servicios (`AccountsPage.tsx`) para que coincida exactamente con la cantidad máxima declarada en la plataforma seleccionada (`selectedProduct.profilesCount`).
- **Bloqueo del Botón "+ Añadir Perfil"**:
  - Deshabilitar y bloquear visualmente el botón `+ Añadir Perfil` cuando el número de perfiles configurados alcance el límite máximo permitido de la plataforma (`profiles.length >= selectedProduct.profilesCount`), mostrando el estado "Máximo alcanzado".
- **Ajuste Dinámico al Cambiar Plataforma**:
  - Al cambiar la selección de plataforma en el dropdown, recortar o ajustar automáticamente los perfiles al límite máximo permitido por la nueva plataforma elegida.

## Capabilities

### New Capabilities
<!-- None -->

### Modified Capabilities
- `streaming-accounts-management`: Restricción estricta de la cantidad máxima de perfiles configurables al registrar un servicio según los límites de la plataforma.

## Impact

- **Frontend**: Componente `AccountsPage.tsx` (formulario de registro de servicios).
- **Backend/DB**: Sin cambios en el esquema de base de datos ni endpoints.
