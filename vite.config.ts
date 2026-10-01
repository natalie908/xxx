import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// GitHub Pages servíruje projekt z podadresy /xxx/
export default defineConfig({
  base: '/xxx/',
  plugins: [react(), tailwindcss()],
})
