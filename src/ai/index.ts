import type { AIProvider } from './provider.js'
import { MockAIProvider } from './mock.js'
import { ClaudeProvider } from './claude.js'
import { OpenAIProvider } from './openai.js'
import { OllamaProvider } from './ollama.js'

let provider: AIProvider | null = null
let providerName: string = 'mock'

export function getAIProvider(): AIProvider {
  if (provider) return provider

  const name = process.env.AI_PROVIDER ?? 'mock'
  providerName = name

  switch (name) {
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
      providerName = 'mock'
      break
  }

  return provider
}

export function getProviderName(): string {
  return providerName
}
