## Context

En `ExpirationsPage.tsx`, al hacer clic en el botón de renovar (+30 días), la asignación del costo inicial utilizaba `sub.profile?.account?.product?.defaultCost` sin dividir entre la cantidad de perfiles de la cuenta (`profilesCount`). Esto provocaba que cuentas multi-perfil (ej: Netflix de 5 perfiles a $44.900) mostraran $44.900 como costo real de 1 solo perfil en lugar de $8.980.

## Goals / Non-Goals

**Goals:**
- Ajustar la precarga del costo real en `ExpirationsPage.tsx`:
  `const totalProfiles = sub.profile?.account?.product?.profilesCount || 1;`
  `const unitCost = Math.round(Number(sub.profile?.account?.product?.defaultCost || 0) / totalProfiles);`
  `setSaleCost(unitCost);`
- Mantener la precarga del precio cobrado por defecto (`defaultPrice`).

## Decisions

- **Decisión**: Reutilizar exactamente la fórmula de costo unitario aplicada en `SalesPage.tsx` (Venta Rápida) para mantener coherencia en todo el sistema.
