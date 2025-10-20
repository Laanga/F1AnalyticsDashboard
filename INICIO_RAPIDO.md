# 🚀 Inicio Rápido - F1 Analytics Dashboard

## Pasos para ejecutar el proyecto

### 1️⃣ Instalar dependencias
```bash
npm install
```

### 2️⃣ Iniciar servidor de desarrollo
```bash
npm run dev
```

### 3️⃣ Abrir en navegador
Visita: `http://localhost:3000`

---

## 🎨 Personalización Rápida

### Cambiar colores principales

**Archivo:** `tailwind.config.js`

```js
colors: {
  'f1-red': '#e10600',    // ← Cambia este color
  'f1-dark': '#0a0a0a',   // ← O este
}
```

### Ajustar opacidad del efecto glass

**Archivo:** `src/styles/global.css`

```css
.glass {
  @apply backdrop-blur-xl bg-white/10;
  /*                            ↑
   *  Cambia /10 a /15 para MÁS opacidad
   *  Cambia /10 a /5 para MENOS opacidad
   */
}
```

### Modificar intensidad del blur

**Archivo:** `src/styles/global.css`

```css
.glass {
  @apply backdrop-blur-xl;
  /*              ↑
   *  Opciones:
   *  - backdrop-blur-sm  (4px)   - Poco blur
   *  - backdrop-blur-md  (12px)  - Blur medio
   *  - backdrop-blur-lg  (16px)  - Blur grande
   *  - backdrop-blur-xl  (24px)  - Blur muy grande (ACTUAL)
   *  - backdrop-blur-2xl (40px)  - Blur máximo
   */
}
```

---

## 📊 Consumir datos de la API

Los datos vienen de **OpenF1**: https://openf1.org

### Ejemplo de uso en un componente:

```jsx
import { useEffect, useState } from 'react';
import { getDrivers } from '../services/openf1Service';

const MiComponente = () => {
  const [pilotos, setPilotos] = useState([]);

  useEffect(() => {
    const cargar = async () => {
      const data = await getDrivers();
      setPilotos(data);
    };
    cargar();
  }, []);

  return (
    <div>
      {pilotos.map(piloto => (
        <p key={piloto.driver_number}>{piloto.full_name}</p>
      ))}
    </div>
  );
};
```

---

## 🗂️ Estructura de carpetas

```
src/
├── components/     ← Componentes reutilizables
├── pages/          ← Páginas principales
├── services/       ← Llamadas a APIs
└── styles/         ← Estilos globales
```

---

## ⚡ Comandos útiles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview
```

---

## 🐛 Solución de problemas comunes

### Error: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### El servidor no inicia
- Verifica que el puerto 3000 esté libre
- Cierra otros procesos de Node.js

### Las animaciones van lentas
- Reduce la cantidad de partículas en `FondoAnimado.jsx`
- Cambia `length: 15` a `length: 5`

---

## 📚 Recursos adicionales

- [Documentación React](https://react.dev)
- [Documentación TailwindCSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion/)
- [OpenF1 API](https://openf1.org)

---

**¡Listo para analizar F1! 🏎️💨**

