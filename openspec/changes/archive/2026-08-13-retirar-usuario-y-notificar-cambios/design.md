## Context

Actualmente en `ExpirationsPage.tsx` el modal `Retirar Servicio de Perfil` contenía una casilla de verificación (`checkbox`) para activar o desactivar el registro de deuda. El cliente solicita simplificar este formulario eliminando la casilla de verificación y dejando únicamente el campo numérico del monto de deuda; si el monto ingresado es `0`, el sistema interpreta que no hubo deuda (`withDebt: false`), y si es mayor a `0`, registra automáticamente la deuda (`withDebt: true`).

## Goals / Non-Goals

**Goals:**
- **Simplificación del Formulario de Retiro:**
  - Eliminar el checkbox de confirmación de deuda del modal `Retirar Servicio de Perfil`.
  - Presentar directamente los campos `MONTO DE DEUDA ($)` (por defecto `0`) y `MOTIVO DEL RETIRO` (por defecto `"Atraso de días en pago de mensualidad"`).
  - Evaluar dinámicamente `withDebt = debtAmount > 0` antes de enviar la mutación de revocación.
- **Flujo Guiado Completo:**
  - Retiro con o sin deuda -> Preguntar si desea editar la cuenta madre -> Edición de cuenta -> Notificación WhatsApp a usuarios activos.

**Non-Goals:**
- Casillas redundantes de activación de deuda.

## Decisions

1. **Evaluación Implícita del Saldo Deudor:**
   - Al enviar el formulario de retiro (`revokeMutation`), enviar `withDebt: debtAmount > 0`.
   - Si `debtAmount === 0`, el backend recibe `withDebt: false` y `debtAmount: 0`.

2. **Diseño Visual Limpio y Directo:**
   - Eliminar el componente `<input type="checkbox">`.
   - Mostrar directamente el campo `MONTO DE DEUDA ($)` estilizado en la interfaz.

## Risks / Trade-offs

- Ninguno. La lógica es más intuitiva y directa para el usuario.
