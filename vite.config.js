import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/v1": {
        target: "https://backend-project-743d.vercel.app", // your backend URL
        changeOrigin: true,
        secure: true,
      },
    }
  },
  plugins: [react()
    , tailwindcss()
  ],
})
