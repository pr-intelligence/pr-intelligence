import type { AIReviewContext } from '../reviews/context.js'
import type { AIReviewResult } from '../reviews/types.js'

export interface AIProvider {
  review(context: AIReviewContext): Promise<AIReviewResult>
}
