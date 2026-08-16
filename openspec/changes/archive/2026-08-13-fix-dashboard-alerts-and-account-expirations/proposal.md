## Why

Existe una discrepancia en el Dashboard en el cálculo de días de atraso/vencimiento para las Alertas de Corte. Mientras que en la página de Alertas de Corte una fecha del 13 de agosto muestra "Vence hoy" y el 14 de agosto muestra "Vence en 1 día", en el Dashboard se estaba calculando de manera invertida o desfasada (ej: mostrando "Vencido hace 1 día" para el 14 de agosto).

Además, las alertas de corte actualmente mezclan o sólo muestran suscripciones de usuarios finales. Los administradores necesitan separar las alertas de corte en dos categorías distintas:
1. **Cortes de Suscripción de Usuario**: Vencimientos de perfiles asignados a clientes.
2. **Cortes de Cuenta Madre**: Vencimientos globales de la cuenta madre comprada al proveedor (`Account.dueDate`), con opciones para renovar la cuenta madre o gestionarla.

## What Changes

- **Unificación de Cálculo de Fechas de Vencimiento en el Dashboard**:
  - Ajustar `DashboardPage.tsx` para usar la misma lógica normalizada de zona horaria de Colombia (`America/Bogota`) y `getDaysRemaining` que `ExpirationsPage.tsx`, garantizando que la fecha actual (`13/08/2026`) se muestre idéntica en ambos paneles.
- **División de Alertas de Corte en Dos Categorías (Usuarios vs Cuentas Madre)**:
  - En `ExpirationsPage.tsx` (y accesos en Dashboard), incorporar un selector/pestañas de navegación para alternar entre:
    1. **Suscripciones de Usuarios (Clientes)**
    2. **Cuentas Madre (Proveedores)**
  - Para las **Cuentas Madre próximas a vencer o vencidas**:
    - Visualizar producto, correo de la cuenta, fecha de corte global de la cuenta madre y días restantes.
    - Acción rápida **Renovar Cuenta Madre (+30 días)** que actualiza la fecha de vencimiento (`dueDate`) de la cuenta.
    - Acción para **Notificar proveedor / Gestionar corte**.

## Capabilities

### New Capabilities

- `dashboard-and-account-expirations-management`: Unificación del cálculo de fechas de vencimiento en el Dashboard y división de las Alertas de Corte entre Suscripciones de Usuarios y Cuentas Madre con acciones de renovación global.

### Modified Capabilities

(Ninguna)

## Impact

- **Frontend**:
  - `DashboardPage.tsx`: Corrección de lógica de cálculo de días restantes y tarjeta de cortes pendientes.
  - `ExpirationsPage.tsx`: Tabs de navegación entre "Cortes de Usuarios" y "Cortes de Cuentas Madre", tabla de vencimiento de cuentas madre y modal de renovación de cuenta madre.
  - `accountService.ts`: Método de renovación de cuenta madre.
- **Backend**:
  - `accountController.ts`: Endpoint/servicio para renovar fecha de corte de cuenta madre.
