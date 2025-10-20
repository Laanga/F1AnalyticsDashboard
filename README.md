# 🏎️ F1 Analytics Dashboard

Un dashboard moderno de análisis de Fórmula 1 con diseño **"Liquid Glass"** inspirado en Apple, construido con React, TailwindCSS y la API de OpenF1.

![F1 Analytics Dashboard](https://img.shields.io/badge/F1-Analytics-e10600?style=for-the-badge&logo=formula1)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Características

- 🎨 **Diseño "Liquid Glass"** con efectos glassmorphism y blur dinámico
- 📊 **Datos en tiempo real** desde la API oficial de OpenF1
- 🏁 **5 secciones principales**: Inicio, Pilotos, Equipos, Carreras y Estadísticas
- ⚡ **Animaciones fluidas** con Framer Motion
- 📈 **Gráficas interactivas** con Recharts
- 🎯 **Navegación intuitiva** con React Router
- 🌙 **Tema oscuro premium** con paleta de colores F1

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- Node.js 18+ instalado
- npm o yarn

### Pasos

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador**
   - El proyecto se abrirá automáticamente en `http://localhost:3000`
   - Si no se abre automáticamente, visita manualmente esa URL

---

## 📁 Estructura del Proyecto

```
F1AnalyticsDashboard/
├── src/
│   ├── App.jsx                    # Componente principal con rutas
│   ├── main.jsx                   # Punto de entrada de React
│   ├── components/
│   │   ├── Navbar.jsx             # Barra de navegación con efecto glass
│   │   ├── CardPiloto.jsx         # Tarjeta de piloto animada
│   │   ├── GraficaPuntos.jsx      # Gráfica reutilizable (línea/barra)
│   │   ├── PanelEstadisticas.jsx  # Panel de estadística individual
│   │   ├── Loader.jsx             # Indicador de carga animado
│   │   └── FondoAnimado.jsx       # Fondo con partículas animadas
│   ├── pages/
│   │   ├── Inicio.jsx             # Página de inicio / Hero
│   │   ├── Pilotos.jsx            # Lista y detalles de pilotos
│   │   ├── Equipos.jsx            # Equipos y comparativas
│   │   ├── Carreras.jsx           # Calendario de carreras
│   │   └── Estadisticas.jsx       # Estadísticas globales
│   ├── services/
│   │   └── openf1Service.js       # Cliente API de OpenF1
│   └── styles/
│       └── global.css             # Estilos globales + Tailwind
├── index.html                     # Plantilla HTML
├── package.json                   # Dependencias
├── vite.config.js                 # Configuración de Vite
├── tailwind.config.js             # Configuración de Tailwind
└── README.md                      # Este archivo
```

---

## 🎨 Personalización de Estilos

### 🔧 Modificar la opacidad del efecto glass

Abre `src/styles/global.css` y busca la clase `.glass`:

```css
.glass {
  @apply backdrop-blur-xl bg-white/10 border border-white/20 shadow-glass;
  /* 
    Para MÁS opacidad: cambia bg-white/10 a bg-white/15 o bg-white/20
    Para MENOS opacidad: cambia a bg-white/5
    Para cambiar el blur: 
      - backdrop-blur-xl (24px)
      - backdrop-blur-2xl (40px)  <- más blur
      - backdrop-blur-lg (16px)   <- menos blur
  */
}
```

### 🎨 Cambiar los colores principales

1. **En `tailwind.config.js`**:
```js
colors: {
  'f1-red': '#e10600',      // Rojo F1 principal
  'f1-dark': '#0a0a0a',     // Fondo oscuro
  'f1-gray': '#1a1a1a',     // Gris secundario
}
```

2. **En `src/styles/global.css`** para el gradiente:
```css
.gradient-f1 {
  background: linear-gradient(135deg, #e10600 0%, #8b0000 100%);
  /* Cambia #e10600 y #8b0000 por tus colores preferidos */
}
```

### 🌈 Ajustar el fondo animado

En `src/components/FondoAnimado.jsx`, modifica:
- **Cantidad de partículas**: cambia `length: 15` a otro número
- **Velocidad de animación**: ajusta `duration` en las partículas
- **Color**: modifica el gradiente en `background`

---

## 📊 API y Datos

El proyecto consume datos de **[OpenF1](https://openf1.org)**, una API gratuita y abierta con información en tiempo real de F1.

### Endpoints utilizados:
- `/v1/drivers` - Información de pilotos
- `/v1/sessions` - Sesiones (práctica, clasificación, carrera)
- `/v1/meetings` - Grandes Premios
- `/v1/position` - Posiciones en carrera
- `/v1/laps` - Datos de vueltas

### Agregar nuevos endpoints

Edita `src/services/openf1Service.js`:

```js
export const getNuevoEndpoint = async () => {
  try {
    const response = await axios.get(`${API_URL}/nuevo-endpoint`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
```

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 18.3 | Framework principal |
| **Vite** | 5.1 | Build tool y dev server |
| **TailwindCSS** | 3.4 | Estilos y utilidades |
| **React Router** | 6.22 | Navegación entre páginas |
| **Framer Motion** | 11.0 | Animaciones fluidas |
| **Recharts** | 2.12 | Gráficas interactivas |
| **Lucide React** | 0.344 | Iconos minimalistas |
| **Axios** | 1.6 | Cliente HTTP |

---

## 📱 Páginas y Funcionalidades

### 🏠 Inicio
- Hero con presentación del proyecto
- Características destacadas con iconos animados
- Botón CTA para iniciar análisis

### 👤 Pilotos
- Grid de tarjetas glass con todos los pilotos
- Modal con detalles y gráfica de rendimiento
- Información: nombre, número, equipo, país

### 🏆 Equipos
- Equipos agrupados con sus pilotos
- Gráfica comparativa de puntos
- Colores personalizados por equipo

### 🏁 Carreras
- Tabla de carreras con ubicación y fecha
- Información de circuitos
- Estado de completado

### 📈 Estadísticas
- Paneles con métricas clave
- Gráficas de top pilotos y evolución
- Podio del campeonato
- Récords de la temporada

---

## 🎯 Próximas Mejoras (Roadmap)

- [ ] Integración con Supabase para datos históricos
- [ ] Sistema de favoritos
- [ ] Comparativa directa entre pilotos
- [ ] Datos de telemetría en tiempo real
- [ ] Modo claro/oscuro
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones de carreras en vivo

---

## 🤝 Contribuir

¿Quieres mejorar el proyecto? ¡Las contribuciones son bienvenidas!

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

---

## 👨‍💻 Autor

Desarrollado con ❤️ para los amantes de la Fórmula 1

**Powered by [OpenF1 API](https://openf1.org)**

---

## 📞 Soporte

¿Problemas o preguntas?
- Revisa la [documentación de OpenF1](https://openf1.org)
- Consulta los issues del repositorio
- Revisa la consola del navegador para errores

---

## 🙏 Agradecimientos

- **OpenF1** por la increíble API gratuita
- **Formula 1** por la emoción de cada carrera
- **Vercel** por el hosting (si aplica)
- La comunidad de React y TailwindCSS

---

<div align="center">
  
### ⭐ Si te gustó el proyecto, dale una estrella!

Made with 🏎️ and ☕

</div>

