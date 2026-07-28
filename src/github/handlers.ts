import type { EmitterWebhookEvent } from '@octokit/webhooks'
import { upsertInstallation, upsertRepository, upsertPullRequest } from '../database/repository.js'
import { buildAIReviewContext } from '../reviews/contextBuilder.js'
import { getAIProvider } from '../ai/index.js'
import { formatReviewAsMarkdown } from '../reviews/formatter.js'
import { postReviewComment } from './commenter.js'

export async function handlePullRequestOpened(
  event: EmitterWebhookEvent<'pull_request.opened'>
) {
  const { payload } = event

  if (!payload.installation) {
    throw new Error('Missing installation in pull_request.opened webhook')
  }

  const installation = await upsertInstallation({
    githubId: BigInt(payload.installation.id),
    accountLogin: payload.repository.owner.login
  })

  const repository = await upsertRepository({
    githubId: BigInt(payload.repository.id),
    installationId: installation.id,
    fullName: payload.repository.full_name
  })

  await upsertPullRequest({
    githubId: BigInt(payload.pull_request.id),
    repoId: repository.id,
    number: payload.pull_request.number,
    title: payload.pull_request.title,
    author: payload.pull_request.user.login,
    url: payload.pull_request.html_url,
    state: payload.pull_request.state
  })

  console.log(`✓ PR #${payload.pull_request.number} saved to database`)

  const context = await buildAIReviewContext({
    installationId: payload.installation.id,
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    defaultBranch: payload.repository.default_branch,
    pullRequest: {
      number: payload.pull_request.number,
      title: payload.pull_request.title,
      author: payload.pull_request.user.login,
      url: payload.pull_request.html_url
    }
  })

  console.log(`✓ Fetched ${context.files.length} changed files`)
  console.log('\nCalling AI for review...')

  try {
    const provider = getAIProvider()
    const review = await provider.review(context)

    console.log('\n=== AI REVIEW ===')
    console.log(`Summary: ${review.summary}`)
    console.log(`Findings: ${review.findings.length}`)
    review.findings.forEach((finding) => {
      console.log(
        `  [${finding.severity.toUpperCase()}] ${finding.filename}: ${finding.description}`
      )
    })
    console.log('=================\n')

    const markdown = formatReviewAsMarkdown(review)

    const commentUrl = await postReviewComment({
      installationId: payload.installation.id,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pullNumber: payload.pull_request.number,
      body: markdown
    })

    console.log(`✓ Review posted to PR #${payload.pull_request.number}: ${commentUrl}`)
  } catch (error) {
    console.error('Review pipeline failed:', error)
    throw error
  }
}
