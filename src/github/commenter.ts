import { getClient } from './client.js'

export async function postReviewComment(params: {
  installationId: number
  owner: string
  repo: string
  pullNumber: number
  body: string
}): Promise<string> {
  const octokit = await getClient(params.installationId)

  const response = await octokit.request('POST /repos/{owner}/{repo}/issues/{issue_number}/comments', {
    owner: params.owner,
    repo: params.repo,
    issue_number: params.pullNumber,
    body: params.body
  })

  return response.data.html_url
}
