# 10 - Manual de Marca, Voz, Tono y Sistema de Diseño: Streamcell

Este documento establece la identidad verbal, visual y el sistema de diseño interactivo para la plataforma **Streamcell**.

---

## 🗣️ 1. Manual de Voz y Tono de la Marca

### 1.1 Personalidad de Marca
La personalidad de **Streamcell** es **hogareña, amigable y servicial**, pero manteniendo siempre la **formalidad, seguridad y profesionalismo** necesarios en la gestión de servicios digitales.

- **Hogareña & Cercana:** Trata al cliente con empatía, calidez y amabilidad, como a un vecino o amigo de confianza.
- **Servicial & Atenta:** Se anticipa a las dudas del cliente, facilita los pagos y brinda soluciones claras.
- **Formal & Segura:** Mantiene la precisión en números, fechas de vencimiento, entrega transparente de cuentas y respeto absoluto por la información.

### 1.2 Matriz de Tono por Canal de Comunicación

| Canal / Situación | Tono Empleado | Objetivo | Ejemplo de Mensaje |
| :--- | :--- | :--- | :--- |
| **Recordatorio WhatsApp (Cobro)** | Amigable, respetuoso y servicial | Notificar el vencimiento del mes de forma cálida sin sonar agresivo | *"Hola buenas tardes Ana, el día 29/07 terminó el mes de Netflix, ¿deseas renovar el servicio hoy para no perder tu perfil?"* |
| **Interfaz Web (Botones y Labels)** | Claro, directo y formal | Guiar a la administradora de forma rápida | *"Registrar Nueva Venta"*, *"Renovar (+30 días)"*, *"Retirar con Deuda"* |
| **Mensajes de Confirmación** | Cálido y eficiente | Dar tranquilidad tras realizar una compra o abono | *"¡Listo! Tu abono de $10.000 fue registrado con éxito. Tu saldo pendiente ha sido actualizado."* |
| **Alertas de Mora / Retiro** | Empático, comprensivo y formal | Gestionar la cartera vencida sin dañar la relación | *"Servicio suspendido temporalmente por fecha de corte. Escríbenos cuando desees reactivarlo."* |

### 1.3 Pautas de Redacción: "Cómo Sí vs Cómo No"

- ❌ **No decir:** *"Pague su deuda inmediatamente o perderá el perfil."*
- ✅ **Sí decir:** *"Hola [Cliente], tu servicio vence hoy. ¿Deseas renovarlo para seguir disfrutando de tus pantallas sin interrupción?"*
- ❌ **No decir:** *"Error grave en el sistema."*
- ✅ **Sí decir:** *"No pudimos completar la acción. Por favor verifica los datos e intenta nuevamente."*

---

## 🎨 2. Paleta de Colores (Basada en la Identidad Azul & Morado)

La identidad de Streamcell combina la **seguridad del Azul** con la **innovación y entretenimiento del Morado**, adaptada para modo oscuro (entorno principal de trabajo) y modo claro.

### 2.1 Modo Oscuro (Entorno Principal de la App)
Diseñado para reducir la fatiga visual durante jornadas prolongadas de gestión.

```
Fondo Principal:       #090D16 (Deep Slate Black)
Superficies & Cards:   #111827 (Dark Slate Glass 75%)
Bordes & Separadores:  #1F2937 / #374151
```

- 🔵 **Azul Primario (Seguridad & Confianza):** `#3B82F6` / Accent `#60A5FA`
- 🟣 **Morado Primario (Streaming & Entretenimiento):** `#8B5CF6` / Accent `#A78BFA`
- 🩵 **Cian Secundario (Resplandor & Detalles):** `#06B6D4`
- 🟢 **Verde Éxito / Al día:** `#10B981` (Emerald)
- 🟡 **Amarillo Advertencia / Próximo a vencer:** `#F59E0B` (Amber)
- 🔴 **Rojo Vencido / Deuda:** `#F43F5E` (Rose)

### 2.2 Modo Claro (Reportes e Impresión)

```
Fondo Principal:       #F8FAFC (Soft Slate White)
Superficies & Cards:   #FFFFFF (Pure White)
Bordes & Separadores:  #E2E8F0
Textos Principales:    #0F172A (Dark Charcoal)
```

- 🔵 **Azul Primario:** `#2563EB`
- 🟣 **Morado Primario:** `#7C3AED`
- 🟢 **Verde Éxito:** `#059669`
- 🔴 **Rojo Alerta:** `#E11D48`

---

## 🔤 3. Sistema Tipográfico y Escala de Tamaños

- **Familia Tipográfica Principal:** **Inter** (o **Outfit** en títulos destacados), disponible a través de Google Fonts.
- **Renderizado:** Anti-aliased, kerning optimizado para alta legibilidad en pantallas retina y estándar.

### Escala de Tamaños y Jerarquía UI

| Elemento UI | Clase Tailwind | Tamaño | Peso (Weight) | Caso de Uso |
| :--- | :--- | :--- | :--- | :--- |
| **H1 (Título de Pantalla)** | `text-2xl` / `text-3xl` | 24px - 30px | Extrabold (800) | Encabezados principales del Dashboard y Login |
| **H2 (Títulos de Sección)** | `text-xl` | 20px | Bold (700) | Nombres de módulos, títulos de modales |
| **H3 (Subtítulos & Cards)** | `text-lg` | 18px | Semibold (600) | Títulos de tarjetas de cuentas, productos |
| **Texto Base / Cuerpo** | `text-sm` | 14px | Regular (400) / Medium (500) | Textos de párrafos, opciones de tablas |
| **Texto Secundario / Fechas**| `text-xs` | 12px | Regular (400) / Medium (500) | Fechas de corte, nombres de clientes en tablas |
| **Labels & Etiquetas** | `text-xs uppercase` | 12px | Bold (700) / Semibold (600) | Encabezados de formularios e inputs |
| **Badges & Micro-tags** | `text-[10px] uppercase`| 10px | Bold (700) | Badges de estado (*DISPONIBLE*, *VENDIDO*, *AL DÍA*) |

---

## 🖼️ 4. Uso del Logo de la Empresa

Los archivos del logo oficial de **Streamcell** se ubican en la carpeta `docs/logo/`:
- `docs/logo/Gemini_Generated_Image_5crfd85crfd85crf.png`
- `docs/logo/Gemini_Generated_Image_fxn1rifxn1rifxn1.png`
- `docs/logo/Gemini_Generated_Image_ua2jn3ua2jn3ua2j.png`

### Aplicación del Logo en la Interfaz:
1. **Sidebar Principal:** Isotipo con resplandor morado/azul (`shadow-glow`) junto a la palabra **Streamcell** en degradado blanco a violeta.
2. **Pantalla de Login:** Isotipo central en contenedor curvado (`rounded-2xl`) con degradado tricolor (`from-brand-600 via-brand-500 to-brand-accent`).
