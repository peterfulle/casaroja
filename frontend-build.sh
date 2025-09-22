#!/usr/bin/env bash
# Frontend build script

set -o errexit  # exit on error

echo "🚀 Starting frontend build process..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building Next.js application..."
npm run build

echo "✅ Frontend build completed successfully!"
