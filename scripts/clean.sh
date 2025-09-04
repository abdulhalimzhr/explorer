#!/bin/bash

echo "Cleaning..."

echo "Removing backend dependencies..."
if [ -d "apps/backend/node_modules" ]; then
    rm -rf apps/backend/node_modules
    echo "  Removed apps/backend/node_modules"
fi

if [ -f "apps/backend/bun.lockb" ]; then
    rm -f apps/backend/bun.lockb
    echo "  Removed apps/backend/bun.lockb"
fi

echo "Removing frontend dependencies..."
if [ -d "apps/frontend/node_modules" ]; then
    rm -rf apps/frontend/node_modules
    echo "  Removed apps/frontend/node_modules"
fi

if [ -f "apps/frontend/package-lock.json" ]; then
    rm -f apps/frontend/package-lock.json
    echo "  Removed apps/frontend/package-lock.json"
fi

if [ -d "apps/frontend/.nuxt" ]; then
    rm -rf apps/frontend/.nuxt
    echo "  Removed apps/frontend/.nuxt"
fi

echo "Removing root dependencies..."
if [ -d "node_modules" ]; then
    rm -rf node_modules
    echo "  Removed root node_modules"
fi

if [ -f "package-lock.json" ]; then
    rm -f package-lock.json
    echo "  Removed root package-lock.json"
fi

echo "Stopping and removing Docker containers..."
if command -v docker-compose &> /dev/null; then
    docker-compose down --volumes --remove-orphans
    echo "  Stopped containers and removed volumes"
else
    echo "  Docker Compose not found, skipping container cleanup"
fi

echo "Done"