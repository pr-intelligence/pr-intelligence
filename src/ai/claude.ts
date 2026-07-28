import Anthropic from '@anthropic-ai/sdk'
import type { AIProvider } from './provider.js'
import type { AIReviewContext } from '../reviews/context.js'
import type { AIReviewResult } from '../reviews/types.js'
import { buildReviewPrompt } from '../reviews/prompt.js'
import { parseAIResponse } from '../reviews/parser.js'

export class ClaudeProvider implements AIProvider {
  private client: Anthropic
  private model: string

  constructor() {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      throw new Error('Missing ANTHROPIC_API_KEY environment variable')
    }
    this.client = new Anthropic({ apiKey })
    this.model = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-6'
  }

  async review(context: AIReviewContext): Promise<AIReviewResult> {
    const prompt = buildReviewPrompt(context)

    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const content = message.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return parseAIResponse(content.text)
  }
}
