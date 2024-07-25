import express from 'express'
import httpDevServer from 'vavite/http-dev-server'
import viteDevServer from 'vavite/vite-dev-server'
import { createSSRApp, h, defineComponent } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './src/App.esvue'
import rutas from './src/rutas.esjs'
import axios from 'axios'

const app = express()

if (import.meta.env.PROD) {
  // Serve client assets in production
  app.use(express.static('dist/client'))
}

Object.keys(rutas).forEach((path) =>
  app.get(path, (req, res) => render(req, res, rutas[path])),
)

async function render(req, res, importer) {
  const Page = (await importer()).default

  let clientEntryPath
  let cssEntryPath
  if (viteDevServer) {
    // In development, we can simply refer to the source file name
    clientEntryPath = '/client.js'
  } else {
    // In production we'll figure out the path to the client entry file using the manifest
    // @ts-expect-error: This only exists after the client build is complete
    const manifest = (await import('./dist/client/manifest.json')).default
    clientEntryPath = manifest['client.js'].file
    cssEntryPath = manifest['client.css'].file

    // In a real application we would also use the manifest to generate
    // preload links for assets needed for the rendered page
  }

  const apiUrl = 'https://dolarapi.com/'
  const dolares = (await axios.get(apiUrl + 'v1/dolares')).data

  const ogQueryParam = req.query.og

  const Content = defineComponent({
    render() {
      return h(
        App,
        {},
        {
          default() {
            return h(Page, {
              apiUrl,
              dolares,
              og: ogQueryParam !== undefined,
            })
          },
        },
      )
    },
  })

  const content = await renderToString(createSSRApp(Content))

  const gTagId = import.meta.env.VITE_GTAG_ID

  let html = `<!DOCTYPE html><html lang="es">
		<head>
			<meta charset="UTF-8">
			<meta name="description" content="App desarrollada en EsJS que muestra la cotización del Dólar en Argentina">
			<link rel="icon" href="/favicon.ico" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			
			<title>Dólar Argentina - EsJS</title>
			<link rel="stylesheet" href="${cssEntryPath}">
			<script async src="https://www.googletagmanager.com/gtag/js?id=${gTagId}"></script>
			<script>
			  window.dataLayer = window.dataLayer || [];
			  function gtag(){dataLayer.push(arguments);}
			  gtag('js', new Date());
		
			  gtag('config', '${gTagId}');
			</script>
			
			<!-- OG Tags -->
    		<meta property="og:title" content="App.DolarApi.com" />
    		<meta property="og:description" content="Cotización del Dólar en Argentina" />
    		<meta property="og:image" content="https://dolarapi.com/docs/assets/og.png" />
    		<meta property="og:url" content="https://app.dolarapi.com" />
    		<meta property="og:type" content="website" />
    		<meta property="og:site_name" content="App.DolarApi.com" />
    		<meta property="og:locale" content="es_AR" />

    		<!-- Twitter Tags -->
    		<meta name="twitter:card" content="summary_large_image" />
    		<meta name="twitter:site" content="@dolarapi" />
    		<meta name="twitter:creator" content="@dolarapi" />
    		<meta name="twitter:title" content="App.DolarApi.com" />
    		<meta name="twitter:description" content="Cotización del Dólar en Argentina" />
    		<meta name="twitter:image" content="https://dolarapi.com/docs/assets/og.png" />
    		<meta name="twitter:image:alt" content="App.DolarApi.com" />
    		<meta name="twitter:url" content="https://app.dolarapi.com" />
    		<meta name="twitter:domain" content="app.dolarapi.com" />
		</head>
		<body>
			<div id="root">${content}</div>
			<script type="module" src="${clientEntryPath}"></script>
		</body>
	</html>`

  if (viteDevServer) {
    // This will inject the Vite client and React fast refresh in development
    html = await viteDevServer.transformIndexHtml(req.url, html)
  }

  res.send(html)
}

if (viteDevServer) {
  httpDevServer.on('request', app)
} else {
  console.log('Starting production server')
  app.listen(3000)
}
