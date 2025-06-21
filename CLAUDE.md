# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Current Year: 2025** - Always consider this when searching for latest information and best practices.

## Project Overview

This is a monorepo TODO application built with:

- **Frontend**: Vite + React + TanStack Router + shadcn/ui
- **Backend**: Hono + PostgreSQL + Drizzle ORM
- **Deployment**: Docker Compose
- **Package Manager**: Bun with workspaces

## Monorepo Structure

```
todo/
├── package.json              # Root package.json with workspaces
├── packages/
│   ├── backend/             # Hono API server
│   └── frontend/            # React application
├── biome.json               # Shared Biome configuration
├── docker-compose.yml       # Docker services
└── CLAUDE.md               # This file
```

## Development Commands

### Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) and Docker Compose
- [Task](https://taskfile.dev/) task runner

**Install Task:**

```bash
# macOS/Linux (via script)
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin

# Go users
go install github.com/go-task/task/v3/cmd/task@latest
```

### Root Level (Monorepo)

```bash
bun install              # Install all dependencies
bun dev                  # Start both frontend and backend
bun build                # Build all packages
bun check                # Run Biome check on all packages
bun check:fix            # Fix Biome issues on all packages
bun test                 # Run tests on all packages

# Individual package commands
bun backend:dev          # Start only backend
bun frontend:dev         # Start only frontend
bun backend:build        # Build only backend
bun frontend:build       # Build only frontend
```

## Architecture

### Backend Structure (Functional & Pragmatic)

```
packages/backend/src/
├── domain/                  # Business Logic
│   ├── entities/            # Type definitions (User, Task, Project, Label)
│   ├── repositories/        # Repository interfaces
│   └── use-cases/           # Pure business functions
├── infrastructure/          # External Integrations
│   ├── database/            # Database configuration and schema
│   │   ├── connection.ts    # PostgreSQL connection
│   │   └── schema.ts        # Drizzle ORM schema
│   └── repositories/        # Database functions
├── presentation/            # HTTP Layer
│   ├── controllers/         # HTTP handler functions
│   ├── routes/              # Route definitions
│   ├── dependencies.ts      # Simple dependency composition for controllers
│   └── schema.ts            # Validation schemas
└── index.ts                 # Application entry point
```

**Functional Programming Principles:**

- **Pure Functions**: Business logic implemented as pure functions without side effects
- **Function Composition**: Dependencies passed as parameters instead of class injection
- **Immutability**: Data structures are immutable, functions return new values
- **No Classes**: Everything implemented as functions and type definitions
- **Simple Dependencies**: Plain object composition instead of complex DI containers
- **Pragmatic Structure**: Organized by feature/concern, not rigid architectural layers

## Development Standards

### Code Quality

- **CRITICAL - Always Search First**: Before ANY implementation, library installation, or code changes, ALWAYS search the web for the latest information about libraries, frameworks, and best practices to ensure up-to-date implementation. This is MANDATORY and must never be skipped.
- **When problems occur**: Do not force fixes immediately. Instead, analyze the current situation, search the web for related issues and solutions, then implement the proper fix
- **IMPORTANT**: Always use Bun commands, never npm or npx. Use `bun x` instead of `npx`
- **Web Search Required**: Every development task must begin with web search to verify current best practices, library versions, and implementation patterns
- Implement unit tests and integration tests for every new feature or implementation
- Use Storybook for frontend UI component development and quality assurance
- Run code quality checks with Biome after implementation
- **CRITICAL - Implementation Verification**: After completing any implementation, ALWAYS run and verify that all of the following pass without errors:
  - `bun run test` - All tests must pass
  - `bun run typecheck` - TypeScript type checking must pass on all packages
  - `bun run check:write` - Biome linting and formatting must pass

### Code Style

- **Commit messages**: Use conventional commits in English
  - ✅ `git commit -m "feat: add new feature"`
  - ❌ `git commit -m "●●の機能を追加した"`
- **Comments**: Write code comments in English
- **Functional Programming**: Prefer pure functions over classes
  - ✅ `export const createUser = (deps, data) => { ... }`
  - ❌ `class UserService { createUser(data) { ... } }`
- **Functions**: Use arrow functions with implicit returns when possible
  - ✅ `const handleClick = () => "clicked"`
  - ❌ `function handleClick() { return "clicked"; }`
- **Types**: Prefer `type` over `interface`
  - ✅ `type User = { name: string; age: number; }`
  - ❌ `interface User { name: string; age: number; }`
- **Exports**: Use named exports by default (avoid default exports unless necessary)
- **File naming**: Use kebab-case for all filenames
  - ✅ `my-component.tsx`, `my-context.tsx`
  - ❌ `MyComponent.tsx`, `my_context.tsx`
- **Null coalescing**: Use `??` instead of `||` for null/undefined checks
  - ✅ `const port = process.env.PORT ?? "3000"`
  - ❌ `const port = process.env.PORT || "3000"`
- **Runtime**: Use Bun directly for TypeScript execution (no tsx needed)
  - ✅ `bun --watch src/index.ts`
  - ❌ `tsx watch src/index.ts`

## Development Notes

- Uses Drizzle ORM for type-safe database operations
- CORS configured for both development (localhost:5173) and production (localhost:3001)
- Database migrations managed through Drizzle Kit
- TypeScript throughout with proper type inference from schema
