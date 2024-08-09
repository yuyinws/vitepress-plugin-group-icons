import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import dts from 'vite-plugin-dts'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), dts()],
  build: {
    lib: {
      entry: fileURLToPath(new URL('./src/index.ts', import.meta.url)),
      name: 'GroupIcon',
      formats: ['es'],
      fileName: 'group-icon'
    },
    rollupOptions: {
      external: ['vue'],
    }
  }
})
