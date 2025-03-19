import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    host: '0.0.0.0',  // Allows access from any device on the network
    port: 3000,       // Change this to any port you prefer
  }
})
