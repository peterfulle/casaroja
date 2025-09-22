"""
URL configuration for casaroja project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import HttpResponse
from django.shortcuts import render
import os

def serve_frontend(request, path=''):
    """Serve the Next.js frontend"""
    if path == '':
        path = 'index.html'
    
    # Try to serve the Next.js static files
    frontend_path = os.path.join(settings.BASE_DIR.parent, 'frontend', 'out', path)
    
    if os.path.exists(frontend_path):
        with open(frontend_path, 'rb') as f:
            content = f.read()
            
        # Determine content type
        if path.endswith('.html'):
            content_type = 'text/html'
        elif path.endswith('.js'):
            content_type = 'application/javascript'
        elif path.endswith('.css'):
            content_type = 'text/css'
        elif path.endswith('.json'):
            content_type = 'application/json'
        else:
            content_type = 'application/octet-stream'
            
        return HttpResponse(content, content_type=content_type)
    
    # If file not found, serve index.html for SPA routing
    index_path = os.path.join(settings.BASE_DIR.parent, 'frontend', 'out', 'index.html')
    if os.path.exists(index_path):
        with open(index_path, 'rb') as f:
            return HttpResponse(f.read(), content_type='text/html')
    
    return HttpResponse('Frontend not built yet', status=404)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/auth/", include("accounts.urls")),
    path("api/events/", include("events.urls")),
    path("api/tickets/", include("tickets.urls")),
    path("api/payments/", include("payments.urls")),
    path("api/transport/", include("transport.urls")),
    path("api/chat/", include("chat.urls")),
    
    # Serve frontend routes - DEBE IR AL FINAL
    path('', serve_frontend, {'path': ''}),
    path('<path:path>', serve_frontend),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
