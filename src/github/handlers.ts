import type { EmitterWebhookEvent } from '@octokit/webhooks'
import { upsertInstallation, upsertRepository, upsertPullRequest } from '../database/repository.js'
import { buildAIReviewContext } from '../reviews/contextBuilder.js'

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

  console.log(`\n✓ PR #${context.pullRequest.number} saved to database`)
  console.log(`✓ Authenticated as installation ${payload.installation.id}`)
  console.log(`✓ Fetched ${context.files.length} changed files`)
  console.log('\nFiles changed:')
  context.files.forEach((file) => {
    console.log(`  - ${file.filename} (${file.status}, +${file.additions} -${file.deletions})`)
  })
  console.log('\nContext object ready for AI review.\n')
}
