# Streamcell - Plataforma Administrativa de Productos Digitales

## Objetivo
Reemplazar las hojas de cálculo en Excel (`Plataformas Streaming, archivo base.xlsm`) de **Streamcell** mediante una plataforma web administrativa optimizada para gestionar la venta de productos digitales y cuentas de streaming (Netflix, Prime Video, HBO, Disney+, Spotify, ChatGPT, Crunchyroll, Vix, MagisTV, etc.).

La plataforma controla clientes, inventario por perfiles con PIN, cuentas completas, invitaciones personales (con correo y dirección de grupo familiar), fechas de corte en hora de Colombia (`America/Bogota`), deudas por atrasos, recordatorios inteligentes por WhatsApp y ganancias netas.

## Usuarios
- **Fase 1 (Actual):** Administradora de Streamcell (gestión interna, registro de clientes, deudas, ventas y control de stock).
- **Fase 2 (Futuro):** Clientes finales (compras automáticas en línea).

## Alcance
- **Módulo Autenticación:** Acceso de Administradora con JWT.
- **Módulo CRM Clientes:** Nombre, Celular, ID único y **Saldo Deudor** (modelado desde las hojas `Registro` y `Ventas` del Excel).
- **Módulo Cuentas y Productos Multi-tipo:**
  - Multiperfil (Perfiles independientes con PIN: 1 pantalla, 2 pantallas, 3 pantallas).
  - Cuenta Completa (PrimeVideoCompleta, HBOCompleta, NetflixCompleta).
  - Invitaciones Personales (Canva Pro con correo de usuario, Spotify Familiar con username y dirección de grupo ej. *"Cra. 12b #56-30"*).
- **Módulo Retiros & Deudas:** Opción de renovar, retirar sin deuda o retirar registrando saldo deudor en la ficha del cliente por días de atraso.
- **Módulo Recordatorios por WhatsApp:** Plantilla inteligente con saludo según la hora de Colombia (`America/Bogota`: *"buenos días/tardes/noches"*), texto precargado editable y redirección a WhatsApp en 1 clic.
- **Módulo Ventas con Precios Dinámicos:** Costo y precio modificables en tiempo real por cada transacción (basado en la hoja `Listado Precios`).

## MVP (v0.1)
1. Autenticación de Administradora.
2. CRM de Clientes con control de deudas.
3. Carga de Productos Multi-tipo (Perfiles con PIN, Cuentas Completas e Invitaciones como Canva/Spotify con dirección/correo).
4. Normalización estricta de fechas a la hora de Colombia (`America/Bogota` - UTC-5).
5. Retiro de servicios con/sin deuda acumulada.
6. Mensajería WhatsApp con saludo horario y texto editable.
7. Registro de Ventas con Precios Dinámicos.