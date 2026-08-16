## Context

En `frontend/src/pages/ExpirationsPage.tsx`, `frontend/src/pages/SalesPage.tsx` y en el backend (`subscription.service.ts`, `sale.service.ts`), se ajustará la plataforma para:
1. Extender fechas de corte acumulando días sobre la fecha de corte previa (`serviceEndDate`), no sobre `now`.
2. Ofrecer selecciones rápidas multimes (+30, +60, +90 días) con recálculo dinámico de precios en renovaciones.
3. Permitir la **edición flexible completa de ventas y suscripciones**, pudiendo modificar fechas de servicio (`serviceStartDate`, `serviceEndDate`), precios (`saleCost`, `salePrice`) y reasignar la suscripción a otro perfil o cuenta madre disponible.

## Goals / Non-Goals

**Goals:**
- Extender la fecha de corte sumando la duración a la fecha previa (`prevEndDate + days`), garantizando continuidad de ciclo.
- Proporcionar botones de período rápido (`+30 Días`, `+60 Días`, `+90 Días`) en `RenewModal`.
- Recalcular dinámicamente costo y precio cobrado (multiplicando base por `durationDays / 30`).
- Mostrar en tiempo real la **Nueva Fecha de Corte Calculada** antes de confirmar.
- Permitir editar libremente la fecha de inicio, fecha de fin, precios y reasignar perfil/cuenta en la edición de ventas.
- Mantener la apertura del modal pos-renovación para enviar WhatsApp con la duración y nueva fecha de corte en español.

**Non-Goals:**
- Permitir asignación de perfiles ocupados por otro cliente activo sin antes liberar o permutar.

## Decisions

### 1. Cálculo de Nueva Fecha de Corte en Backend y Frontend
Dada una fecha previa `prevDate`:
```typescript
export function addDaysToDate(dateInput: string | Date, days: number): Date {
  const baseDate = new Date(dateInput);
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate;
}
```
En el backend `/subscriptions/:id/renew`, si la solicitud no provee explícitamente `serviceEndDate`, se calcula como `subscription.serviceEndDate + days`. Si el frontend envía `serviceEndDate` y `serviceStartDate`, el backend los aplica de forma explícita.

### 2. Opciones de Período y Precios Dinámicos en Renovación
- Estado `durationDays` con valor inicial `30`.
- Al seleccionar `30`: `cost = baseCost * 1`, `price = basePrice * 1`.
- Al seleccionar `60`: `cost = baseCost * 2`, `price = basePrice * 2`.
- Al seleccionar `90`: `cost = baseCost * 3`, `price = basePrice * 3`.
- `newCalculatedEndDate = addDaysToDate(selectedSub.serviceEndDate, durationDays)`.
- Previsualización en el modal: "Nueva Fecha de Corte: DD/MM/AAAA".

### 3. Edición Completa de Ventas y Reasignación de Cuentas (`SalesPage.tsx` / Backend)
- **Endpoint PUT `/sales/:id` / PUT `/subscriptions/:id`**:
  - Acepta opcionalmente `serviceStartDate`, `serviceEndDate`, `saleCost`, `salePrice`, `profileId`.
  - Si `profileId` cambia, desvincula la suscripción del perfil previo marcando la suscripción anterior como inactiva/transferida y asocia el nuevo perfil al cliente.
- **Interfaz `EditSaleModal`**:
  - Selector de fechas de inicio y fin (`input type="date"`).
  - Selector desplegable de cuenta madre / perfil para reasignar la suscripción.
  - Campos numéricos para costo real y precio cobrado.

### 4. Plantilla de Mensaje de Renovación por WhatsApp
Se pasa `durationDays` a `formatRenewalWhatsAppMessage` para que la cabecera genere p.ej. `NETFLIX 1 PANTALLA X60 DIAS` y la fecha de corte `Válido hasta 11 de septiembre de 2026`.

## Risks / Trade-offs

- **[Conflicto al reasignar un perfil que ya está ocupado]** → Mitigación: El selector de perfiles para reasignación filtrará perfiles con estado `AVAILABLE` o pertenecientes a la misma cuenta del servicio.
