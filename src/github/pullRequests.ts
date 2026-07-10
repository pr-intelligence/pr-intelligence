import type { ChangedFile } from '../reviews/context.js'
import { getClient } from './client.js'

// TODO: implement pagination for PRs with more than 30 files
export async function getPullRequestFiles(
  installationId: number,
  owner: string,
  repo: string,
  pullNumber: number
): Promise<ChangedFile[]> {
  const octokit = await getClient(installationId)

  const { data: files } = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/files',
    {
      owner,
      repo,
      pull_number: pullNumber
    }
  )

  return files.map((file: {
    filename: string
    status: string
    additions: number
    deletions: number
    patch?: string
  }) => ({
    filename: file.filename,
    status: file.status,
    additions: file.additions,
    deletions: file.deletions,
    patch: file.patch
  }))
}
