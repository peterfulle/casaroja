#!/usr/bin/env bash
# Build script para despliegue completo (Backend + Frontend)

set -o errexit  # exit on error

echo "🚀 Starting full-stack build process..."

# 1. Build Frontend
echo "📦 Building Frontend (Next.js)..."
cd frontend
npm install
npm run build
cd ..

# 2. Setup Backend
echo "🐍 Setting up Backend (Django)..."
pip install -r backend/requirements.txt

# 3. Collect static files from both frontend and backend
echo "🎨 Collecting static files..."
cd backend
python manage.py collectstatic --no-input

# 4. Run migrations
echo "🗄️ Running database migrations..."
python manage.py migrate

# 5. Create superuser if it doesn't exist
echo "👤 Creating superuser if needed..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@casaroja.cl', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
"

echo "✅ Full-stack build completed successfully!"
