import type { AIProvider } from './provider.js'
import { MockAIProvider } from './mock.js'
import { ClaudeProvider } from './claude.js'
import { OpenAIProvider } from './openai.js'
import { OllamaProvider } from './ollama.js'

let provider: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (provider) return provider

  switch (process.env.AI_PROVIDER) {
    case 'mock':
      provider = new MockAIProvider()
      break
    case 'claude':
      provider = new ClaudeProvider()
      break
    case 'openai':
      provider = new OpenAIProvider()
      break
    case 'ollama':
      provider = new OllamaProvider()
      break
    default:
      provider = new MockAIProvider()
      break
  }

  return provider
}
