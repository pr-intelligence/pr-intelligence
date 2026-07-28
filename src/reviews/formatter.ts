import type { AIReviewResult, ReviewFinding, ReviewSeverity } from './types.js'

const SEVERITY_EMOJI: Record<ReviewSeverity, string> = {
  critical: '🔴',
  high: '🟠',
  medium: '🟡',
  low: '🔵',
  info: 'ℹ️'
}

function formatFinding(finding: ReviewFinding): string {
  const emoji = SEVERITY_EMOJI[finding.severity]
  return `${emoji} **${finding.severity.toUpperCase()}** — \`${finding.filename}\`\n${finding.description}`
}

export function formatReviewAsMarkdown(review: AIReviewResult): string {
  const findings = review.findings.length > 0
    ? review.findings.map(formatFinding).join('\n\n')
    : '_No issues found._'

  return [
    '## 🔍 PR Intelligence Review',
    '',
    '**Summary**',
    '',
    review.summary,
    '',
    '---',
    '',
    '### Findings',
    '',
    findings,
    '',
    '---',
    '*Reviewed by [PR Intelligence](https://github.com/apps/pr-intelligence-dev)*'
  ].join('\n')
}
