import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Сборка кладётся прямо в public/resume — сервер отдаёт её как обычную статику,
// поэтому на боевом сервере по-прежнему нужен только `node server.js`.
export default defineConfig({
  base: '/resume/',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: '../public/resume',
    emptyOutDir: true,
  },
})
