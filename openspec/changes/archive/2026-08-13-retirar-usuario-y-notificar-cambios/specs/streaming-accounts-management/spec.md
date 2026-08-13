## ADDED Requirements

### Requirement: Flujo Guiado de Retiro de Persona y Edición Opcional de Cuenta Madre
The system MUST provide a multi-step guided confirmation flow when withdrawing a customer/subscription from a profile. The flow MUST prompt the user for:
1. Withdrawal confirmation with direct input for debt amount (`debtAmount`) defaulting to 0 and withdrawal reason. A value of `0` in `debtAmount` MUST automatically indicate no debt (`withDebt: false`), while any value greater than `0` MUST indicate debt registration (`withDebt: true`). The checkbox toggle MUST be omitted.
2. Option to edit parent/mother account details (email, password, profile names, PINs, max profiles).
Upon final confirmation of withdrawal and account updates, ONLY the subscription of the withdrawn user MUST be cancelled, and their assigned profile MUST immediately become available. Active subscriptions of all other users on that account MUST remain untouched and active.

#### Scenario: Retiro de persona con monto de deuda cero (sin deuda)
- **WHEN** el usuario confirma el retiro de un servicio e ingresa `0` en el campo de monto de deuda
- **THEN** el sistema procesa el retiro sin registrar saldo deudor al cliente (`withDebt: false`), libera el perfil asignado y procede al paso de pregunta para editar la cuenta madre.

#### Scenario: Retiro de persona con monto de deuda mayor a cero
- **WHEN** el usuario confirma el retiro de un servicio e ingresa un valor superior a `0` (ej: `$ 15.000`) en el monto de deuda
- **THEN** el sistema registra automáticamente la deuda al cliente (`withDebt: true`), libera el perfil asignado y procede al paso de pregunta para editar la cuenta madre.

#### Scenario: Preservación de suscripciones activas al editar la cuenta madre
- **WHEN** el usuario edita datos de la cuenta madre (correo, contraseña, notas, nombres de perfil o PINs)
- **THEN** el sistema guarda las credenciales y perfiles sin cancelar ni alterar el estado `ACTIVE` de las suscripciones de los demás usuarios que ocupan perfiles en dicha cuenta madre.
