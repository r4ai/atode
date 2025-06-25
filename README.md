# atode Application

A modern, full-stack atode application built with React, Hono, and PostgreSQL.

## Prerequisites

- [Bun](https://bun.sh/) (latest version)
- [Docker](https://www.docker.com/) and Docker Compose
- [Task](https://taskfile.dev/) (task runner)

## Installation

### Install Task

**macOS/Linux (via script):**

```bash
sh -c "$(curl --location https://taskfile.dev/install.sh)" -- -d -b ~/.local/bin
```

**Go users:**

```bash
go install github.com/go-task/task/v3/cmd/task@latest
```

**Other methods:** See [Task installation guide](https://taskfile.dev/installation/)

## Quick Start

1. **Clone and setup:**

   ```bash
   git clone <repository-url>
   cd atode
   task setup
   ```

2. **Start development environment:**

   ```bash
   task dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - API Documentation: http://localhost:3000/docs
   - Swagger UI: http://localhost:3000/swagger

## Available Commands

Run `task` to see all available commands:

### Development

- `task dev` - Start development environment
- `task test` - Run all tests
- `task typecheck` - Run TypeScript checking
- `task lint` - Run linting and formatting

### Database

- `task db:migrate` - Run database migrations
- `task db:studio` - Open Drizzle Studio
- `task db:shell` - Open PostgreSQL shell

### Docker

- `task stop` - Stop all services
- `task clean` - Clean containers and data
- `task logs` - Show all service logs

### Production

- `task prod` - Start production environment
- `task ci` - Run full CI pipeline

## Tech Stack

- **Frontend:** Vite + React + TanStack Router + shadcn/ui
- **Backend:** Hono + PostgreSQL + Drizzle ORM
- **Validation:** Valibot with OpenAPI integration
- **Documentation:** Scalar API Reference + Swagger UI
- **Deployment:** Docker Compose
- **Package Manager:** Bun with workspaces

## Project Structure

```
atode/
├── packages/
│   ├── backend/             # Hono API server
│   └── frontend/            # React application
├── Taskfile.yml            # Task runner configuration
├── docker-compose.yml      # Docker services
└── CLAUDE.md               # Development guidelines
```

## Development Workflow

1. **Make changes** to code
2. **Run tests:** `task test`
3. **Check types:** `task typecheck`
4. **Format code:** `task lint`
5. **Commit changes** using conventional commits

## Contributing

See [CLAUDE.md](./CLAUDE.md) for detailed development guidelines and standards.
