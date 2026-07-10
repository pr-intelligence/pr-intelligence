import { App } from '@octokit/app'
import { readFileSync } from 'fs'

let app: App | null = null

function getApp(): App {
  if (app) return app

  const appId = process.env.GITHUB_APP_ID
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH

  if (!appId) {
    throw new Error('Missing GITHUB_APP_ID environment variable')
  }

  if (!privateKeyPath) {
    throw new Error('Missing GITHUB_PRIVATE_KEY_PATH environment variable')
  }

  const privateKey = readFileSync(privateKeyPath, 'utf8')

  app = new App({ appId, privateKey })

  return app
}

export async function getInstallationOctokit(installationId: number) {
  const app = getApp()
  return app.getInstallationOctokit(installationId)
}
