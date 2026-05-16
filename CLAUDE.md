---
description: Development rules and guidelines for this project. Applicable to all AI agents.
alwaysApply: true
---

## 1. Core Principles

- **Small tasks, one at a time**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Test-Driven Development**: Start with failing tests for any new functionality (TDD), according to the task details.
- **Type Safety**: All code must be fully typed. Use strict TypeScript.
- **Clear Naming**: Use clear, descriptive names for all variables and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences.
- **Pattern Detection**: Detect and highlight repeated code patterns.

## 2. Language Standards

- **English Only**: All technical artifacts must always use English, including:
  - Code (variables, functions, classes, comments, error messages, log messages)
  - Documentation (README, guides, API docs)
  - Data schemas and DynamoDB attribute names
  - Configuration files and scripts
  - Git commit messages
  - Test names and descriptions

## 3. Project Context

**Backend Stack**: NestJS v10+ · TypeScript (strict) · Node.js 24 · tsc · DynamoDB · Jest + @nestjs/testing

**Frontend Stack**: Next.js (App Router) · TypeScript (strict) · Tailwind CSS · Jest + React Testing Library · Playwright

**Mobile Stack**: React Native · Expo · TypeScript (strict) · NativeWind · Jest + React Native Testing Library

## 4. Specific Standards

For detailed standards refer to:

- [Backend Standards](./openspec/specs/backend-standards.mdc) — NestJS, Node.js 24, tsc, DynamoDB, DDD architecture, testing, error handling
- [Frontend Standards](./openspec/specs/frontend-standards.mdc) — Next.js App Router, Tailwind CSS, Server/Client Components, data fetching
- [Documentation Standards](./openspec/specs/documentation-standards.mdc) — docs structure and maintenance
- [API Spec](./openspec/specs/api-spec.yml) — OpenAPI 3.0 spec (source of truth for endpoints)
- [Data Model](./openspec/specs/data-model.md) — DynamoDB single-table design
- [Development Guide](./openspec/specs/development_guide.md) — setup and deployment instructions

## 5. Available Commands

These slash commands are available in this project. Full instructions are in `openspec/.commands/`.

| Command | Description |
|---|---|
| `/commit` | Stage, commit, and open a PR for current or scoped changes |
| `/develop-backend` | Implement a backend ticket end-to-end following NestJS DDD patterns |
| `/develop-frontend` | Implement a frontend ticket end-to-end following Next.js App Router patterns |
| `/plan-backend-ticket` | Generate a detailed backend implementation plan for a ticket |
| `/plan-frontend-ticket` | Generate a detailed frontend implementation plan for a ticket |
| `/enrich-us` | Enrich a user story with technical detail so a developer can work autonomously |
| `/explain` | Explain a concept in depth for skill acquisition, not just unblocking |
| `/meta-prompt` | Rewrite a vague prompt applying prompt engineering best practices |
| `/update-docs` | Update documentation to reflect recent code changes |

## 6. Available Agents

These sub-agents are available for specialized tasks. Full definitions are in `openspec/.agents/`.

| Agent | Trigger | Description |
|---|---|---|
| `backend-developer` | Planning or reviewing NestJS backend features | DDD modular architecture, NestJS v10+, DynamoDB |
| `frontend-developer` | Planning or reviewing Next.js frontend features | App Router, Server/Client Components, Tailwind CSS |
| `mobile-developer` | Planning or reviewing React Native mobile features | Expo, Expo Router, NativeWind, TypeScript |
| `product-strategy-analyst` | Analyzing product ideas or defining value propositions | Use cases, personas, MVP scope |
