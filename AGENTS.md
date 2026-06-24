# Eve Horizon Starter - Agent Instructions

This is an Eve-compatible starter project. Agents working in this repo should follow these guidelines.

## CRITICAL: Load Eve Docs Skill First

Before doing any work, load the **eve-read-eve-docs** skill. It is the public, distilled source of Eve Horizon system docs (CLI, manifest, pipelines, jobs, secrets) and is required when private docs are unavailable.

```bash
skill read eve-read-eve-docs
```

Then review the CLI quick reference:

```bash
cat .agent/skills/eve-read-eve-docs/references/cli.md
```

This ensures CLI usage, `--repo-dir`, and deploy flows are current before editing anything.


## Default Environment (Staging)

Default to **staging** for usage guidance and deployments. Use local/docker only when explicitly asked to do local development.

Set the API URL for all CLI commands:

```bash
export EVE_API_URL=https://api.eve.example.com
```

## Project Overview

- **Purpose**: Minimal starter template for Eve-compatible projects
- **Stack**: Staging-first Eve Horizon with Docker Compose for local dev
- **Skills**: eve-se skillpack installed via `eve init` or `eve skills install`

Local dev runs via Docker Compose and is then translated into `.eve/manifest.yaml` for deployment to the remote staging cluster.

## Key Files

| File | Purpose |
|------|---------|
| `.eve/manifest.yaml` | Deployment configuration (services, envs) |
| `skills.txt` | Skill sources for agents |
| `.eve/hooks/on-clone.sh` | Auto-installs skills when Eve workers clone |
| `apps/api/` | Example API service |

## Common Tasks

### Local dev (Docker Compose)
```bash
docker compose up --build   # http://localhost:3000
```

### Deploy to environments

**Via pipeline** (recommended for CI/CD):
```bash
eve pipeline run ci-cd-main --env staging
```

**Direct deployment** (requires explicit git ref):
```bash
# Deploy to test environment with git SHA or ref resolved against --repo-dir
eve env deploy test --ref 0123456789abcdef0123456789abcdef01234567
eve env deploy test --ref main --repo-dir .

# Deploy to staging with git SHA or ref resolved against --repo-dir
eve env deploy staging --ref 0123456789abcdef0123456789abcdef01234567
eve env deploy staging --ref main --repo-dir .
```

**Note**: The `--ref` parameter is required and must be a 40-character SHA, or a ref resolved against `--repo-dir`/cwd.

### Inspect builds
```bash
eve build list                    # List builds for current project
eve build show <build_id>         # Build spec details
eve build artifacts <build_id>    # Image digests produced
eve build diagnose <build_id>     # Full diagnostic (spec + runs + artifacts + logs)
eve build logs <build_id>         # Build output logs
```

### Promotion flow (test → staging)
```bash
# 1. Build and deploy to test
eve env deploy test --ref 0123456789abcdef0123456789abcdef01234567

# 2. Get release information
eve release resolve v1.2.3

# 3. Promote to staging with release reference
eve env deploy staging --ref 0123456789abcdef0123456789abcdef01234567 --inputs '{"release_id":"rel_xxx"}'
```

### Check deployment
```bash
eve env show proj_xxx staging
```

### Add a new service
1. Add Dockerfile in `apps/<name>/`
2. Add service to `.eve/manifest.yaml`
3. Deploy: `eve env deploy staging --ref main --repo-dir .` or `eve pipeline run ci-cd-main --env staging`

## Skills Available

Skills are installed automatically by `eve init`. Key skills:
- **eve-bootstrap** - Onboarding, access request, and project setup (recommended)
- **eve-new-project-setup** - Legacy setup flow
- **eve-manifest-authoring** - Manifest editing guidance
- **eve-deploy-debugging** - Troubleshoot deployments
- **eve-pipelines-workflows** - CI/CD configuration
- **eve-job-lifecycle** - Create and manage Eve jobs

Browse `.agent/skills` to see installed skills, then load with `skill read <skill-name>`.

## Development Workflow

1. Make changes to code
2. Test locally: `docker compose up --build`
3. Deploy: `eve env deploy staging --ref main --repo-dir .` (or use `eve pipeline run ci-cd-main --env staging`)
4. Verify: `eve env show proj_xxx staging`

## Keep AGENTS.md Current (Critical)

This file must be rewritten to match the actual product domain and tech stack once the user decides what they are building. The starter API/UI is disposable: expect to replace or remove it entirely. When the real project direction is chosen, document:

- The domain and core product goals.
- The chosen stack and architecture.
- What starter code was removed or replaced, and what (if anything) was kept.
- The new local dev and deploy workflow.

<skills_system priority="1">

## Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
When users ask you to perform tasks, check if any of the available skills below can help complete the task more effectively. Skills provide specialized capabilities and domain knowledge.

How to use skills:
- Invoke: Bash("skill read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>eve-auth-and-secrets</name>
<description>Authenticate with Eve and manage project secrets for deployments and workflows.</description>
<location>project</location>
</skill>

<skill>
<name>eve-cli-primitives</name>
<description>Core Eve CLI primitives and capabilities for app developers. Use as the quick reference for commands and flows.</description>
<location>project</location>
</skill>

<skill>
<name>eve-deploy-debugging</name>
<description>Deploy and debug Eve-compatible apps via the CLI, with a focus on staging environments.</description>
<location>project</location>
</skill>

<skill>
<name>eve-job-debugging</name>
<description>Monitor and debug Eve jobs with CLI follow, logs, wait, and diagnose commands. Use when work is stuck, failing, or you need fast status.</description>
<location>project</location>
</skill>

<skill>
<name>eve-job-lifecycle</name>
<description>Create, manage, and review Eve jobs, phases, and dependencies. Use when running knowledge work in Eve or structuring job hierarchies.</description>
<location>project</location>
</skill>

<skill>
<name>eve-local-dev-loop</name>
<description>Local Docker Compose development loop for Eve-compatible apps, with handoff to staging deploys.</description>
<location>project</location>
</skill>

<skill>
<name>eve-manifest-authoring</name>
<description>Author and maintain Eve manifest files (.eve/manifest.yaml) for services, environments, pipelines, workflows, and secret interpolation. Use when changing deployment shape or runtime configuration in an Eve-compatible repo.</description>
<location>project</location>
</skill>

<skill>
<name>eve-new-project-setup</name>
<description>Configure a new Eve Horizon project after running eve init (profile, auth, manifest, and repo linkage).</description>
<location>project</location>
</skill>

<skill>
<name>eve-orchestration</name>
<description>Orchestrate jobs via depth propagation, parallel decomposition, relations, and control signals</description>
<location>project</location>
</skill>

<skill>
<name>eve-pipelines-workflows</name>
<description>Define and run Eve pipelines and workflows via manifest and CLI. Use when wiring build, release, deploy flows or invoking workflow jobs.</description>
<location>project</location>
</skill>

<skill>
<name>eve-plan-implementation</name>
<description>Execute software engineering plan documents using Eve jobs, dependencies, and review gating.</description>
<location>project</location>
</skill>

<skill>
<name>eve-project-bootstrap</name>
<description>Bootstrap an Eve-compatible project with org/project setup, profile defaults, repo linkage, and first deploy.</description>
<location>project</location>
</skill>

<skill>
<name>eve-read-eve-docs</name>
<description>Load first. Index of distilled Eve Horizon system docs for CLI usage, manifests, pipelines, jobs, secrets, and debugging.</description>
<location>project</location>
</skill>

<skill>
<name>eve-repo-upkeep</name>
<description>Keep Eve-compatible repos aligned with platform best practices and current manifest conventions.</description>
<location>project</location>
</skill>

<skill>
<name>eve-se-index</name>
<description>Load this first. Routes to the right Eve SE skill for developing, deploying, and debugging Eve-compatible apps.</description>
<location>project</location>
</skill>

<skill>
<name>eve-skill-distillation</name>
<description>Distill repeated work into Eve skillpacks by creating or updating skills with concise instructions and references. Use when a workflow repeats or knowledge should be shared across agents.</description>
<location>project</location>
</skill>

<skill>
<name>eve-troubleshooting</name>
<description>Troubleshoot common Eve deploy and job failures using CLI-first diagnostics.</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>
