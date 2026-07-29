# Changelog

Todas las modificaciones notables a este proyecto serán documentadas en este archivo.
El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Añadido
- **Implementación Completa de la API Backend de Streamcell:**
  - `ClientController`: Registro de clientes con `clientKey` automática, normalización de celular (+57), filtrado por nombre/teléfono y registro/cobro de saldos deudores (`/api/v1/clients`).
  - `ProductController`: Gestión del catálogo de productos y categorías con tipos `MULTI_PROFILE`, `FULL_ACCOUNT` e `PERSONAL_INVITATION` (`/api/v1/products`).
  - `AccountController`: Registro de cuentas madre con cifrado AES-256 de contraseñas y PINs. Soporta invitaciones de Canva Pro (correo) y Spotify (username + dirección de grupo familyAddress). Venta e inicialización de perfiles en la carga de la cuenta (`/api/v1/accounts`).
  - `SubscriptionController`: Renovación de servicios (+30 días modificables) y retiros de perfil con o sin saldo deudor (`/api/v1/subscriptions`).
  - `SaleController`: Registro de ventas con costos y precios dinámicos por transacción y reporte de ganancias netas (`/api/v1/sales`).
  - `WhatsAppController`: Generación de mensajes predeterminados con saludo dinámico según la hora colombiana (`/api/v1/whatsapp`).
- Creación y sincronización de la rama Git `develop` en GitHub.
