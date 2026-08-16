## Purpose

Garantiza una interfaz táctil totalmente responsiva en teléfonos móviles para la pestaña de Cuentas Madre en Alertas de Corte, ajustando la presentación visual en tarjetas táctiles y evitando desbordamientos de botones de acción.

## ADDED Requirements

### Requirement: Vista Responsiva Táctil para Cuentas Madre en Alertas de Corte
En resoluciones móviles (`< 640px`), la pestaña de "Cortes de Cuentas Madre" MUST reemplazar la tabla de escritorio por tarjetas individuales táctiles (`sm:hidden`) que muestren claramente la información y el botón de acción "Renovar (+30 Días)" a ancho completo.

#### Scenario: Visualización de Cuentas Madre en teléfono celular
- **WHEN** un usuario accede a la pestaña "Cortes de Cuentas Madre" desde un teléfono celular (`< 640px`)
- **THEN** el sistema MUST renderizar tarjetas táctiles individuales mostrando plataforma, correo, número de perfiles vendidos/totales, insignia de estado y botón de renovación a ancho completo sin recorte lateral.

### Requirement: Adaptabilidad Responsiva en Pestañas y Buscadores
La barra superior de pestañas y el campo de búsqueda en la página de Alertas de Corte MUST ajustarse automáticamente en teléfonos móviles amoldándose a la pantalla mediante flexbox adaptable.

#### Scenario: Ajuste de pestañas en pantalla angosta
- **WHEN** la pantalla del dispositivo es inferior a 640px de ancho
- **THEN** los botones de pestaña y la barra de búsqueda MUST distribuirse vertical u horizontalmente sin sobresalir de los márgenes del contenedor.
