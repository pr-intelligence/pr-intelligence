import type { AIReviewContext } from './context.js'
import { getPullRequestFiles } from '../github/pullRequests.js'

export async function buildAIReviewContext(params: {
  installationId: number
  owner: string
  repo: string
  defaultBranch: string
  pullRequest: {
    number: number
    title: string
    author: string
    url: string
  }
}): Promise<AIReviewContext> {
  const files = await getPullRequestFiles(
    params.installationId,
    params.owner,
    params.repo,
    params.pullRequest.number
  )

  return {
    repository: {
      fullName: `${params.owner}/${params.repo}`,
      defaultBranch: params.defaultBranch
    },
    pullRequest: params.pullRequest,
    files
  }
}
