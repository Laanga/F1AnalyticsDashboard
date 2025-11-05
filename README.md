# 🏎️ F1 Data

<div align="center">

![F1 Data Banner](https://img.shields.io/badge/F1-Data-E10600?style=for-the-badge&logo=formula1&logoColor=white)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.1-646CFF?style=for-the-badge&logo=vite&logoColor=white)

### 🏁 Aplicación web moderna para visualizar datos de Fórmula 1 en tiempo real

[Ver Demo](#) • [Características](#-características) • [Tecnologías](#️-tecnologías)

</div>

---

## 📋 Descripción

**F1 Data** es una aplicación web interactiva que permite consultar y visualizar datos actualizados de la Fórmula 1. Con un diseño inspirado en el estilo *Liquid Glass* de Apple, ofrece una experiencia visual elegante y fluida para seguir el campeonato, ver clasificaciones, estadísticas de pilotos y equipos, calendario de carreras y mucho más.

### 🎯 Objetivo del Proyecto

Este proyecto personal fue desarrollado para demostrar habilidades en:
- Desarrollo frontend moderno con React
- Integración de múltiples APIs REST
- Diseño UI/UX avanzado con animaciones fluidas
- Visualización de datos con gráficos interactivos
- Responsive design y optimización de rendimiento

---

## ✨ Características

### 🏆 Panel Principal
- **Vista general del campeonato** con progreso de temporada en tiempo real
- **Podio Top 3** con fotos oficiales de pilotos y estadísticas destacadas
- **Acceso rápido** a todas las secciones principales

### 👥 Clasificación de Pilotos
- Listado completo de los 20 pilotos de la temporada actual
- Fotos oficiales, equipos, puntos y victorias
- Diseño especial para el podio (oro, plata, bronce)

### 🏢 Equipos y Constructores
- Clasificación de constructores con logos oficiales
- Visualización de colores corporativos de cada equipo
- Puntos totales y posición en el campeonato

### 🗓️ Calendario de Carreras
- Listado de todas las carreras de la temporada
- Información de circuitos y fechas
- Diferenciación visual entre carreras completadas y pendientes

### 📊 Estadísticas y Visualizaciones
- **Gráficos interactivos** de puntos y comparativas
- **Top 20 pilotos** con datos actualizados
- **Récords de la temporada**: vueltas rápidas, pit stops, diferencias
- **Fuentes de datos** transparentes con links a las APIs

---

## 🛠️ Tecnologías

<div align="center">

| Frontend | Librerías | APIs |
|:--------:|:---------:|:----:|
| ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | ![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=black) | ![OpenF1](https://img.shields.io/badge/-OpenF1-E10600?style=flat-square&logo=formula1&logoColor=white) |
| ![Vite](https://img.shields.io/badge/-Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | ![Framer Motion](https://img.shields.io/badge/-Framer%20Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | ![Ergast](https://img.shields.io/badge/-Ergast%20API-E10600?style=flat-square&logo=formula1&logoColor=white) |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | ![Recharts](https://img.shields.io/badge/-Recharts-FF6B6B?style=flat-square&logo=chartdotjs&logoColor=white) | |
| ![React Router](https://img.shields.io/badge/-React%20Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | ![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | |

</div>

### 🎨 Diseño y Animaciones
- **Tailwind CSS** para estilos utility-first
- **GSAP** para animaciones avanzadas con ScrollTrigger
- **Framer Motion** para microinteracciones fluidas
- **Glassmorphism** (efecto cristal) en toda la interfaz
- **Responsive design** optimizado para todos los dispositivos

### 📡 Integración de Datos
- **OpenF1 API**: Datos de sesiones y telemetría en tiempo real
- **Ergast F1 API**: Clasificaciones y resultados históricos
- **Manejo de estados** con React Context API
- **Optimización de peticiones** con AbortController

---

 

## 🚀 Instalación y Uso

### Prerrequisitos
```bash
Node.js 18+ 
npm o yarn
```

### Instalación Local

1. **Clona el repositorio**
```bash
git clone https://github.com/tuusuario/f1-data.git
cd f1-data
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

4. **Abre tu navegador**
```
http://localhost:5173
```

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo |
| `npm run build` | Genera build de producción |
| `npm run preview` | Preview del build de producción |

---

## 🎨 Filosofía de Diseño

### Liquid Glass Design
El diseño está inspirado en la filosofía **Apple Liquid Glass**, implementando:

```
┌─────────────────────────────────────┐
│  🧊 Transparencias Elegantes        │
│  ✨ Efectos de Cristal              │
│  🌙 Modo Oscuro Premium             │
│  🎭 Sombras Dinámicas               │
│  ⚡ Animaciones Fluidas             │
│  🎯 Microinteracciones              │
└─────────────────────────────────────┘
```

### Paleta de Colores
- **Negro profundo**: `#000000` - Fondo principal
- **Rojo F1**: `#E10600` - Acentos y CTAs
- **Transparencias**: Vidrio esmerilado con blur
- **Colores de equipo**: Específicos para cada constructor

---

## 📦 Estructura del Proyecto

```
F1Data/
│
├── 📁 src/
│   ├── 📁 components/       # Componentes reutilizables
│   │   ├── equipos/        # Componentes de equipos
│   │   ├── estadisticas/   # Gráficos y stats
│   │   ├── layout/         # Navbar y layout
│   │   ├── pilotos/        # Componentes de pilotos
│   │   └── ui/             # Componentes UI base
│   │
│   ├── 📁 pages/           # Páginas principales
│   │   ├── Inicio.jsx      # 🏠 Landing page
│   │   ├── Pilotos.jsx     # 👥 Clasificación pilotos
│   │   ├── Equipos.jsx     # 🏢 Clasificación equipos
│   │   ├── Carreras.jsx    # 🗓️ Calendario carreras
│   │   └── Estadisticas.jsx # 📊 Gráficos y stats
│   │
│   ├── 📁 services/        # Servicios de API
│   ├── 📁 contexts/        # Context API (Year, etc.)
│   ├── 📁 hooks/           # Custom hooks
│   └── 📁 utils/           # Utilidades
│
├── 📁 public/              # Assets estáticos
├── 📄 package.json         # Dependencias
└── 📄 README.md           # Este archivo
```

---

## 🌟 Características Técnicas Destacadas

### ⚡ Rendimiento
- **Code splitting** automático con Vite
- **Lazy loading** de componentes
- **Optimización de imágenes** con fallbacks
- **Caché de peticiones API** para reducir latencia

### 🎭 Animaciones Avanzadas
- **GSAP ScrollTrigger** para animaciones al scroll
- **Framer Motion** para transiciones de página
- **Efecto magnético** en elementos interactivos
- **Partículas animadas** en componentes hero

### 📱 Responsive Design
- **Mobile-first** approach
- **Breakpoints optimizados** para todos los dispositivos
- **Touch gestures** para interacciones móviles

### 🔒 Manejo de Errores
- **Boundaries** para captura de errores
- **Fallbacks** para imágenes y datos
- **Loading states** personalizados
- **AbortController** para cancelar peticiones

---

## 🎯 Casos de Uso

### Para Fans de F1
✅ Seguir el campeonato en tiempo real  
✅ Ver clasificaciones actualizadas  
✅ Consultar calendario de carreras  
✅ Analizar estadísticas de pilotos y equipos  

### Para Desarrolladores
✅ Ejemplo de integración de múltiples APIs  
✅ Implementación de animaciones avanzadas  
✅ Diseño moderno con Tailwind CSS  
✅ Arquitectura escalable con React  

---

 

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si quieres mejorar el proyecto:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/MejoraMajestuosa`)
3. **Commit** tus cambios (`git commit -m 'Add: nueva característica'`)
4. **Push** a la rama (`git push origin feature/MejoraMajestuosa`)
5. Abre un **Pull Request**

---

 

## 👨‍💻 Autor

**Tu Nombre**

- 💼 LinkedIn: [Álvaro Langa](https://www.linkedin.com/in/%C3%A1lvaro-langa-dev/)
- 🐱 GitHub: [@Laanga](https://github.com/Laanga)
- 🌐 Portfolio: [alvarolangadev](alvarolangadev.vercel.app)

---

## 🙏 Agradecimientos

- **OpenF1** por proporcionar datos en tiempo real
- **Ergast F1 API** por los datos históricos
- **Formula 1** por inspirar este proyecto
- **Comunidad Open Source** por las librerías utilizadas

---

<div align="center">

### ⭐ Si te gustó este proyecto, considera darle una estrella en GitHub

**Hecho con ❤️ y mucha ☕ por un fan de la F1**

![F1](https://img.shields.io/badge/-Formula%201-E10600?style=for-the-badge&logo=formula1&logoColor=white)

</div>
