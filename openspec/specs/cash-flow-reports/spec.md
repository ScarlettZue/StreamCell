# cash-flow-reports Specification

## Purpose
Proporciona reportes financieros detallados de flujo de caja, acumulados mensuales, métricas del día actual y análisis comparativo mes a mes para la toma de decisiones comerciales.
## Requirements
### Requirement: Panel de Flujo de Caja y Métricas Financieras
The system MUST provide a dedicated "Flujo de Caja" view accessible from the main navigation menu (`CashFlowPage.tsx`). The panel MUST calculate and display Total Gross Income, Net Profit, and Total Completed Transactions for the current month and for today.

#### Scenario: Visualización del reporte de flujo de caja del mes actual
- **WHEN** el usuario navega a la sección "Flujo de Caja"
- **THEN** el sistema calcula y presenta las tarjetas de métricas financieras del mes actual (Ingresos Brutos, Ganancia Neta Total, Transacciones Totales) en moneda `$ COP` y hora de Colombia (`America/Bogota`).

#### Scenario: Filtro y métrica de ventas del día actual
- **WHEN** el usuario selecciona el periodo "Hoy" o consulta las métricas del día
- **THEN** el sistema calcula únicamente las ventas registradas en la fecha presente y actualiza las métricas correspondientes.

### Requirement: Métricas Comparativas Mes a Mes
The system MUST calculate monthly performance metrics comparing the current month against previous months, displaying growth or change percentages.

#### Scenario: Consulta de comparativa mensual
- **WHEN** el usuario visualiza la sección de análisis comparativo en el panel de flujo de caja
- **THEN** el sistema muestra la tendencia mensual de ingresos y utilidades comparada contra meses anteriores.

