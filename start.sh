#!/usr/bin/env bash
# Start script para servir tanto backend como frontend

set -o errexit

echo "🚀 Starting Casa Roja full-stack application..."

# Start Django backend
cd backend
echo "🐍 Starting Django backend on port $PORT..."
python3 -m gunicorn casaroja.wsgi:application --bind 0.0.0.0:$PORT --workers 2 --timeout 120

echo "✅ Application started successfully!"
