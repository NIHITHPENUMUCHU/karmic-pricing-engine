import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This file fixes the ERR_MODULE_NOT_FOUND error by using the standard react plugin
export default defineConfig({
  plugins: [react()],
})