import { getInstallationOctokit } from './auth.js'

export async function getClient(installationId: number) {
  return getInstallationOctokit(installationId)
}
