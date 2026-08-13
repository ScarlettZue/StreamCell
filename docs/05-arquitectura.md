# 05 - Especificación de Arquitectura: Streamcell

## 1. Visión Arquitectónica
Streamcell implementa **Clean Architecture** estructurada bajo **Domain-Driven Design (DDD)**. 

---

## 2. Manejo de Zona Horaria & Normalización de Fechas

```
[Base de Datos PostgreSQL]  <--- UTC ISO-8601 (Ej: 2026-07-29T17:00:00.000Z)
           ^
           | (Normalización de Dominio)
[Backend Domain Layer]      <--- America/Bogota (UTC-5)
           | 
           v
[WhatsApp Builder / UI]     <--- Muestra Fechas y Evalúa Horas en Hora Colombia (COT)
```

- **Almacenamiento:** PostgreSQL guarda todos los timestamps en UTC nativo.
- **Capa de Dominio Backend:** `DateTimeService` convierte los valores UTC a la zona horaria **`America/Bogota` (UTC-5)** antes de realizar cualquier cálculo (días restantes de corte, saludo dinámico de WhatsApp por hora, reportes de pérdidas y ganancias mensuales P&G).
- **Formatos de Despliegue:** Fechas formateadas como `DD/MM/YYYY` en hora de Colombia.

---

## 3. Componentes Clave de Dominio
1. **`WhatsAppMessageService` (Domain Service):**
   - Evalúa la hora actual en `America/Bogota` (`05:00-11:59` -> Buenos días, `12:00-18:59` -> Buenas tardes, `19:00-04:59` -> Buenas noches).
2. **`DebtManagementService` (Domain Service):**
   - Regla de negocio para liberar el perfil de un cliente evaluando el tipo de cancelación (`CANCELLED_NO_DEBT` vs `CANCELLED_WITH_DEBT`), calculando días en mora y registrando la deuda en la ficha del cliente.
3. **`ExcelImportAdapter` (Infrastructure Service):**
   - Adaptador para importar datos históricos desde el archivo `Plataformas Streaming, archivo base.xlsm` hacia las tablas de Prisma ORM.

---

## 4. Estructura Estándar y Escalable de Directorios

### 📌 Reglas de Organización
1. **Documentación (`/docs`):** Exclusiva para documentos de arquitectura, guías de diseño y requerimientos en Markdown. Prohibido almacenar binarios o imágenes de producción aquí.
2. **Assets de Marca (`/frontend/public/assets/logo/`):** Los logos de producción (`logo.png`, `logopublicidad.png`, `logowpp.png`) residen en `frontend/public/assets/logo/` para ser servidos estáticamente.

### 📁 Árbol de Directorios

```text
StreamCell/
├── docs/                      # Especificaciones y documentos Markdown (.md)
├── frontend/                  # Aplicación cliente React + TypeScript + Vite
│   ├── public/                # Archivos estáticos servidos públicamente
│   │   └── assets/logo/       # Logos e imágenes de marca oficiales
│   └── src/
│       ├── assets/            # Estilos globales y recursos empaquetados
│       ├── components/        # Componentes UI reutilizables (Modales, Tablas, UI)
│       ├── features/          # Módulos organizados por dominio funcional
│       ├── hooks/             # Custom React Hooks
│       ├── pages/             # Vistas principales de la aplicación (Rutas)
│       ├── services/          # Cliente de API HTTP (Axios / Fetch)
│       ├── types/             # Definiciones e interfaces TypeScript
│       └── utils/             # Funciones auxiliares (Formato COP y fechas latinas)
└── backend/                   # Servidor API Express + TypeScript + Prisma
    └── src/
        ├── config/            # Variables de entorno y conexión Prisma / Supabase
        ├── domain/            # Capa Dominio (Entidades puras e Interfaces de Repositorio)
        ├── application/      # Capa Aplicación (Casos de Uso y DTOs)
        ├── infrastructure/   # Capa Infraestructura (Base de datos Prisma y Servicios Externos)
        ├── presentation/     # Capa Presentación (Rutas, Controladores y Middlewares Express)
        └── utils/             # Logger y manejo centralizado de errores
```

