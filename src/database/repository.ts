import type { Prisma } from '@prisma/client'
import type { ReviewFinding } from '../reviews/types.js'
import { prisma } from './client.js'

export async function upsertInstallation(data: {
  githubId: bigint
  accountLogin: string
}) {
  return prisma.installation.upsert({
    where: { githubId: data.githubId },
    update: { accountLogin: data.accountLogin },
    create: {
      githubId: data.githubId,
      accountLogin: data.accountLogin
    }
  })
}

export async function upsertRepository(data: {
  githubId: bigint
  installationId: number
  fullName: string
}) {
  return prisma.repository.upsert({
    where: { githubId: data.githubId },
    update: { fullName: data.fullName },
    create: {
      githubId: data.githubId,
      installationId: data.installationId,
      fullName: data.fullName
    }
  })
}

export async function upsertPullRequest(data: {
  githubId: bigint
  repoId: number
  number: number
  title: string
  author: string
  url: string
  state: string
}) {
  return prisma.pullRequest.upsert({
    where: { githubId: data.githubId },
    update: {
      title: data.title,
      state: data.state
    },
    create: {
      githubId: data.githubId,
      repoId: data.repoId,
      number: data.number,
      title: data.title,
      author: data.author,
      url: data.url,
      state: data.state
    }
  })
}

export async function saveReview(data: {
  pullRequestId: number
  summary: string
  findings: Prisma.InputJsonValue
  provider: string
}) {
  return prisma.review.create({
    data: {
      pullRequestId: data.pullRequestId,
      summary: data.summary,
      findings: data.findings,
      provider: data.provider
    }
  })
}

export async function updateReviewCommentUrl(
  reviewId: number,
  commentUrl: string
) {
  return prisma.review.update({
    where: { id: reviewId },
    data: { commentUrl }
  })
}
