#!/bin/bash

echo "Setting up..."

# Check if we have Node.js and npm
if ! command -v node &> /dev/null; then
    echo "Node.js required but not found."
    echo ""
    echo "Install Node.js:"
    echo "  - Download from https://nodejs.org/"
    echo "  - Use nvm: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  - Use homebrew: brew install node"
    echo ""
    echo "Then run this setup script again."
    exit 1
fi

echo "Found tools:"
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo ""

# Install the dependencies
echo "Installing dependencies..."

echo "Installing backend dependencies with npm..."
cd apps/backend
npm install
cd ../..

echo "Installing frontend dependencies with npm..."
cd apps/frontend

# Try normal install first, fallback to legacy peer deps if needed
if ! npm install; then
    echo "   Normal install failed, trying with --legacy-peer-deps..."
    npm install --legacy-peer-deps
fi

cd ../..

echo "Dependencies installed."

# Set up environment files
echo "Setting up environment files..."

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "  Created backend .env"
else
    echo "  Backend .env exists, skipping"
fi

if [ ! -f "apps/frontend/.env" ]; then
    cp apps/frontend/.env.example apps/frontend/.env
    echo "  Created frontend .env"
else
    echo "  Frontend .env exists, skipping"
fi

if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Docker detected. Start with:"
    echo "  docker-compose up -d"
    echo ""
    echo "Or run locally:"
    echo "  Terminal 1: cd apps/backend && bun run dev"
    echo "  Terminal 2: cd apps/frontend && npm run dev"
else
    echo "Docker not found. To run locally:"
    echo ""
    echo "Setup PostgreSQL:"
    echo "  createdb explorer_db"
    echo "  createuser -s explorer_user"
    echo "  psql -c \"ALTER USER explorer_user PASSWORD 'explorer_pass';\""
    echo "  psql -d explorer_db -f database/init.sql"
    echo ""
    echo "Start app:"
    echo "  Terminal 1: cd apps/backend && npm run dev"
    echo "  Terminal 2: cd apps/frontend && npm run dev"
fi

echo ""
echo "Setup complete. Access at:"
echo "  App: http://localhost:3000"
echo "  API: http://localhost:3001"
echo "  Docs: http://localhost:3001/swagger"