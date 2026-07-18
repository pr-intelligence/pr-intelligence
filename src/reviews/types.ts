export type ReviewSeverity = 'critical' | 'high' | 'medium' | 'low' | 'info'

export interface ReviewFinding {
  severity: ReviewSeverity
  filename: string
  description: string
}

export interface AIReviewResult {
  summary: string
  findings: ReviewFinding[]
}
