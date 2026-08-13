# streaming-accounts-management Specification (Delta)

## ADDED Requirements

### Requirement: Cálculo Proporcional de Costo por Perfil en Ventas
The system MUST calculate the unit acquisition cost of an individual profile/screen proportionally as `motherAccountBaseCost / totalProfiles` when sold as a profile subscription, reserving the full `motherAccountBaseCost` only for complete account sales ("Venta Cuenta Completa"). Financial cash register records MUST reflect this proportional unit cost for profile sales.

#### Scenario: Registro de venta por pantalla individual
- **WHEN** se registra o reporta la venta de un perfil individual cuya cuenta madre tiene costo de adquisición `$ 44.900` y 5 perfiles en total
- **THEN** el sistema registra en caja como costo unitario de esa venta `$ 8.980` (`$ 44.900 / 5`), calculando la utilidad sobre dicho costo unitario

#### Scenario: Registro de venta de cuenta completa
- **WHEN** se registra o reporta la venta de una cuenta completa
- **THEN** el sistema asigna el costo total de adquisición de la cuenta madre (`$ 44.900`) como costo de la transacción

### Requirement: Permisividad de Valores Numéricos Libres en Formularios
The system MUST allow entering any numeric integer or decimal value (such as `$ 44.900`) in monetary cost and price inputs by using unrestricted step attributes (`step="any"` or `step="1"`), preventing browser step-validation errors.

#### Scenario: Ingreso de precio base sin restricciones de paso
- **WHEN** el usuario ingresa un valor como `44900` en el campo de costo base de adquisición de la cuenta madre
- **THEN** el formulario acepta y guarda el valor sin mostrar advertencias de validación de paso del navegador
