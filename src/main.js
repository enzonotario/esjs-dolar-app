import { createApp } from 'vue'
import viteSSR from 'vite-ssr/vue'
import App from '@/App.esvue'
import routes from '@/rutas.esjs'

import '@unocss/reset/tailwind.css'
import 'uno.css'

export default viteSSR(App, { routes })