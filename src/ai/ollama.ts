import type { AIProvider } from './provider.js'
import type { AIReviewContext } from '../reviews/context.js'
import type { AIReviewResult } from '../reviews/types.js'
import { buildReviewPrompt } from '../reviews/prompt.js'
import { parseAIResponse } from '../reviews/parser.js'

interface OllamaGenerateResponse {
  response: string
}

export class OllamaProvider implements AIProvider {
  private baseUrl: string
  private model: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434'
    this.model = process.env.OLLAMA_MODEL ?? 'qwen2.5-coder:7b'
  }

  async review(context: AIReviewContext): Promise<AIReviewResult> {
    const prompt = buildReviewPrompt(context)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120000)

    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: this.model,
          prompt,
          stream: false,
          format: 'json'
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`)
      }

      const data: OllamaGenerateResponse = await response.json()

      if (!data.response) {
        throw new Error('Empty response from Ollama')
      }

      return parseAIResponse(data.response)
    } finally {
      clearTimeout(timeout)
    }
  }
}
