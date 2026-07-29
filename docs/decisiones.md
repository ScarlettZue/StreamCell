# Registro de Decisiones de Arquitectura (ADR) - Streamcell

---

## ADR-001: Modelo Granular de Perfiles vs Licencias Únicas
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Implementar `Account` (cuenta madre) y `AccountProfile` (sub-perfiles con PIN).

---

## ADR-002: Flexibilidad Dinámica de Precios por Transacción
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Guardar `unitCost` y `unitPrice` por cada venta/renovación individual.

---

## ADR-003: Simplificación de Datos de Cliente en Primera Fase
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Requerir únicamente **Nombre** y **Número de Celular**, generando `clientKey`.

---

## ADR-004: Gestión de Retiros con/sin Registro de Deuda
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Proveer 2 modos de retiro (`CANCELLED_NO_DEBT` y `CANCELLED_WITH_DEBT`). El modo con deuda acumula un saldo deudor en la ficha del cliente con monto modificable.

---

## ADR-005: Mensajería Inteligente WhatsApp con Saludos por Horario
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Crear un motor de plantillas dinámicas que calcula la franja horaria ("días", "tardes", "noches") y despliega un modal con texto editable antes de redirigir a `wa.me`.

---

## ADR-006: Tipos de Producto Flexibles (Multiperfil vs Cuenta Completa vs Invitación)
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Decisión:** Implementar la estrategia `ProductType` con atributos opcionales (`userEmail`, `spotifyUsername`, `familyAddress`).

---

## ADR-007: Normalización de Zona Horaria a Colombia (`America/Bogota` - UTC-5)
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Contexto:** El negocio opera en Colombia. El cálculo de saludos de WhatsApp (buenos días/tardes/noches), el conteo de días para alertas de corte y el cierre diario de ventas y gastos deben alinearse a la hora local colombiana.
- **Decisión:** La base de datos guardará fechas en UTC estándar (ISO-8601), pero toda la lógica de dominio backend (formato de mensajes, agrupamiento de fechas, vencimientos) y la interfaz frontend utilizarán la zona horaria **`America/Bogota` (UTC-5)** de forma estricta.

---

## ADR-008: Mapeo de Dominio desde el Excel Existente (`Plataformas Streaming, archivo base.xlsm`)
- **Fecha:** 2026-07-29 | **Estatus:** Aprobado
- **Contexto:** Se analizó el archivo base en Excel usado actualmente por la empresa con las pestañas `Registro`, `Ventas`, `Gastos`, `Netflix`, `Spotify`, `Listado Precios` y `Productos`.
- **Decisión:** Mapear directamente las columnas de la hoja `Registro` y `Listado Precios` a los modelos `Client`, `Product`, `Account`, `AccountProfile`, `Sale`, `Expense`, permitiendo en el futuro un script de importación inicial de datos sin pérdidas de información.
