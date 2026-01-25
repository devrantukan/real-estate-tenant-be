#!/bin/bash

# Build and start the containers
echo "Starting Docker containers..."
docker-compose up -d --build

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 5

# Run Prisma migrations
echo "Running Prisma migrations..."
docker-compose run --rm migration

echo "Project is running at http://localhost:3001"
echo "Prisma Studio is running at http://localhost:5555"
echo "Typesense is running at http://localhost:8108"
