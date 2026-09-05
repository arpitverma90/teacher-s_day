import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/teacher-s_day/',
  build: {
    rollupOptions: {
      input: 'src/index.html',
    },
  },
  plugins: [react()],
})
