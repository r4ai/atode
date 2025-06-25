# CLAUDE.md

repo: https://github.com/r4ai/atode

**CRITICAL**:

- Always search web for latest info before ANY implementation/library changes.
- When encountering issues, SEARCH THE WEB FIRST. DO NOT TRUST YOUR MEMORY.
- Follow TDD (Test-Driven Development) principles: WRITE TESTS FIRST, then implement code.

## Project Overview

Monorepo TODO app: Vite + React + TanStack Router + shadcn/ui frontend, Hono + PostgreSQL + Drizzle backend, Docker Compose deployment, Bun workspaces.

## Commands

```bash
bun run dev                  # Start both frontend and backend
bun run build                # Build all packages
bun run test                 # Run all tests
bun run typecheck            # TypeScript checking
bun run check:write          # Biome lint/format fix
```

## Architecture

### Backend

Backend uses clean architecture with three main layers:

- `domain/` - Pure business logic (entities, repositories, use-cases)
- `infrastructure/` - External integrations (database, repositories)
- `presentation/` - HTTP layer (routes, schema, dependencies)

Each layer depends as follows: infrastructure -> domain <- presentation

File naming: `name.ts`, `name.mock.ts`, `name.unit.test.ts`, `name.integration.test.ts`

### Frontend

Frontend uses Vite + React with TanStack Router and shadcn/ui components.

Co-location is RECOMMENDED: keep related files together in the same directory.

```
routes/
├── -components/ // 👈🏼 ignored
```

## Code Quality

- Always use Bun commands, never npm/npx (use `bun x` instead of `npx`)
- Implement unit/integration tests for all features
- **Verification**: Always run following commands in root dir:
  - `bun run typecheck`
  - `bun run check:write`
  - `bun run test`

### Code Style

- **Functional Programming**: Prefer pure functions over classes
  - ✅ `export const createUser = (deps, data) => { ... }`
  - ❌ `class UserService { createUser(data) { ... } }`
- **Functions**: Use arrow functions with implicit returns when possible
  - ✅ `const handleClick = () => "clicked"`
  - ❌ `function handleClick() { return "clicked"; }`
- **Types**: Prefer `type` over `interface`
  - ✅ `type User = { name: string; age: number; }`
  - ❌ `interface User { name: string; age: number; }`
- **File naming**: Use kebab-case for all filenames
  - ✅ `my-component.tsx`, `my-context.tsx`
  - ❌ `MyComponent.tsx`, `my_context.tsx`
- **Null coalescing**: Use `??` instead of `||` for null/undefined checks
  - ✅ `const port = process.env.PORT ?? "3000"`
  - ❌ `const port = process.env.PORT || "3000"`
- **Imports**: Use `@/` path aliases instead of relative imports
  - ✅ `import { component } from "@/components/ui/button"`
  - ❌ `import { component } from "../../components/ui/button"`
