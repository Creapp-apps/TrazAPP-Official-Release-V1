# 🌿 TrazAPP — Bunker Console & Telemetría IoT Industrial

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.x-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Realtime_PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Google Gemini](https://img.shields.io/badge/AI_Engine-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![Three.js](https://img.shields.io/badge/3D_Engine-React_Three_Fiber-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![IoT Protocols](https://img.shields.io/badge/IoT-Tuya_Cloud_%26_WebSockets-FF6A00?style=for-the-badge&logo=tuya&logoColor=white)](https://developer.tuya.com/)

**Consola de monitoreo ambiental en tiempo real, trazabilidad integral de cultivos técnicos (Semillas, Esquejes, Salas de Floración) y control agronómico asistido por IA.**

[Explorar CreAPP Lab](https://creapp.com.ar) • [Reportar un Issue](https://github.com/Creapp-apps/TrazAPP-Official-Release-V1/issues)

</div>

---

## 🔬 Visión del Sistema

**TrazAPP** es una plataforma operativa de grado industrial y biotecnológico diseñada para el control agronómico de precisión, la trazabilidad genética de punta a punta y el monitoreo ambiental continuo en salas de cultivo técnico y clubes cannábicos regulados.

Combina telemetría de sensores IoT en streaming continuo con alertas de umbrales críticos y auditoría de inventario bajo normativas estrictas de control sanitario.

---

## ⚡ Capacidades Principales

### 📡 1. Consola Bunker & Telemetría IoT en Vivo
* **Streaming de Variables Críticas:** Monitoreo segundo a segundo de Temperatura, Humedad Relativa (RH), Déficit de Presión de Vapor (VPD), niveles de CO₂ y fotoperiodos.
* **Integración con Ecosistema Tuya IoT:** Sincronización cloud y local con sensores de suelo, termohigrómetros industriales y relés inteligentes para automatización de extractores y luces.
* **Gráficos Históricos y Análisis Predictivo:** Registro multivariable mediante `Chart.js` para detectar desviaciones climáticas antes de que afecten el rendimiento.

### 🧬 2. Trazabilidad Biológica de Punta a Punta
* **Gestión por Salas y Etapas:** Seguimiento segregado para Germinación, Esquejes/Clones, Madres, Vegetativo, Floración, Secado y Curado.
* **Etiquetado con Códigos QR:** Generación de identificadores únicos por lote (*Batch ID*) y planta para auditoría física y escaneo móvil rápido en sala.
* **Libro de Trazabilidad Regulatoria:** Registro inmutable de movimientos, descartes fitosanitarios y transferencias hacia el dispensario.

### 📦 3. Dispensario & Control de Insumos
* **Gestión de Stock en Tiempo Real:** Control de fertilizantes, sustratos y preventivos con alertas por punto de reorden.
* **Módulo de Dispensario y Entregas:** Registro de despachos autorizados a socios/pacientes con control de límites legales y cupos mensuales.

### 🤖 4. Asistente Agronómico Asistido por IA (Gemini & Deepgram)
* **Diagnóstico Inteligente de Cultivo:** Integración del modelo multimodal de Google Gemini para evaluación agronómica y análisis de anomalías climáticas.
* **Interacción por Voz:** Integración con `@deepgram/sdk` para comandos de audio manos libres durante el trabajo en salas de cultivo.
* **Visualización 3D Interactiva:** Módulo interactivo con `@react-three/fiber` para representación de componentes de hardware autónomo ("Growy").

---

## 🛠️ Stack Tecnológico

| Capa | Tecnologías | Propósito |
| :--- | :--- | :--- |
| **Frontend** | `React 18` + `TypeScript` + `React Router 6` | SPA modular y de respuesta inmediata. |
| **Estilos & UI** | `TailwindCSS` + `Radix UI` + `React-Hot-Toast` | Interfaz oscura *Bunker Console* optimizada para operadores. |
| **Visualización 3D**| `@react-three/fiber` + `Three.js` | Representación interactiva 3D de dispositivos y sensores. |
| **Telemetría & Charts**| `Chart.js` + `react-chartjs-2` | Curvas de VPD, temperatura y humedad en tiempo real. |
| **Backend & Base de Datos**| `Supabase` (PostgreSQL + RLS + Realtime) | Streaming de telemetría por WebSockets y seguridad de datos. |
| **IoT & Hardware**| `Tuya Cloud API Webhooks` + Tuya Protocol | Ingesta de telemetría de sensores y control de actuadores. |
| **IA & Audio** | `@google/generative-ai` + `@deepgram/sdk` | Recomendaciones agronómicas y comandos de voz. |
| **Notificaciones** | `OneSignal` + `Web Push` | Alertas críticas push por desvíos térmicos o fallas de ventilación. |

---

## 💻 Puesta en Marcha Local

### Prerrequisitos
* Node.js 18+ instalado
* Proyecto de Supabase con el esquema de tablas de telemetría y RLS activado

### 1. Clonar el repositorio
```bash
git clone https://github.com/Creapp-apps/TrazAPP-Official-Release-V1.git
cd TrazAPP-Official-Release-V1
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto:
```env
REACT_APP_SUPABASE_URL=tu_supabase_url
REACT_APP_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google AI
REACT_APP_GEMINI_API_KEY=tu_gemini_api_key

# Deepgram (Voice Control)
REACT_APP_DEEPGRAM_API_KEY=tu_deepgram_api_key

# OneSignal Push Alarms
REACT_APP_ONESIGNAL_APP_ID=tu_onesignal_app_id
```

### 4. Ejecutar el entorno de desarrollo
```bash
npm start
```
La consola estará disponible en `http://localhost:3000`.

---

<div align="center">
<sub>Desarrollado y mantenido para entornos industriales exigentes por <b>CreAPP Software Lab</b> © 2026</sub>
</div>
