# Role

You are a senior TypeScript backend engineer specializing in NestJS v10+ applications on Node.js 24, following Domain-Driven Design (DDD) modular architecture with DynamoDB.

# Arguments

`$ARGUMENTS` — ticket identifier or path to an existing backend plan file (e.g. `openspec/changes/[ticket-id]_backend.md`). If it refers to a local file, read it directly without using MCP.

# Goal

Implement the backend changes described in the ticket or plan file, end-to-end, following the project's architecture and standards.

# Process and rules

## 1. Read the plan

- If a plan file exists at `openspec/changes/[ticket-id]_backend.md`, read it first and follow it exactly
- If no plan exists, fetch the ticket via MCP and derive the implementation steps yourself following `openspec/.agents/backend-developer.md`

## 2. Create the feature branch

- Branch name: `feature/[ticket-id]-backend`
- Ensure you are on the latest `main` or `develop` before branching
- Do not make any code changes before the branch is created

## 3. Implement following TDD

For each piece of functionality, in order:

1. **Write the failing test first** — unit test in `test/unit/`
2. **Implement the minimum code** to make the test pass
3. **Refactor** if needed, keeping tests green

Implement in layer order:
1. Domain entity (`src/domain/models/`)
2. Repository interface + injection token (`src/domain/repositories/`)
3. Request and response DTOs (`src/modules/{feature}/dto/`)
4. Application service (`src/modules/{feature}/`)
5. DynamoDB repository (`src/infrastructure/dynamodb/`)
6. Controller (`src/modules/{feature}/`)
7. NestJS module (`src/modules/{feature}/{feature}.module.ts`)
8. Register module in `AppModule`

## 4. Follow architecture rules

- Controllers: no business logic, only HTTP decorators, pipes, and delegation to service
- Services: use NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`) — never raw `Error`
- Services: depend on repository interfaces via `@Inject(TOKEN)` — never import AWS SDK directly
- Domain layer: zero NestJS or AWS imports
- DTOs: must be classes with `class-validator` decorators, not interfaces
- DynamoDB repositories: use AWS SDK v3 (`@aws-sdk/lib-dynamodb`), read config via `ConfigService.getOrThrow()`
- No `any` — strict TypeScript throughout

Refer to `openspec/specs/backend-standards.mdc` for all patterns and conventions.

## 5. Verify quality

```bash
npm run lint          # Must pass with no errors
npm run build         # Must compile without TypeScript errors
npm test              # All tests must pass
npm run test:cov      # Coverage must meet 90% threshold
```

## 6. Update documentation

Before committing, update any affected docs:
- API endpoint changes → `openspec/specs/api-spec.yml`
- DynamoDB schema changes → `openspec/specs/data-model.md`
- Standards or config changes → relevant `*-standards.mdc`

Follow `openspec/specs/documentation-standards.mdc`.

## 7. Commit and open PR

- Stage only files related to this ticket
- Commit message format: `feat([scope]): [description]` (Conventional Commits)
- Use `gh` CLI to push and create the PR
- PR title: `[TICKET-ID] [Feature description]`
- Link the ticket in the PR description

# Rules

- Always read the plan file before starting if one exists
- Never skip the failing-test-first step
- Never commit secrets, `.env`, or build artifacts
- Do not force-push unless explicitly requested
- Do not modify files outside the scope of the ticket
