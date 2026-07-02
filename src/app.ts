import Fastify from 'fastify'

const app = Fastify({ logger: true })

app.get('/health', async () => {
  return { status: 'ok' }
})

const start = async () => {
  try {
    const PORT = Number(process.env.PORT) || 3000

    await app.listen({
      port: PORT,
      host: '0.0.0.0'
    })

  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()