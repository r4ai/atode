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

#### Development Cycle

Story driven development:

1. Create a minimum story with a minimum test
2. Implement the minimum component to pass the test (Debug with Playwright MCP)
3. Refactor and add more features (story first, then implementation)

- Component should be as SMALL as possible:
  - Big components should be split into smaller ones
- Components should be EASY TO TEST in ISOLATION
  - PRESENTER / CONTAINER pattern:
    - Presenter components: responsible for rendering UI and state management
    - Container components: responsible for data fetching

    ```
    task-list/
    ├── container.tsx          # fetches data, passes it to presenter
    ├── presenter.tsx          # renders UI based on props
    ├── presenter.stories.tsx  # story and tests for presenter
    ├── loading.tsx            # loading state component
    ├── loading.stories.tsx    # story and tests for loading
    └── index.ts               # exports all components
    ```

- Use shadcn/ui components and design tokens (colors) for consistent UI

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

### Git

- **Commit messages**: Use conventional commits
  - ✅ `feat: add new feature`, `fix: resolve issue`, `chore: update dependencies`
  - ❌ `added new feature`, `fixed issue`, `update dependencies`

Notes:

- Check git log BEFORE any git commands. DO NOT TRUST YOUR MEMORY.
- Use gh to interact with GitHub
