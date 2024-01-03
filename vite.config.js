import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import EsJS from '@es-js/vite-plugin-esjs'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // https://github.com/es-js/esjs
    EsJS(),

    devServer({
      entry: './api/app.esjs',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./api', import.meta.url)),
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
    ],
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: './dist',
    minify: false,
    rollupOptions: {
      input: './api/app.esjs',
      output: {
        format: 'esm',
        entryFileNames: 'servidor/[name].js',
        chunkFileNames: 'servidor/[name].js',
        assetFileNames: 'servidor/[name].[ext]',
      },
    },
  },
})
