import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import EsJS from '@es-js/vite-plugin-esjs'
import EsVue from '@es-js/vite-plugin-esvue'
import Unocss from 'unocss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      include: [/\.vue$/, /\.esvue$/],
    }),

    // https://github.com/es-js/esjs
    EsJS(),
    EsVue(),

    // https://github.com/unocss/unocss
    Unocss({
      include: [/\.vue$/, /\.esvue$/],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
      '.esjs',
      '.esvue',
    ],
  },
  server: {
    port: 3000,
  },
})
