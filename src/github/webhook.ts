import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

export async function registerWebhookRoute(app: FastifyInstance) {
  app.post('/webhook', async (request: FastifyRequest, reply: FastifyReply) => {
    app.log.info(request.body, 'Webhook received')
    return reply.status(200).send({ ok: true })
  })
}