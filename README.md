# PR Intelligence

> Reduce the time between opening a pull request and confidently merging it.

---

## Vision

AI coding tools have made writing code fast. But everything that happens after writing — review, testing, understanding — is still slow and manual.

PR Intelligence sits between "AI writes the code" and "code ships to production." When a pull request is opened, we generate a structured review that explains the change, highlights potential risks, and helps reviewers decide whether the PR is ready to merge.

PR Intelligence is designed to produce one concise review focused on the highest-value feedback.

---

## MVP Goal

A GitHub App that:

1. Receives a webhook when a pull request is opened
2. Starts from the pull request diff and retrieves only the additional context needed to understand the change
3. Posts one structured AI-generated review comment on the PR
4. Covers: what changed, what's risky, what needs attention

Nothing else. One comment that makes a developer say *"I would have missed that."*

---

## Non-goals (MVP)

The first version intentionally does not include:

- Dashboard
- Billing or payments
- Test generation
- Auto-merge
- Multi-platform support (GitLab, Bitbucket)
- Mutation testing
- Enterprise features

These will only be considered after the core PR review workflow has been validated with real users.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Backend | Fastify + TypeScript | Native TypeScript support, simple, modern |
| Database | Supabase (PostgreSQL) | Managed Postgres, free tier, zero DevOps |
| ORM | Prisma + Repository Layer | Type-safe queries, swap-friendly architecture |
| GitHub Integration | GitHub App | Fine-grained permissions, auto webhook setup |
| Human Auth | Deferred | Not needed until dashboard exists |
| AI | Claude API (abstraction layer) | Swappable provider, best code reasoning |
| Queue | None initially | Add BullMQ/Redis when real volume demands it |
| Hosting | Local (ngrok for webhooks) | Ship fast, deploy later |
| Testing | Vitest | Modern, fast, TypeScript-native |
| Linting | ESLint + Prettier | Standard, no debate needed |

---

## Project Structure

Folders are created only when code is first added to them.
Current structure reflects Milestone 1 only.

```
pr-intelligence/
├── src/
│   ├── github/        # GitHub App client, webhook verification
│   ├── routes/        # Fastify route handlers
│   └── types/         # Shared TypeScript types
├── tests/
├── .env.example
└── README.md
```

---

## How to Run

### Prerequisites

- Node.js 20+
- npm or pnpm
- ngrok (for local webhook testing)
- A GitHub account

### Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_ORG/pr-intelligence.git
cd pr-intelligence

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Fill in your GitHub App credentials in .env

# Start the dev server
npm run dev

# In a separate terminal, start ngrok
ngrok http 3000
# Copy the ngrok URL → paste it as your GitHub App webhook URL
```

### Environment Variables

Current milestone only. New variables are added when the milestone that requires them begins.

```env
# GitHub App
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=

# Server
PORT=3000
```

---

## Milestone Checklist

### Milestone 1 — Webhook Foundation
- [x] Create GitHub App with correct permissions
- [x] Set up Fastify server with TypeScript
- [x] Expose local server via ngrok
- [x] Receive webhook when PR is opened
- [x] Verify webhook signature (HMAC)
- [x] Log raw payload to console

### Milestone 2 — Data Layer
- [x] Connect Supabase (PostgreSQL) via Prisma
- [x] Define schema: installations, repositories, pull_requests
- [x] Parse webhook payload
- [x] Store PR metadata in database

### Milestone 3 — Diff Retrieval
- [ ] Authenticate GitHub API calls using App credentials
- [ ] Fetch PR diff from GitHub REST API
- [ ] Parse diff into per-file, per-function structure
- [ ] Log clean internal diff representation

### Milestone 4 — Diff Understanding
- [ ] Extract changed function bodies from diff
- [ ] Investigate heuristic approaches for probable downstream impact
- [ ] Produce a structured internal representation ready for AI

### Milestone 5 — First AI Comment
- [ ] Connect Claude API behind abstraction layer
- [ ] Send diff + context → receive structured review
- [ ] Post one comment back to the PR via GitHub API
- [ ] Collect feedback from developers to determine whether the generated review is genuinely useful

### Milestone 6 — Real User Testing
- [ ] Install on a real developer's repository (not our own)
- [ ] Collect structured feedback on comment quality
- [ ] Iterate on AI prompt based on real PR feedback
- [ ] Reach 10 developers who have seen a review comment

### Future (post-validation only)
- [ ] Test draft generation
- [ ] Mutation testing on changed functions
- [ ] Dashboard + human authentication
- [ ] Commercialization (pricing and billing after validation)
- [ ] Public launch

---

## Success Criteria

Milestone 1 is complete when:

- A GitHub App is installed on a test repository.
- Opening a Pull Request sends a webhook to the local server.
- The webhook signature is successfully verified.
- The payload is logged to the console.

Nothing else is required.

---

## Development Rules

1. **Build for the current milestone only.** No feature gets built before its milestone.
2. **One working thing per week.** A week that ends with nothing running is a failed week.
3. **Technology discussions are closed** unless they block the current milestone.
4. **Talk to a real developer every week** from Milestone 3 onward.
5. **The README is a living contract.** If the README and the code disagree, the README is wrong — update it immediately.

---

## Core Principle

> Don't build the system you think you'll need in six months.
> Build the system you need to deliver the next working milestone —
> cleanly enough that tomorrow's architecture can evolve from it.

---

**Version:** 0.1.0
**Status:** Milestone 1

---

## License

MIT
