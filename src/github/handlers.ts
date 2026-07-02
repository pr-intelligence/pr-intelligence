import type { EmitterWebhookEvent } from '@octokit/webhooks'

export async function handlePullRequestOpened(
  event: EmitterWebhookEvent<'pull_request.opened'>
) {
  const { payload } = event
  console.log('===== PR OPENED =====')
  console.log(`Repo:   ${payload.repository.full_name}`)
  console.log(`PR #${payload.pull_request.number}: ${payload.pull_request.title}`)
  console.log(`Author: ${payload.pull_request.user.login}`)
  console.log(`URL:    ${payload.pull_request.html_url}`)
  console.log('=====================')
}
