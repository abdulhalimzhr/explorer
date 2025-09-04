# File Explorer Web App

A web-based file explorer application that lets you browse folders and files through a clean interface. The app provides folder tree navigation, search functionality, and file viewing capabilities.

## Technology Stack

**Backend**

- Bun runtime with Elysia framework
- PostgreSQL database with Drizzle ORM
- RESTful API with Swagger documentation

**Frontend**

- Nuxt 3 with Vue 3
- Tailwind CSS for styling
- Pinia for state management

**Testing**

- Vitest for frontend unit tests
- Bun Test for backend testing
- Playwright for end-to-end tests

## Quick Start

```bash
git clone https://github.com/abdulhalimzhr/explorer.git
cd explorer
npm run start
```

For Docker:

```bash
npm run start
```

## Available Commands

```bash
npm run start          # Setup and run with Docker (includes setup.sh + docker-compose)
npm run stop           # Stop and remove Docker containers with volumes
npm run dev            # Run both servers in development mode (concurrently)
npm run build          # Build both backend and frontend applications
npm test               # Run all tests (backend + frontend)
npm run clean          # Clean dependencies (runs clean.sh script)
```

## Application URLs

After starting the application, you can access:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/swagger

## Requirements

- Bun (backend)
- Node.js 18+ (frontend)
- PostgreSQL (or Docker)

## Manual Setup

### Prerequisites

Install these first:

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install Node.js (choose one):
# - Download from https://nodejs.org/
# - Use nvm: nvm install 18 && nvm use 18
# - Use homebrew: brew install node
```

### Step by Step

1. **Clone the repository**

```bash
git clone https://github.com/abdulhalimzhr/explorer.git
cd explorer
```

2. **Run the application**

```bash
npm start
```

That's it! The start command handles dependency installation, database setup, and starts the application with Docker.

For development without Docker:

```bash
# Setup environment files (if needed)
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# Run in development mode
npm run dev
```

## Features

- Hierarchical folder tree with expand/collapse functionality
- Search folders by name with fuzzy matching
- File viewing with appropriate icons and metadata
- Responsive design that works on desktop and mobile
- Performance monitoring and optimization
- Comprehensive test coverage
- Interactive API documentation
- Docker support for easy deployment

## Testing

The project has tests for both backend and frontend components.

**Backend Tests**

```bash
cd apps/backend && bun test
```

**Frontend Tests**

```bash
cd apps/frontend && npm run test
```

**All Tests**

```bash
npm test
```

## Environment Variables

**Backend** (`apps/backend/.env`):

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://explorer_user:explorer_pass@localhost:5432/explorer_db
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`apps/frontend/.env`):

```env
NUXT_PUBLIC_API_BASE=http://localhost:3001
NUXT_PUBLIC_API_VERSION=v1
```

## Project Structure

```
explorer/
├── apps/
│   ├── backend/                 # Bun + Elysia API server
│   │   ├── src/
│   │   │   ├── routes/         # API route handlers
│   │   │   ├── services/       # Business logic layer
│   │   │   ├── database/       # Database schema and migrations
│   │   │   ├── middleware/     # Custom middleware
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── tests/          # Unit and integration tests
│   │   └── package.json
│   └── frontend/               # Nuxt 3 + Vue 3 app
│       ├── components/         # Vue components
│       ├── composables/        # Vue composables
│       ├── stores/             # Pinia state management
│       ├── types/              # TypeScript types
│       ├── tests/              # Unit, component, and e2e tests
│       └── package.json
├── database/                   # Database initialization scripts
├── docker/                     # Docker configuration
└── package.json               # Root package.json with scripts
```

## API Endpoints

The backend provides a RESTful API for folder and file operations:

**Folders**

- `GET /api/v1/folders` - Get complete folder tree
- `GET /api/v1/folders/:id` - Get specific folder
- `GET /api/v1/folders/:id/contents` - Get folder contents
- `GET /api/v1/folders/search?q=query` - Search folders

**Files**

- `GET /api/v1/files/folder/:folderId` - Get files in folder
- `GET /api/v1/files/:id` - Get specific file

All endpoints return JSON with a consistent structure including success status, data, and timestamp.

## Development Notes

The application uses TypeScript throughout for type safety. Input validation is handled with Zod schemas, and the codebase includes performance monitoring utilities. Error handling is centralized to provide consistent responses across all endpoints.

## License

MIT License
