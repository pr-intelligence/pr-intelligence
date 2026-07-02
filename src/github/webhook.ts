import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { webhooks } from './verifier.js'
import { handlePullRequestOpened } from './handlers.js'

const WEBHOOK_ROUTE = '/webhook'

webhooks.on('pull_request.opened', handlePullRequestOpened)

export async function registerWebhookRoute(app: FastifyInstance) {
  app.post(
    WEBHOOK_ROUTE,
    { config: { rawBody: true } },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const signature = request.headers['x-hub-signature-256'] as string
      const event = request.headers['x-github-event'] as string
      const delivery = request.headers['x-github-delivery'] as string

      if (!signature || !event || !delivery) {
        return reply.status(400).send({ error: 'Missing required GitHub headers' })
      }

      if (!request.rawBody) {
        return reply.status(400).send({ error: 'Missing request body' })
      }

      try {
        await webhooks.verifyAndReceive({
          id: delivery,
          name: event as any,
          signature,
          payload: request.rawBody.toString()
        })

        return reply.status(200).send({ ok: true })
      } catch (err) {
        app.log.error(err, 'Webhook processing failed')
        return reply.status(401).send({ error: 'Invalid webhook signature' })
      }
    }
  )
}