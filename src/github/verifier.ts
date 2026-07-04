import 'dotenv/config'
import { Webhooks } from '@octokit/webhooks'

console.log('Webhook secret loaded:', Boolean(process.env.GITHUB_WEBHOOK_SECRET))

export const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET || ''
})
