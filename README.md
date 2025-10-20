# 🏎️ F1 Stats Dashboard

**F1 Stats Dashboard** es una aplicación web moderna inspirada en el diseño *Liquid Glass* de Apple, con una estética basada en los colores clásicos de la Fórmula 1 — negro, rojo y transparencias elegantes.
Permite explorar datos de pilotos, escuderías y carreras a través de gráficos interactivos y visualizaciones limpias.

---

## 🚀 Tecnologías utilizadas

| Categoría          | Herramienta                                               |
| ------------------ | --------------------------------------------------------- |
| **Frontend**       | [React](https://react.dev/) + [Vite](https://vitejs.dev/) |
| **API de datos**   | [OpenF1](https://openf1.org/)                             |
| **Gráficos**       | [Recharts](https://recharts.org/en-US/)                   |
| **Estilos**        | [Tailwind CSS](https://tailwindcss.com/)                  |
| **Despliegue**     | [Vercel](https://vercel.com/)                             |

---

## ✨ Características principales

* 🏁 **Panel de control F1** con datos en tiempo real de pilotos, equipos y carreras.
* 📊 **Visualizaciones interactivas** (gráficos de velocidad, puntos, posiciones, etc.).
* 🧊 **Diseño Liquid Glass**: transparencias suaves, bordes redondeados, sombras sutiles y fondo difuminado.
* 🌙 **Modo oscuro predeterminado** con acentos en rojo F1.
* 📱 **Responsive design** optimizado para móvil, tablet y escritorio.
* ⚡ **Datos actualizados** directamente desde la API oficial de OpenF1.

---

## 💻 Instalación local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tuusuario/f1-stats-dashboard.git
   cd f1-stats-dashboard
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Ejecuta el proyecto:

   ```bash
   npm run dev
   ```

4. Abre tu navegador en `http://localhost:3000`

---

## 🧩 Estructura del proyecto

```
f1-stats-dashboard/
│
├── src/
│   ├── components/      # Componentes reutilizables (Navbar, Cards, Charts...)
│   ├── pages/           # Páginas principales (Inicio, Pilotos, Equipos...)
│   ├── services/        # Integración con OpenF1 API
│   ├── styles/          # Estilos globales
│   └── App.jsx          # Punto de entrada
│
├── public/
└── README.md
```

---

## 🎨 Inspiración de diseño

El estilo visual sigue la filosofía **Apple Liquid Glass**, con:

* Fondos translúcidos y difuminados (*backdrop-blur*).
* Sombras suaves y brillos sutiles.
* Tipografía moderna y espaciosa.
* Contrastes elegantes entre negro, gris humo y acentos en rojo F1.

> 💡 "Minimalismo, velocidad y precisión — igual que en la F1."

---

## 📦 Despliegue

Puedes desplegar el proyecto fácilmente en [Vercel](https://vercel.com/) con un clic:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🧠 Futuras mejoras

* 🏎️ Expandir análisis con más endpoints de OpenF1 (telemetría, radio, clima).
* ⚙️ Añadir backend propio en **FastAPI (Python)** para análisis avanzados.
* 🧮 Mostrar estadísticas predictivas (estrategias, desgaste, etc.).
* 📈 Comparativas históricas entre temporadas.
* 🎯 Filtros avanzados y búsqueda personalizada.

---

## 👨‍💻 Autor

**Álvaro Langa**
Desarrollador Web & Motorsport Data Enthusiast 🏁
[💼 LinkedIn](https://linkedin.com/in/tu-perfil) | [📧 Contacto](mailto:tuemail@gmail.com)

---

⭐ **Si te gusta este proyecto, deja una estrella en GitHub para apoyar el desarrollo.**
