import 'dotenv/config'
import Fastify from 'fastify'
import rawBody from 'fastify-raw-body'
import { registerWebhookRoute } from './github/index.js'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    await app.register(rawBody, {
      field: 'rawBody',
      global: false,
      encoding: 'utf8',
      runFirst: true
    })

    await registerWebhookRoute(app)

    const PORT = Number(process.env.PORT) || 3000
    await app.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()