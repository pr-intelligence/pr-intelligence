import type { AIProvider } from './provider.js'
import { OpenAIProvider } from './openai.js'

let provider: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (provider) return provider
  provider = new OpenAIProvider()
  return provider
}
