import 'dotenv/config'
import Fastify from 'fastify'
import { registerWebhookRoute } from './github/webhook'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

registerWebhookRoute(app)

const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3000
    await app.listen({ port: PORT, host: '0.0.0.0' })
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()