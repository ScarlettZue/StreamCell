## ADDED Requirements

### Requirement: Métricas Esenciales y Botón de Venta Rápida en el Dashboard Móvil
The system MUST provide a mobile-optimized executive Dashboard containing:
1. Prominent quick-action button "+ Registrar Venta Rápida" to trigger immediate sale creation.
2. Metrics for Sales of the Day (today's count and today's gross revenue).
3. New Clients Metric with an interactive period filter (Day / Month / Year).
4. Pending Expirations / Revocations List widget showing accounts requiring cut-off.
5. Live Available Stock indicator for ready profiles.

#### Scenario: Acceso a la acción rápida de registrar venta desde el Dashboard
- **WHEN** el usuario presiona el botón "+ Registrar Venta Rápida" en el Dashboard
- **THEN** el sistema abre inmediatamente el modal de registro de Venta Rápida en pantalla sin requerir navegación adicional.

#### Scenario: Selección de periodo en la métrica de Clientes Nuevos
- **WHEN** el usuario alterna el filtro entre "Día", "Mes" o "Año" en la tarjeta de clientes nuevos
- **THEN** el sistema actualiza dinámicamente la cifra de nuevos clientes registrados durante dicho periodo.

#### Scenario: Visualización y navegación de Cortes Pendientes
- **WHEN** existen suscripciones vencidas pendientes de corte
- **THEN** el Dashboard lista las suscripciones prioritarias y permite navegar en 1-clic a la sección de Alertas de Corte.
