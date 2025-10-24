# 🏎️ F1 Data Explorer

**F1 Data Explorer** es una aplicación web moderna que combina datos oficiales y actualizados de la Fórmula 1 con un diseño elegante inspirado en el estilo *Liquid Glass* de Apple. La aplicación presenta una estética sofisticada basada en los colores clásicos de la F1 — negro, rojo y transparencias elegantes — permitiendo explorar estadísticas de pilotos, equipos y carreras a través de visualizaciones interactivas y gráficos dinámicos.

---

## 🚀 Tecnologías utilizadas

| Categoría          | Herramienta                                               |
| ------------------ | --------------------------------------------------------- |
| **Frontend**       | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **APIs de datos** | [OpenF1](https://openf1.org/) + [Ergast F1 API](http://ergast.com/mrd/) |
| **Gráficos**       | [Recharts](https://recharts.org/en-US/)                   |
| **Estilos**        | [Tailwind CSS](https://tailwindcss.com/)                  |
| **Animaciones**    | [Animate.css](https://animate.style/) + [Framer Motion](https://www.framer.com/motion/) |

---

## ✨ Características principales

* 🏁 **Explorador completo de F1** con datos actualizados de pilotos, equipos y estadísticas de temporada.
* 📅 **Selector de temporada** y progreso del año para navegar entre temporadas.
* 👤 **Perfiles detallados de pilotos** con fotos oficiales, estadísticas y información de equipos.
* 🏆 **Clasificaciones de temporada** de pilotos y constructores de la temporada seleccionada.
* 🗓️ **Calendario de carreras** con próximas y completadas, detalles de circuito y fechas.
* 📊 **Gráficos interactivos** para análisis de rendimiento, puntos y comparativas.
* 🧊 **Diseño Liquid Glass**: transparencias elegantes, efectos de cristal y animaciones fluidas.
* 🌙 **Interfaz oscura premium** con acentos en rojo F1 y efectos de iluminación.
* 📱 **Totalmente responsive** optimizado para todos los dispositivos.
* ⚡ **Integración de datos** combinando OpenF1 (fotos y datos actuales) con Ergast (datos históricos).

---

## 💻 Instalación y desarrollo

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Pasos de instalación

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tuusuario/f1-data-explorer.git
cd f1-data-explorer
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abre tu navegador en:** `http://localhost:3000`

### Scripts disponibles
- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting del código

---

## 🧩 Estructura del proyecto

```
F1DataExplorer/
│
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── equipos/        # Componentes específicos de equipos
│   │   ├── estadisticas/   # Componentes de gráficos y stats
│   │   ├── layout/         # Layout y navegación
│   │   ├── pilotos/        # Componentes de pilotos
│   │   └── ui/             # Componentes UI base
│   ├── contexts/           # Contextos de React (Year, etc.)
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas principales
│   │   ├── Inicio.jsx      # Página principal
│   │   ├── Pilotos.jsx     # Página de pilotos
│   │   ├── Equipos.jsx     # Página de equipos
│   │   ├── Estadisticas.jsx # Análisis y gráficos
│   │   └── Carreras.jsx    # Información de carreras
│   ├── services/           # Servicios de API
│   │   ├── api/            # Servicios específicos
│   │   ├── config/         # Configuración de APIs
│   │   └── utils/          # Utilidades de servicios
│   ├── utils/              # Utilidades generales
│   └── styles/             # Estilos globales
│
├── public/                 # Assets estáticos
└── README.md
```

---

## 🎨 Filosofía de diseño

El estilo visual está inspirado en la filosofía **Apple Liquid Glass**, implementando:

* **Transparencias elegantes** con efectos de cristal y *backdrop-blur*
* **Sombras dinámicas** y brillos sutiles que responden a la interacción
* **Tipografía premium** con espaciado cuidadoso y jerarquía clara
* **Paleta sofisticada** combinando negro profundo, grises elegantes y rojo F1 icónico
* **Animaciones fluidas** que mejoran la experiencia sin distraer
* **Microinteracciones** que proporcionan feedback inmediato

> 💡 *"Minimalismo, velocidad y precisión — los mismos principios que rigen la Fórmula 1."*

---



## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios importantes:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

⭐ **Si este proyecto te resulta útil, considera darle una estrella en GitHub para apoyar su desarrollo.**
