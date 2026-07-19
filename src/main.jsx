// ============================================================
// src/main.jsx — Punto de entrada de React (Frontend)
// ============================================================
// Este es el primer archivo JavaScript que se ejecuta en el navegador.
// Carga la aplicación React y la monta en el div#root del HTML.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'  // Estilos globales de toda la aplicación (tema oscuro)
import App from './App.jsx'

// createRoot: API moderna de React 18+ para montar la aplicación
// StrictMode: modo de desarrollo que detecta problemas comunes
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
