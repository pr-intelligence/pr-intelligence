# Changelog

## v0.2.0 - 2026-07-05

### Added
- Supabase PostgreSQL database
- Prisma ORM with repository layer
- Schema: installations, repositories, pull_requests
- BigInt support for GitHub IDs
- Webhook events persisted to database
- End-to-end GitHub → Database integration

## v0.1.0 - 2026-07-02

### Added
- GitHub App setup
- Fastify server with TypeScript
- Webhook signature verification (HMAC)
- Pull request opened event handling

## v0.3.0 - 2026-07-29

### Added
- GitHub App authentication using installation tokens
- PR diff retrieval from GitHub API
- AI review context builder
- AI provider abstraction layer (Mock, Ollama, OpenAI, Claude)
- Markdown formatter for review output
- Automatic AI review posted as GitHub PR comment
- Local inference support via Ollama (qwen2.5-coder:7b)
