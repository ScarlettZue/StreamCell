## Context

Ver `proposal.md` para la motivación. Actualmente en `DashboardPage.tsx`, al completar la mutación `createSaleMutation`, el hook `onSuccess` simplemente cierra el modal de Venta Rápida. A diferencia de `SalesPage.tsx`, no extrae la respuesta con la venta recién creada ni muestra el modal pos-venta con el mensaje de WhatsApp.

## Goals / Non-Goals

**Goals:**
- Extender el estado de `DashboardPage.tsx` con `saleSuccessModalOpen`, `saleWspPhone`, `editedSaleMessage` y `copiedSaleSuccess`.
- Importar `formatSaleAssignmentWhatsAppMessage` desde `../utils/formatters` y el ícono `MessageSquare` de `lucide-react`.
- Al culminar la creación exitosa de la venta en `createSaleMutation.onSuccess(createdSale)`, extraer los datos de la asignación y generar el mensaje de WhatsApp.
- Renderizar el modal Pos-Venta de confirmación WhatsApp en `DashboardPage.tsx` mediante `createPortal(..., document.body)` asegurando `z-[9999]`.

**Non-Goals:**
- Alterar el endpoint del backend o la lógica de `saleService.createSale`.
- Modificar el flujo de venta rápida en `SalesPage.tsx`.

## Decisions

- **Reutilización del patrón visual de `SalesPage.tsx`**: Mantener exactamente el mismo diseño, clases de Tailwind, botón de copiar texto y botón de abrir chat en `wa.me` con el número del cliente de 10 dígitos (añadiendo prefijo `57` automáticamente).
- **Manejo de Portals (`createPortal`)**: Utilizar `createPortal` hacia `document.body` para garantizar que el modal aparezca superpuesto en dispositivos móviles sin quedar recortado por contenedores con `overflow-hidden` o trampas de z-index.

## Risks / Trade-offs

- [Información incompleta del cliente/servicio en la respuesta de la mutación] → `saleService.createSale` ya retorna el objeto `sale` con las relaciones `client` y `details.profile.account.product`. Se aplican fallbacks seguros igual que en `SalesPage.tsx`.
