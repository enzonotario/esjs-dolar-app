import { handle } from 'hono/vercel'
import { app } from '../dist/servidor/app.js'

export const config = {
  runtime: 'edge',
}

export default handle(app)
