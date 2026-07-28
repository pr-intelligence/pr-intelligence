export type ChangedFile = {
  filename: string
  status: string
  additions: number
  deletions: number
  patch: string | undefined
}

export type AIReviewContext = {
  repository: {
    fullName: string
    defaultBranch: string
  }
  pullRequest: {
    number: number
    title: string
    author: string
    url: string
  }
  files: ChangedFile[]
}
