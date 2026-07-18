import type { AIReviewResult, ReviewFinding, ReviewSeverity } from './types.js'

const VALID_SEVERITIES = new Set<ReviewSeverity>(['critical', 'high', 'medium', 'low', 'info'])

function isValidSeverity(value: unknown): value is ReviewSeverity {
  return typeof value === 'string' && VALID_SEVERITIES.has(value as ReviewSeverity)
}

function validateFinding(finding: unknown, index: number): ReviewFinding {
  if (typeof finding !== 'object' || finding === null) {
    throw new Error(`Finding at index ${index} is not an object`)
  }

  const f = finding as Record<string, unknown>

  if (!isValidSeverity(f.severity)) {
    throw new Error(`Finding at index ${index} has invalid severity: ${f.severity}`)
  }

  if (typeof f.filename !== 'string' || f.filename.trim() === '') {
    throw new Error(`Finding at index ${index} has invalid filename`)
  }

  if (typeof f.description !== 'string' || f.description.trim() === '') {
    throw new Error(`Finding at index ${index} has invalid description`)
  }

  return {
    severity: f.severity,
    filename: f.filename,
    description: f.description
  }
}

export function parseAIResponse(raw: string): AIReviewResult {
  const cleaned = raw.replace(/```json|```/g, '').trim()

  let parsed: unknown
  try {
    parsed = JSON.parse(cleaned)
  } catch {
    throw new Error('AI response is not valid JSON')
  }

  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('AI response is not an object')
  }

  const obj = parsed as Record<string, unknown>

  if (typeof obj.summary !== 'string' || obj.summary.trim() === '') {
    throw new Error('AI response missing valid summary')
  }

  if (!Array.isArray(obj.findings)) {
    throw new Error('AI response missing findings array')
  }

  const findings = obj.findings.map((f, i) => validateFinding(f, i))

  return {
    summary: obj.summary,
    findings
  }
}
