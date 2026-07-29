# 06 - Flujos de Negocio de Streamcell

---

## Flujo 1: Notificación de Vencimiento por WhatsApp

```mermaid
graph TD
    A[Inicio: Dashboard de Alertas] --> B[Obtener Hora del Sistema]
    B --> C{¿Hora?}
    C -- 05:00 a 11:59 --> D["Saludo: 'Buenos días'"]
    C -- 12:00 a 18:59 --> E["Saludo: 'Buenas tardes'"]
    C -- 19:00 a 04:59 --> F["Saludo: 'Buenas noches'"]
    D --> G[Generar Plantilla Mensaje Predeterminado]
    E --> G
    F --> G
    G --> H[Abrir Modal Edición de Mensaje]
    H --> I[Confirmar y Dar Clic en 'Enviar por WhatsApp']
    I --> J[Redireccionar a wa.me con mensaje codificado]
```

---

## Flujo 2: Retiro de Servicio Vencido o No Pagado

```mermaid
graph TD
    A[Perfil/Servicio Vencido] --> B{¿Acción de la Administradora?}
    B -- Renovar --> C[Actualizar Fecha Fin +30d y Registrar Venta]
    B -- Retirar Sin Deuda --> D[Cambiar Estado a CANCELLED_NO_DEBT e Inventario a DISPONIBLE]
    B -- Retirar Con Deuda --> E[Ingresar / Calcular Monto de Deuda por Días Mantenidos]
    E --> F[Registrar Deuda en Ficha del Cliente + Liberar Inventario a DISPONIBLE]
```

---

## Flujo 3: Registro de Productos Especiales (Canva Pro / Spotify Familiar)

1. **Selección del Producto:**
   - La administradora selecciona el tipo `PERSONAL_INVITATION`.
2. **Carga de Datos de Invitación:**
   - Si es **Canva Pro:** Ingresa el correo personal del cliente.
   - Si es **Spotify Familiar:** Ingresa el username/correo de la cuenta y la **Dirección del Grupo Familiar** (ej. "Cra 23 67-09").
3. **Guardado y Asignación:**
   - Se guarda el servicio asignado al cliente con sus fechas de corte e inicio correspondientes.
