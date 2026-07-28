import type { AIReviewContext } from './context.js'

export function buildReviewPrompt(context: AIReviewContext): string {
  const filesSummary = context.files
    .map((file) => {
      const patch = file.patch
        ? `\n\`\`\`diff\n${file.patch}\n\`\`\``
        : '(no patch available)'
      return `File: ${file.filename} (${file.status}, +${file.additions} -${file.deletions})${patch}`
    })
    .join('\n\n')

  return `You are a senior software engineer reviewing a pull request.

Repository: ${context.repository.fullName}
PR #${context.pullRequest.number}: ${context.pullRequest.title}
Author: ${context.pullRequest.author}

Changed files:
${filesSummary}

Review this pull request and respond with ONLY a valid JSON object in this exact format:
{
  "summary": "Brief summary of what this PR does",
  "findings": [
    {
      "severity": "critical|high|medium|low|info",
      "filename": "path/to/file",
      "description": "Clear description of the issue or observation"
    }
  ]
}

Rules:
- Maximum 5 findings
- Only include real issues, not style preferences
- If no issues found, return an empty findings array
- severity must be one of: critical, high, medium, low, info
- Respond with ONLY the JSON object, no other text`
}
