## Context

En dispositivos móviles y pantallas de escritorio, el toque doble o rápido sobre los botones de confirmación ("Guardar", "Confirmar", "Eliminar") genera múltiples llamadas concurrentes a la API porque el estado de envío no inhabilita el botón inmediatamente ni cierra la ventana modal con la celeridad requerida.

Asimismo, al realizar el retiro/corte de una suscripción, la pantalla no siempre aparecía inmediatamente como disponible en la interfaz debido a falta de invalidación explícita de `availableProfiles` en React Query.

Finalmente, tras realizar una venta rápida, se requiere dar la opción inmediata al usuario de notificar al cliente mediante WhatsApp con las credenciales de acceso al servicio asignado (correo, contraseña, perfil, PIN y fecha de vencimiento).

## Goals / Non-Goals

**Goals:**
- Auditar y asegurar que en TODOS los modales de la aplicación (`ClientsPage.tsx`, `SalesPage.tsx`, `AccountsPage.tsx`, `ExpirationsPage.tsx`, `ProductsPage.tsx` y componentes derivados):
  1. Los botones de submit tengan `disabled={mutation.isPending}`.
  2. Muestren un indicador de spinner (`Loader2 animate-spin`) mientras se procesa.
  3. Cierren automáticamente el modal en el callback `onSuccess` de la mutación.
  4. Ejecuten `resetForm()` para limpiar las variables de estado locales.
- Asegurar que al cortar/retirar un servicio, la suscripción se marque como cancelada y el perfil (`AccountProfile`) quede liberado como `AVAILABLE`, invalidando las consultas `accounts` y `availableProfiles` para reflejar instantáneamente la disponibilidad.
- Implementar la notificación pos-venta por WhatsApp al registrar una venta rápida con previsualización editable, botón "Enviar por WhatsApp" (`wa.me`) y "Copiar Texto".

**Non-Goals:**
- Deshabilitar el botón antes de que el formulario pase las validaciones de campos requeridos.

## Decisions

### 1. Manejo Estricto de Estado `isPending` y Cierre en `onSuccess`
Para cada mutación de React Query asociada a un modal (`createClientMutation`, `deleteClientMutation`, `createSaleMutation`, `deleteSaleMutation`, `deleteAccountMutation`, etc.):

```typescript
const createClientMutation = useMutation({
  mutationFn: (data) => clientService.createClient(data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    setIsModalOpen(false);
    resetForm();
  },
});
```

En la vista JSX del botón de confirmación:
```tsx
<button
  type="submit"
  disabled={createClientMutation.isPending}
  className="... disabled:opacity-50 disabled:cursor-not-allowed"
>
  {createClientMutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
  <span>Guardar Cliente</span>
</button>
```

### 2. Sincronización de Perfiles Disponibles en Retiros
En `ExpirationsPage.tsx` y `subscriptionController.ts`:
```typescript
const revokeMutation = useMutation({
  mutationFn: () => subscriptionService.revokeSubscription({ ... }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    queryClient.invalidateQueries({ queryKey: ['clients'] });
    queryClient.invalidateQueries({ queryKey: ['availableProfiles'] });
    setRevokeModalOpen(false);
  },
});
```

### 3. Notificación Pos-Venta de Asignación de Servicio
- Implementar `formatSaleAssignmentWhatsAppMessage` en `formatters.ts`.
- En `SalesPage.tsx`, al completarse `createSaleMutation`:
  - Extraer cliente, teléfono, email, contraseña, perfil y PIN de la venta creada.
  - Generar el texto y desplegar el modal pos-venta `SaleSuccessModal` con React Portals.

## Risks / Trade-offs

- **[Cierre de modal antes de que la respuesta sea recibida]** → Mitigación: El modal debe cerrarse únicamente en `onSuccess`, no en el evento `onSubmit` directo, para poder mostrar errores si la API falla. Sin embargo, el botón debe deshabilitarse INMEDIATAMENTE al hacer submit (`isPending === true`).
