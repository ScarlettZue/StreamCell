## ADDED Requirements

### Requirement: Límite Estricto de Perfiles por Plataforma en Registro de Cuentas
The system MUST enforce `selectedProduct.profilesCount` as the maximum allowed number of profiles when registering or configuring a streaming account in "Venta por Perfiles Individuales" mode (`AccountsPage.tsx`), disabling and blocking the "+ Añadir Perfil" button when `profiles.length >= selectedProduct.profilesCount`, and automatically trimming/adjusting profile fields when switching platforms.

#### Scenario: Bloqueo de botón de añadir perfil al alcanzar el máximo permitido
- **WHEN** el usuario configura los perfiles de un servicio en la modal de registro y la cantidad de perfiles alcanza el límite `profilesCount` de la plataforma elegida (ej. 1 perfil para "Primevideo Pantalla")
- **THEN** el sistema deshabilita el botón "+ Añadir Perfil", cambia su texto a "Máximo alcanzado (X)" e impide agregar más perfiles al formulario

#### Scenario: Ajuste dinámico de perfiles al cambiar de plataforma en el formulario
- **WHEN** el usuario cambia la plataforma seleccionada en el menú desplegable por una plataforma con menor o igual límite de perfiles (ej. de 5 perfiles a 1 perfil)
- **THEN** el sistema ajusta automáticamente la lista de perfiles en el formulario al número de perfiles permitido por la nueva plataforma seleccionada
