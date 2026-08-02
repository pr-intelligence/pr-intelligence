import type { EmitterWebhookEvent } from '@octokit/webhooks'
import { upsertInstallation, upsertRepository, upsertPullRequest, saveReview, updateReviewCommentUrl } from '../database/repository.js'
import { buildAIReviewContext } from '../reviews/contextBuilder.js'
import { getAIProvider, getProviderName } from '../ai/index.js'
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

  const pullRequest = await upsertPullRequest({
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

    const savedReview = await saveReview({
      pullRequestId: pullRequest.id,
      summary: review.summary,
      findings: review.findings,
      provider: getProviderName()
    })

    console.log(`✓ Review saved to database (id: ${savedReview.id})`)

    const markdown = formatReviewAsMarkdown(review)

    const commentUrl = await postReviewComment({
      installationId: payload.installation.id,
      owner: payload.repository.owner.login,
      repo: payload.repository.name,
      pullNumber: payload.pull_request.number,
      body: markdown
    })

    await updateReviewCommentUrl(savedReview.id, commentUrl)

    console.log(`✓ Review posted to PR #${payload.pull_request.number}: ${commentUrl}`)
  } catch (error) {
    console.error('Review pipeline failed:', error)
    throw error
  }
}
