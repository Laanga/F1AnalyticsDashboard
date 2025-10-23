import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import 'animate.css'

// StrictMode desactivado temporalmente para evitar peticiones duplicadas a la API
// En producción no afecta, solo en desarrollo
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
