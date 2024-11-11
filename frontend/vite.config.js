import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  // server: {
  //   hmr: false
  // }
  base: './',  // Ensures Vite assets are served relative to the root
})
