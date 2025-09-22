# � Casa Roja - Plataforma Cultural Digital

Sistema de gestión de eventos culturales desarrollado con Django REST Framework y Next.js.

## 🚀 Características

- **Sistema de autenticación completo** con JWT
- **Gestión de eventos** culturales
- **Dashboard de usuario** personalizado
- **API REST** completa con Django
- **Frontend moderno** con Next.js 15 y TypeScript
- **Diseño responsivo** con glassmorphism
- **Estado global** con Zustand
- **Queries eficientes** con React Query

## 🛠 Tecnologías

### Backend
- Django 4.2.7
- Django REST Framework
- JWT Authentication
- SQLite (desarrollo) / PostgreSQL (producción)
- CORS Headers

### Frontend
- Next.js 15.5.3 con Turbopack
- TypeScript
- Emotion (CSS-in-JS)
- Framer Motion (animaciones)
- Zustand (estado global)
- React Query (cache de datos)
- Lucide React (iconos)

## 📦 Instalación Local

### Prerrequisitos
- Python 3.9+
- Node.js 18+
- npm o yarn

### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

### Frontend
```bash
cd frontend
npm install
npm run dev -- --port 3003
```

## 🌐 URLs de Desarrollo

- **Frontend**: http://localhost:3003
- **Backend API**: http://localhost:8001
- **Admin Django**: http://localhost:8001/admin

## 👤 Usuario de Prueba

- **Email**: demo@casaroja.cl
- **Password**: demo123

### Backend (Django REST API)
- **Framework**: Django 4.2 + Django REST Framework
- **Base de datos**: PostgreSQL
- **Cache**: Redis
- **Tareas asíncronas**: Celery
- **Autenticación**: JWT
- **WebSockets**: Django Channels

### Frontend (Next.js)
- **Framework**: Next.js 14 con App Router
- **Styling**: Emotion + TypeScript
- **Estado**: Zustand + React Query
- **Animaciones**: Framer Motion

## 🚀 Funcionalidades Principales

### 👤 Gestión Multi-Usuario
- **Cultores**: Artistas que ofrecen servicios
- **Clientes**: Usuarios que contratan experiencias
- **Gestores**: Administradores de la plataforma
- **Transportistas**: Proveedores de servicios de transporte
- **Creadores de Eventos**: Organizadores culturales

### 🎫 Sistema de Ticketing
- Reservas y compras de sesiones
- Códigos QR para validación
- Sistema de suscripciones culturales
- Programas de descuentos

### 💳 Pagos y Facturación
- Múltiples métodos de pago
- Gestión de comisiones
- Reportes financieros
- Facturación automática

### 🚌 Gestión de Transporte
- Coordinación de rutas
- Asignación de pasajeros
- Seguimiento en tiempo real
- Gestión de flota

### 💬 Comunicación
- Chat en tiempo real
- Notificaciones push
- Sistema de comentarios y calificaciones

---

**Casaroja** - Conectando la cultura con la tecnología 🎨✨
