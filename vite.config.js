// ============================================================
// vite.config.js — Configuración del servidor de desarrollo Vite
// ============================================================
// Vite es la herramienta que ejecuta el frontend en tiempo de desarrollo
// y construye los archivos optimizados para producción.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Plugin de React: permite usar JSX y hot reload (actualización en caliente)
  plugins: [react()],

  server: {
    // host: true permite acceder al servidor desde otros dispositivos en la red local
    host: true,

    // Proxy: redirige todas las peticiones /api al backend Express en el puerto 4000
    // Esto evita problemas de CORS durante el desarrollo
    proxy: {
      '/api': {
        target: 'http://localhost:4000', // URL del servidor backend
        changeOrigin: true, // Cambia el header "Origin" para que el backend lo acepte
      },
    },
  },
})
