# openspec — AI Development Template

A reusable base template for AI-assisted development with Claude Code. Includes specs, agents, and commands for NestJS backends, Next.js frontends, and React Native mobile apps.

## Stack

| Layer | Technology |
|---|---|
| Backend | NestJS v10+ · TypeScript (strict) · Node.js 24 · tsc · DynamoDB |
| Frontend | Next.js (App Router) · TypeScript (strict) · Tailwind CSS |
| Mobile | React Native · Expo · TypeScript (strict) · NativeWind · Expo Router |
| Testing | Jest · @nestjs/testing · React Testing Library · React Native Testing Library · Playwright |

## What's included

```
.claude/
└── commands/                     # Slash commands — auto-recognized by Claude Code on clone
    ├── commit.md
    ├── develop-backend.md
    ├── develop-frontend.md
    ├── plan-backend-ticket.md
    ├── plan-frontend-ticket.md
    ├── enrich-us.md
    ├── explain.md
    ├── meta-prompt.md
    └── update-docs.md

openspec/
├── config.yaml                   # AI context: stack, conventions, rules
├── specs/
│   ├── base-standards.mdc        # Core principles for all agents
│   ├── backend-standards.mdc     # NestJS DDD architecture, DynamoDB, testing
│   ├── frontend-standards.mdc    # Next.js App Router, Tailwind, components
│   ├── documentation-standards.mdc
│   ├── api-spec.yml              # OpenAPI 3.0 template
│   ├── data-model.md             # DynamoDB single-table design template
│   └── development_guide.md      # Setup and deploy guide
├── .agents/
│   ├── backend-developer.md      # Plans backend features (NestJS + DDD)
│   ├── frontend-developer.md     # Plans frontend features (Next.js + Tailwind)
│   ├── mobile-developer.md       # Plans mobile features (React Native + Expo)
│   └── product-strategy-analyst.md
└── .commands/                    # Full command definitions (referenced by .claude/commands/)
    ├── plan-backend-ticket.md
    ├── plan-frontend-ticket.md
    ├── develop-backend.md
    ├── develop-frontend.md
    ├── commit.md
    ├── enrich-us.md
    ├── explain.md
    ├── meta-prompt.md
    └── update-docs.md
```

## Commands

Available as slash commands in Claude Code. Recognized automatically on clone.

| Command | Usage | Description |
|---|---|---|
| `/enrich-us` | `/enrich-us TICKET-123` | Enrich a user story with technical detail so a developer can work autonomously |
| `/plan-backend-ticket` | `/plan-backend-ticket TICKET-123` | Generate a step-by-step NestJS backend implementation plan |
| `/plan-frontend-ticket` | `/plan-frontend-ticket TICKET-123` | Generate a step-by-step Next.js frontend implementation plan |
| `/develop-backend` | `/develop-backend TICKET-123` | Implement a backend ticket end-to-end following NestJS DDD patterns + TDD |
| `/develop-frontend` | `/develop-frontend TICKET-123` | Implement a frontend ticket end-to-end following Next.js App Router patterns + TDD |
| `/commit` | `/commit` or `/commit TICKET-123` | Stage, commit (Conventional Commits), and open a PR |
| `/update-docs` | `/update-docs` | Update documentation to reflect recent code changes |
| `/explain` | `/explain "concept"` | Explain a concept in depth for skill acquisition |
| `/meta-prompt` | `/meta-prompt "rough prompt"` | Rewrite a vague prompt applying prompt engineering best practices |

### Typical workflow

```
/enrich-us TICKET-123            → refine the story with technical detail
/plan-backend-ticket TICKET-123  → generate step-by-step implementation plan
/develop-backend TICKET-123      → implement following the plan (TDD)
/commit TICKET-123               → conventional commit + open PR
```

Plans are saved to `openspec/changes/`.

## Agents

Sub-agents invoked automatically by commands or explicitly by Claude Code.

| Agent | Description |
|---|---|
| `backend-developer` | Plans NestJS features: controllers, services, DTOs, DynamoDB repositories, modules |
| `frontend-developer` | Plans Next.js features: Server/Client Components, API services, hooks, Tailwind |
| `mobile-developer` | Plans React Native features: Expo Router screens, components, hooks, NativeWind |
| `product-strategy-analyst` | Analyzes product ideas: use cases, personas, value propositions, MVP scope |

## Architecture

### Backend (NestJS DDD modules)

```
src/
├── modules/{feature}/
│   ├── dto/                  # Request + response DTOs (class-validator)
│   ├── {feature}.controller.ts   # Thin entry point — no business logic
│   ├── {feature}.service.ts      # Orchestration — NestJS HTTP exceptions
│   └── {feature}.module.ts       # Wires controller, service, repository
├── domain/
│   ├── models/               # Entities — zero NestJS or AWS imports
│   └── repositories/         # Interfaces + Symbol injection tokens
└── infrastructure/dynamodb/  # AWS SDK v3, DynamoDBDocumentClient
```

### Frontend (Next.js App Router)

```
app/[route]/page.tsx      # Server Component — async, fetches data directly
components/ui/            # Primitive presentational components
components/[feature]/     # Feature-specific components
lib/api/                  # API service modules — all fetch calls go here
hooks/                    # Client-side custom hooks
types/                    # Shared TypeScript interfaces
```

### Mobile (React Native + Expo)

```
app/                      # Expo Router file-based navigation
├── _layout.tsx           # Root layout — providers, fonts, splash
├── (tabs)/               # Bottom-tab screens
└── (stack)/              # Stack screens (detail views)
components/ui/            # Atomic components (NativeWind)
components/[feature]/     # Feature-specific components
hooks/                    # Custom hooks (wrap lib/api/ calls)
lib/api/                  # API service modules
types/                    # Shared TypeScript interfaces
```

## Standards

- **TDD** — failing test first, always
- **Coverage** — 90% minimum (branches, functions, lines, statements)
- **TypeScript** — strict mode, no `any`
- **Commits** — Conventional Commits (`feat(scope): description`)
- **Branches** — `feature/[ticket-id]-backend` / `feature/[ticket-id]-frontend`
- **Language** — English only (code, docs, commits, tests)

## Setup

```bash
# Copy into your project
cp -r openspec/ your-project/
cp CLAUDE.md your-project/
cp -r .claude/ your-project/
```

| File | What to update |
|---|---|
| `CLAUDE.md` | Section 3 — adjust stacks to your project |
| `openspec/config.yaml` | Stack context and conventions |
| `openspec/specs/api-spec.yml` | Your API endpoints |
| `openspec/specs/data-model.md` | Your DynamoDB schema |
| `openspec/specs/development_guide.md` | Your setup and deploy steps |

## Requirements

- [Claude Code](https://claude.ai/code)
- Node.js 24+
- GitHub CLI (`gh`)
