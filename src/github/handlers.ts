import type { EmitterWebhookEvent } from '@octokit/webhooks'
import { upsertInstallation, upsertRepository, upsertPullRequest } from '../database/repository.js'

export async function handlePullRequestOpened(
  event: EmitterWebhookEvent<'pull_request.opened'>
) {
  const { payload } = event

  if (!payload.installation) {
    throw new Error('Missing installation in pull_request.opened webhook')
  }

  const installation = await upsertInstallation({
    githubId: payload.installation.id,
    accountLogin: payload.repository.owner.login
  })

  const repository = await upsertRepository({
    githubId: payload.repository.id,
    installationId: installation.id,
    fullName: payload.repository.full_name
  })

  await upsertPullRequest({
    githubId: payload.pull_request.id,
    repoId: repository.id,
    number: payload.pull_request.number,
    title: payload.pull_request.title,
    author: payload.pull_request.user.login,
    url: payload.pull_request.html_url,
    state: payload.pull_request.state
  })

  console.log(`Saved PR #${payload.pull_request.number} from ${payload.repository.full_name}`)
}
