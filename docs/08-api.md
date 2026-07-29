# 08 - Especificación de API REST: Streamcell

Todas las peticiones a la API REST de Streamcell utilizan el prefijo `/api/v1`.

---

## Endpoints Nuevos y Actualizados

### 1. Mensajería WhatsApp (`/api/v1/whatsapp`)
- `POST /generate-message` -> Genera el mensaje dinámico con saludo por hora actual:
  - **Body:** `{ "clientId": "uuid", "subscriptionId": "uuid" }`
  - **Respuesta:**
    ```json
    {
      "success": true,
      "data": {
        "greeting": "Buenas tardes",
        "clientName": "Ana María",
        "phone": "573001234567",
        "productName": "Netflix 4K Perfil 2",
        "dueDate": "2026-07-29",
        "generatedMessage": "Hola buenas tardes, el día 29-07-2026 terminó el mes de Netflix 4K Perfil 2, ¿deseas renovar el servicio?",
        "whatsappUrl": "https://wa.me/573001234567?text=..."
      }
    }
    ```

### 2. Retiros y Deudas (`/api/v1/subscriptions`)
- `POST /:id/revoke` -> Revocar/retirar servicio de perfil:
  - **Body:**
    ```json
    {
      "withDebt": true,
      "debtAmount": 15.00,
      "reason": "Atraso de 4 días en pago de mensualidad"
    }
    ```
- `POST /clients/:clientId/pay-debt` -> Registrar pago de deuda del cliente:
  - **Body:** `{ "amountPaid": 15.00 }`

### 3. Cuentas y Productos Multi-tipo (`/api/v1/accounts`)
- `POST /` -> Soporta tipos `MULTI_PROFILE`, `FULL_ACCOUNT`, `PERSONAL_INVITATION`:
  ```json
  {
    "productId": "uuid",
    "type": "PERSONAL_INVITATION",
    "email": "spotify.madre@streamcell.com",
    "dueDate": "2026-08-28T00:00:00Z",
    "profiles": [
      {
        "profileName": "Cupo Spotify 1",
        "userEmail": "cliente@gmail.com",
        "spotifyUsername": "cliente_sp",
        "familyAddress": "Cra 23 67-09",
        "clientId": "uuid-cliente"
      }
    ]
  }
  ```
