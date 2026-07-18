import OpenAI from 'openai'
import type { AIProvider } from './provider.js'
import type { AIReviewContext } from '../reviews/context.js'
import type { AIReviewResult } from '../reviews/types.js'
import { buildReviewPrompt } from '../reviews/prompt.js'
import { parseAIResponse } from '../reviews/parser.js'

export class OpenAIProvider implements AIProvider {
  private client: OpenAI
  private model: string

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY environment variable')
    }
    this.client = new OpenAI({ apiKey })
    this.model = process.env.OPENAI_MODEL ?? 'gpt-4o'
  }

  async review(context: AIReviewContext): Promise<AIReviewResult> {
    const prompt = buildReviewPrompt(context)

    const response = await this.client.chat.completions.create({
      model: this.model,
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }]
    })

    const message = response.choices[0]?.message
    if (!message?.content) {
      throw new Error('Empty response from OpenAI')
    }

    return parseAIResponse(message.content)
  }
}
