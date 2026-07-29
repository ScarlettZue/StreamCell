# Changelog

Todas las modificaciones notables a este proyecto serán documentadas en este archivo.
El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Añadido
- **Revisión e Inspección del Archivo Excel Base (`Plataformas Streaming, archivo base.xlsm`):**
  - Mapeo completo de las pestañas `Registro`, `Ventas`, `Gastos`, `Netflix`, `Spotify`, `Listado Precios` y `Productos` hacia la arquitectura y modelo de datos relacional de Streamcell.
- **Normalización de Zona Horaria a Colombia (`America/Bogota` - UTC-5):**
  - Configuración estricta de la capa de dominio backend para calcular horas de saludo en WhatsApp ("Buenos días", "Buenas tardes", "Buenas noches"), conteo de días para alertas de corte y fechas de transacciones en hora colombiana (COT).
  - Documentación de ADR-007 (Zona Horaria Colombia) y ADR-008 (Mapeo de Dominio desde el Excel Base) en `docs/decisiones.md`.
- Actualización de toda la suite de documentación en `docs/`, `PROJECT.md`, `TASKS.md` y `CHANGELOG.md`.
