# Role

You are an expert software architect with deep experience in NestJS v10+ applications on Node.js 24, applying Domain-Driven Design (DDD) with modular architecture (Domain, Application, Infrastructure, Presentation).

# Arguments

`$ARGUMENTS` — ticket identifier, ticket ID, or keywords. If it refers to a local file, read it directly without using MCP.

# Goal

Produce a step-by-step backend implementation plan for a ticket that is detailed enough for a developer to work end-to-end autonomously.

# Process and rules

1. Adopt the role defined in `openspec/.agents/backend-developer.md`
2. Fetch the ticket using the project management MCP. If `$ARGUMENTS` refers to a local file, read it directly
3. Propose a step-by-step plan for the backend, applying the standards in `openspec/specs`
4. Ensure the plan is complete enough that the developer needs no further clarification
5. Do not write implementation code — provide the plan only
6. If asked to start implementing, first move to the feature branch (Step 0) and follow `/develop-backend`

# Output format

Save the plan as a markdown document at `openspec/changes/[ticket-id]_backend.md`.

Use the following template:

---

## Template

### 1. Header
- Title: `# Backend Implementation Plan: [TICKET-ID] — [Feature Name]`

### 2. Overview
- Brief description of the feature
- Layers involved (Domain / Application / Infrastructure / Presentation)
- DDD and clean architecture principles applied

### 3. Architecture Context
- Files to create and files to modify
- Repository interfaces and injection tokens needed
- NestJS module wiring required
- Dependencies between components

### 4. Implementation Steps

#### Step 0: Create Feature Branch
- **Action**: Create and switch to the feature branch
- **Branch name**: `feature/[ticket-id]-backend`
- **Steps**:
  1. Ensure you are on the latest `main` or `develop`
  2. `git pull origin [base-branch]`
  3. `git checkout -b feature/[ticket-id]-backend`
- **Note**: This must be the FIRST step before any code changes

#### Step 1: Domain Layer
- **File**: `src/domain/models/[Entity].ts`
- **Action**: Define the entity class with invariants enforced in the constructor
- **Notes**: Zero NestJS or AWS imports

#### Step 2: Repository Interface
- **File**: `src/domain/repositories/I[Entity]Repository.ts`
- **Action**: Define the repository contract methods + co-located `Symbol` injection token
- **Notes**: `export const ENTITY_REPOSITORY = Symbol('IEntityRepository')`

#### Step 3: Request and Response DTOs
- **Files**: `src/modules/[feature]/dto/create-[entity].dto.ts`, `[entity]-response.dto.ts`
- **Action**: Define DTOs as classes with `class-validator` decorators
- **Notes**: Separate request DTOs from response DTOs; never expose domain entities

#### Step 4: Application Service
- **File**: `src/modules/[feature]/[feature].service.ts`
- **Action**: Orchestrate domain logic — inject repository via token, build entity, call repository, return response DTO
- **Notes**: Use NestJS HTTP exceptions (`NotFoundException`, `BadRequestException`) — never raw `Error`

#### Step 5: DynamoDB Repository
- **File**: `src/infrastructure/dynamodb/[entity].repository.ts`
- **Action**: Implement the repository interface using AWS SDK v3 + DynamoDBDocumentClient
- **Key design**: Specify PK/SK pattern (e.g. `ENTITY#<id>`)
- **Notes**: Read config via `ConfigService.getOrThrow()`

#### Step 6: Controller
- **File**: `src/modules/[feature]/[feature].controller.ts`
- **Action**: Declare routes with NestJS decorators, use built-in pipes for coercion, delegate to service
- **Notes**: No business logic — only HTTP plumbing and typed response DTOs

#### Step 7: NestJS Module
- **File**: `src/modules/[feature]/[feature].module.ts`
- **Action**: Wire controller, service, and repository binding (`{ provide: ENTITY_REPOSITORY, useClass: EntityRepository }`)

#### Step 8: Register in AppModule
- **File**: `src/app.module.ts`
- **Action**: Import the new feature module

#### Step 9: Unit Tests
- **Files**: `test/unit/modules/[feature]/[feature].service.spec.ts`, `[feature].controller.spec.ts`
- **Coverage required**: 90% branches, functions, lines, statements
- **Pattern**: Use `@nestjs/testing`, mock repositories with `jest.fn()`, follow AAA, `jest.clearAllMocks()` in `beforeEach`
- **Cases to cover**:
  - Successful path
  - Not found errors (if applicable)
  - Validation errors from domain
  - Infrastructure errors

#### Step 10: E2E Tests
- **File**: `test/e2e/[feature].e2e-spec.ts`
- **Action**: Test full HTTP request/response cycle using `supertest` against the NestJS app

#### Step N: Update Documentation
- **Action**: Review all changes and update affected docs
  - API changes → `openspec/specs/api-spec.yml`
  - Data model changes → `openspec/specs/data-model.md`
  - Standards/config changes → relevant `*-standards.mdc`
- Follow `openspec/specs/documentation-standards.mdc`
- **This step is MANDATORY** — do not skip it

---

### 5. Implementation Order
Numbered list from Step 0 (branch) to documentation update (always last)

### 6. Error Response Format
- JSON shape: `{ "error": "message" }`
- HTTP status code mapping for this feature (NestJS exception → status code)

### 7. Testing Checklist
- [ ] All happy-path cases covered
- [ ] All validation error cases covered
- [ ] Infrastructure errors handled
- [ ] Coverage threshold met (90%)
- [ ] Tests follow AAA pattern
- [ ] `jest.clearAllMocks()` in `beforeEach`

### 8. Dependencies
- New npm packages required (if any) with justification

### 9. Notes
- Business rules and constraints
- Assumptions made
- Anything the developer must know before starting

### 10. Implementation Verification
- [ ] Code follows NestJS DDD modular architecture
- [ ] No business logic in controllers
- [ ] Services throw NestJS HTTP exceptions, not raw `Error`
- [ ] Domain layer has zero NestJS or AWS imports
- [ ] DTOs are classes with `class-validator` decorators
- [ ] Repository interfaces use `Symbol` injection tokens
- [ ] TypeScript strict — no `any`
- [ ] All tests pass
- [ ] Documentation updated
