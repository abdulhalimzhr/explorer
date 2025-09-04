#!/bin/bash

echo "Starting with Docker..."

# Check if this is the first run
if [ ! -f "apps/backend/.env" ] || [ ! -f "apps/frontend/.env" ]; then
    echo "First run - setting up environment..."
    ./scripts/setup.sh
    echo ""
fi

echo "Building and starting containers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:3001"
echo "   API Docs: http://localhost:3001/swagger"

docker-compose up -d --build

if [ $? -eq 0 ]; then
    echo "Containers started"
    echo ""
    echo "Commands:"
    echo "   View logs: docker-compose logs -f"
    echo "   Stop: docker-compose down"
    echo "   Restart: docker-compose restart"
else
    echo "Failed to start containers"
    exit 1
fi