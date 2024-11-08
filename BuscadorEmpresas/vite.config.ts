import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },server: {
    proxy: {
      // Ejemplo: redirige las peticiones de /api a http://localhost:8001
      '/api': {
        target: 'http://localhost:5122/', // URL base de tu backend
        changeOrigin: true, // Necesario para evitar problemas de CORS
        rewrite: path => path.replace(/^\/api/, ''), // Opcional: elimina el prefijo /api en la petición redirigida
      },
    },
  }
})
