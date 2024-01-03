import { createSSRApp, h } from "vue";
import App from "./src/App.esvue";
import rutas from './src/rutas.esjs';
import axios from 'axios';

import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

async function render() {
	const importer = rutas[window.location.pathname]

	if (!importer) {
		throw new Error(`No page found for ${window.location.pathname}`);
	}

	const Page = (await importer()).default;

	const apiUrl = 'https://dolarapi.com/'
	const dolares = (await axios.get(apiUrl + 'v1/dolares')).data

	const app = createSSRApp({
		render() {
			return h(
				App,
				{},
				{
					default() {
						return h(Page, {
							apiUrl,
							dolares,
						});
					},
				},
			);
		},
	});

	app.mount("#root");
}

render();
