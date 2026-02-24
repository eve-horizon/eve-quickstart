# Eve Horizon Starter

Build self-healing, self-improving applications with **Eve Horizon** — the agentic-native PaaS.

This template gets you started in 5 minutes. One command, AI configures everything.

## Quick Start

### Default Environment (Staging)

By default, use **staging** for guidance and deploys. Local Docker development is optional and should be used only when explicitly requested.

Set your CLI to staging:

```bash
export EVE_API_URL=https://api.eh1.incept5.dev
```

### 1. Initialize Your Project

```bash
# Install the Eve CLI
npm install -g @eve-horizon/cli

# Create a new project from this template
eve init my-project
cd my-project
```

This downloads the template, sets up a fresh git repo, and installs skills.

### 2. Start Your AI Agent

Open the project in Claude Code, Cursor, or your preferred AI coding agent:

```bash
claude  # or cursor, etc.
```

### 3. Load Eve Docs Skill (Critical)

Ask your AI agent:

> "Run the eve-read-eve-docs skill"

This loads the public, distilled Eve Horizon system docs (CLI, manifest, pipelines, jobs, secrets).

### 4. Run Setup

Ask your AI agent:

> "Run the eve-bootstrap skill"

The AI will:
- Set up your profile for the staging environment
- Authenticate you (using your GitHub SSH key)
- Configure your project manifest
- Help you set up your own Git remote

**That's it!** Your project is ready to use Eve Horizon.

### Alternative: Clone Directly

If you prefer to clone this repo directly instead of using `eve init`:

```bash
git clone https://github.com/Incept5/eve-horizon-starter my-project
cd my-project

# Remove template history and start fresh
rm -rf .git
git init
git add -A
git commit -m "Initial commit"

# Install CLI and skills
npm install -g @eve-horizon/cli
eve skills install
```

---

## What Is Eve Horizon?

**Agentic-Native PaaS** — A platform for building and deploying self-healing, self-improving applications.

| Capability | What It Means |
|------------|---------------|
| **Self-healing apps** | AI agents monitor, diagnose, and fix issues automatically |
| **Self-improving systems** | Continuous optimization through agent-driven feedback loops |
| **Native agentic apps** | Build apps where AI agents are first-class runtime components |
| **Agent-first API** | Claude, Codex, and custom agents use the same API as humans |

## Project Structure

```
my-project/
├── .eve/
│   ├── manifest.yaml    # Eve project configuration
│   └── hooks/on-clone.sh
├── apps/api/            # Example API service
├── db/migrations/       # Database migrations
├── skills.txt           # Skillpack references
├── AGENTS.md            # Agent instructions (universal)
├── CLAUDE.md            # Claude Code redirect
└── README.md
```

## Customize This Starter (Read First)

This repo is a starting point. Once you pick your real domain and tech stack, treat the sample API/UI as disposable and replace it. The source of truth for how agents should work is `AGENTS.md`—keep it updated as the project evolves.

Local development is intended to run via Docker Compose, and then be transposed into `.eve/manifest.yaml` for deployment to a remote Eve cluster (staging by default).

## Database

The starter uses Postgres for persistent storage. `docker compose up --build` starts Postgres, runs migrations via [eve-migrate](https://github.com/Incept5/eve-migrate), then starts the API.

Migrations live in `db/migrations/` as timestamped SQL files.

For direct local development (without Docker Compose), set:

```bash
export DATABASE_URL=postgres://app:app@localhost:5432/eve_starter
```

On Eve, the managed database URL is injected automatically via `${managed.db.url}`.

## API Overview

The starter API exposes a minimal todos service:

```bash
GET    /health
GET    /todos
POST   /todos
GET    /todos/:id
PATCH  /todos/:id
DELETE /todos/:id
```

OpenAPI is served at:

```bash
GET /openapi.json
```

The React + Tailwind UI is served from the same container at:

```bash
GET /
```

## Common Commands

After setup, you can use these commands:

```bash
# Check auth status
eve auth status

# Sync your Claude/Codex OAuth tokens to Eve
eve auth sync

# Import secrets from a file (org/user/project scope)
cp secrets.env.example secrets.env
eve secrets import --org org_xxx --file ./secrets.env

# Run locally (Postgres + migrations + API)
docker compose up --build

# Run API directly (requires local Postgres on 5432)
DATABASE_URL=postgres://app:app@localhost:5432/eve_starter node apps/api/index.js

# Deploy to environments (requires --ref with 40-char SHA or ref resolved against --repo-dir)
eve env deploy sandbox --ref main --repo-dir .
eve env deploy staging --ref 0123456789abcdef0123456789abcdef01234567

# Run the CI/CD pipeline (staging)
eve pipeline run ci-cd-main --env staging

# Validate required secrets and remediation hints
eve project sync --validate-secrets

# Create a job
eve job create --description "Review the codebase and suggest improvements"

# List your jobs
eve job list

# Check job status
eve job show <job-id>
```

## Harness Auth Quick Reference

Pick the harness you want to use, then set the matching API key(s).
Recommended: store keys at **org** scope so all projects can use them.

| Harness | Required secret(s) |
|---------|--------------------|
| `mclaude` / `claude` | `ANTHROPIC_API_KEY` (preferred) or Claude OAuth via `eve auth sync` |
| `code` / `codex` | `OPENAI_API_KEY` (preferred) or Codex OAuth via `eve auth sync` |
| `zai` | `Z_AI_API_KEY` |
| `gemini` | `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) |

### Using Your Existing Claude/Codex Subscription

If you have Claude Code or Codex CLI installed and logged in, Eve can use your existing OAuth tokens:

```bash
# Check what local credentials are available
eve auth creds

# Sync your local OAuth tokens to Eve (defaults to user-level)
eve auth sync                     # User-level (default)
eve auth sync --org org_xxx       # Org-level
eve auth sync --project proj_xxx  # Project-level
```

### Using API Keys

```bash
# Batch import (edit secrets.env first)
cp secrets.env.example secrets.env
eve secrets import --org org_xxx --file ./secrets.env

# Or set individually
eve secrets set ANTHROPIC_API_KEY "..." --org org_xxx
```

## Builds

Eve Horizon treats builds as first-class primitives, creating tracked records for every build:

- **Automatic in pipelines**: Builds happen automatically when deploying via pipelines
- **Tracked artifacts**: Each build creates records with image digests for reproducibility
- **Inspect builds**: Use `eve build list`, `eve build show <build_id>`, or `eve build diagnose <build_id>`
- **Promotion guarantee**: Build artifacts ensure identical images across environments (sandbox → staging → production)

```bash
# List all builds for the current project
eve build list

# View build details and status
eve build show <build_id>

# See image digests produced by a build
eve build artifacts <build_id>

# Full diagnostic (spec + runs + artifacts + logs)
eve build diagnose <build_id>

# View build output logs
eve build logs <build_id>
```

## Deployment & Promotion Flow

The manifest configures pipelines for automated deployments. You can also deploy directly:

### Direct Deployment

Deploy to an environment using `eve env deploy` (requires `--ref` with a 40-character SHA or a ref resolved against `--repo-dir`/cwd):

```bash
# Deploy to sandbox
eve env deploy sandbox --ref main --repo-dir .
eve env deploy sandbox --ref 0123456789abcdef0123456789abcdef01234567

# Deploy to staging
eve env deploy staging --ref main --repo-dir .
eve env deploy staging --ref 0123456789abcdef0123456789abcdef01234567
```

**Note**: The `--ref` parameter is required and must be a 40-character SHA, or a ref resolved against `--repo-dir`/cwd.

### Promotion Flow (sandbox → staging)

The typical promotion workflow when using pipelines:

```bash
# 1. Build and deploy to sandbox environment
eve env deploy sandbox --ref 0123456789abcdef0123456789abcdef01234567

# 2. Get release information after build
eve release resolve v1.2.3

# 3. Promote to staging with the same ref and release ID
eve env deploy staging --ref 0123456789abcdef0123456789abcdef01234567 --inputs '{"release_id":"rel_xxx"}'
```

This pattern allows you to build once in sandbox, then promote the same artifacts to staging.

## Next Steps

1. **Push to your repo**: `git push -u origin main`
2. **Sync OAuth tokens**: `eve auth sync` (uses your Claude/Codex subscriptions)
3. **Create your first job**: `eve job create --description "Hello Eve!"`
4. **Add secrets**: `eve secrets set MY_API_KEY "value"` (or `cp secrets.env.example secrets.env` + `eve secrets import --file ./secrets.env`)

## Manual Setup

If you prefer to set up manually instead of using the AI skill:

### Install CLI

```bash
npm install -g @eve-horizon/cli
```

### Create Profile

```bash
eve profile create staging --api-url https://api.eh1.incept5.dev
eve profile set staging --default-email your@email.com
```

### Authenticate

```bash
# Check if bootstrap window is open (first-time setup)
eve auth bootstrap --status

# If open, bootstrap yourself as first admin
eve auth bootstrap --email your@email.com

# Or login if you've been invited
eve auth login
```

### Configure Manifest

Edit `.eve/manifest.yaml`:

```yaml
schema: eve/compose/v2
project: my-project
services:
  api:
    build:
      context: apps/api
```

## Troubleshooting

### "eve: command not found"

Install the CLI: `npm install -g @eve-horizon/cli`

### "Not authenticated"

Run `eve auth login` or check `eve auth bootstrap --status` if you're the first user.

### "No registered SSH key"

The CLI will offer to fetch your keys from GitHub. Or manually register:
```bash
eve admin invite --email your@email.com --github yourusername
```

## Documentation

- [Eve Horizon Docs](https://github.com/Incept5/eve-horizon/tree/main/docs)
- [Eve Skills](https://github.com/Incept5/eve-skillpacks)

## License

MIT
