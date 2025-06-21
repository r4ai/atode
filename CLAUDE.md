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

### Backend (packages/backend)

```bash
cd packages/backend
bun install              # Install backend dependencies
bun run dev             # Start development server (tsx watch)
bun run build           # Build TypeScript to JavaScript
bun run start           # Run production build
bun run db:generate     # Generate Drizzle migrations
bun run db:migrate      # Run database migrations
bun run db:studio       # Open Drizzle Studio
```

### Frontend (packages/frontend)

```bash
cd packages/frontend
bun install             # Install frontend dependencies
bun run dev            # Start Vite development server
bun run build          # Build for production
```

### Docker

```bash
docker-compose up -d    # Start all services
docker-compose down     # Stop all services
```

## Architecture

### Backend Structure (packages/backend)

- **src/index.ts**: Main Hono server with middleware (CORS, logging)
- **src/db/**: Database configuration and schema
  - **schema.ts**: Drizzle ORM schema definition for todos table
  - **connection.ts**: PostgreSQL connection setup
  - **migrate.ts**: Migration runner
- **src/models/todo.ts**: TodoModel class with CRUD operations
- **src/routes/**: API route handlers (todos endpoints)

### Frontend Structure (packages/frontend)

- **src/**: React application source code
- **vite.config.ts**: Vite configuration
- **package.json**: Frontend dependencies and scripts

### Database Schema

The todos table uses UUID primary keys with:

- id (UUID, auto-generated)
- title (text, required)
- description (text, optional)
- completed (boolean, default false)
- createdAt/updatedAt (timestamps)

### API Endpoints

- GET /api/todos - List all todos
- POST /api/todos - Create new todo
- PUT /api/todos/:id - Update existing todo
- DELETE /api/todos/:id - Delete todo

## Configuration

### Environment Variables

- DATABASE_URL: PostgreSQL connection string (defaults to local development)
- PORT: Backend server port (defaults to 3000)
- NODE_ENV: Environment (affects CORS origins)

### Port Allocation

- Frontend: 3001 (production), 5173 (Vite dev)
- Backend: 3000
- PostgreSQL: 5432

## Development Standards

### Code Quality

- **CRITICAL - Always Search First**: Before ANY implementation, library installation, or code changes, ALWAYS search the web for the latest information about libraries, frameworks, and best practices to ensure up-to-date implementation. This is MANDATORY and must never be skipped.
- **When problems occur**: Do not force fixes immediately. Instead, analyze the current situation, search the web for related issues and solutions, then implement the proper fix
- **IMPORTANT**: Always use Bun commands, never npm or npx. Use `bun x` instead of `npx`
- **Web Search Required**: Every development task must begin with web search to verify current best practices, library versions, and implementation patterns
- Implement unit tests and integration tests for every new feature or implementation
- Use Storybook for frontend UI component development and quality assurance
- Run code quality checks with Biome after implementation

### Code Style

- Use `type` instead of `interface` for type definitions
- Use arrow functions instead of function declarations
- Use kebab-case for all file names
- Use named exports instead of default exports

### Testing Commands

```bash
# Root level (all packages)
bun test           # Run tests on all packages
bun typecheck      # Run TypeScript type checking on all packages
bun check          # Run Biome check on all packages
bun check:write    # Apply Biome fixes on all packages
bun format         # Check formatting on all packages
bun format:write   # Apply formatting on all packages
bun lint           # Run linter on all packages
bun lint:write     # Apply lint fixes on all packages

# Backend tests
cd packages/backend
bun run test        # Run unit tests
bun run test:integration  # Run integration tests

# Frontend tests and Storybook
cd packages/frontend
bun run test        # Run component tests
bun run storybook   # Start Storybook development server
bun run build-storybook  # Build Storybook
```

## Development Notes

- Uses Drizzle ORM for type-safe database operations
- CORS configured for both development (localhost:5173) and production (localhost:3001)
- Database migrations managed through Drizzle Kit
- TypeScript throughout with proper type inference from schema
