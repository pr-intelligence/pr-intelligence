import type { AIProvider } from './provider.js'
import type { AIReviewContext } from '../reviews/context.js'
import type { AIReviewResult } from '../reviews/types.js'

export class MockAIProvider implements AIProvider {
  async review(context: AIReviewContext): Promise<AIReviewResult> {
    return {
      summary: `Mock review for PR #${context.pullRequest.number}: ${context.pullRequest.title}`,
      findings: context.files.map((file) => ({
        severity: 'info' as const,
        filename: file.filename,
        description: 'Mock provider: no issues detected.'
      }))
    }
  }
}
