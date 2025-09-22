#!/usr/bin/env python
"""
Script simplificado para crear datos de prueba en Casa Roja
"""

import os
import sys
import django
from datetime import datetime, timedelta

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'casaroja.settings')
django.setup()

from accounts.models import User
from events.models import Event, Category, Location
from django.utils import timezone

def create_basic_data():
    """Crear datos básicos para la aplicación"""
    
    print("Creando usuario básico...")
    
    # Admin user
    admin_user, created = User.objects.get_or_create(
        username='admin',
        defaults={
            'email': 'admin@casaroja.com',
            'first_name': 'Admin',
            'last_name': 'Casa Roja',
            'user_type': 'manager',
            'phone_number': '+56912345678',
            'is_staff': True,
            'is_superuser': True,
            'is_verified': True
        }
    )
    if created:
        admin_user.set_password('admin123')
        admin_user.save()
        print(f"✓ Usuario admin creado")
    else:
        print(f"✓ Usuario admin ya existe")

    # Event creator
    creator, created = User.objects.get_or_create(
        username='eventos_cr',
        defaults={
            'email': 'eventos@casaroja.com',
            'first_name': 'Eventos',
            'last_name': 'Casa Roja',
            'user_type': 'event_creator',
            'phone_number': '+56987654321',
            'is_verified': True
        }
    )
    if created:
        creator.set_password('eventos123')
        creator.save()
        print(f"✓ Usuario creador de eventos creado")
    
    # Cultor
    cultor, created = User.objects.get_or_create(
        username='maria_cultura',
        defaults={
            'email': 'maria@cultura.com',
            'first_name': 'María',
            'last_name': 'Cultura',
            'user_type': 'cultor',
            'phone_number': '+56911223344',
            'is_verified': True
        }
    )
    if created:
        cultor.set_password('cultura123')
        cultor.save()
        print(f"✓ Usuario cultor creado")

    print("Creando categoría básica...")
    
    # Crear una categoría básica
    category, created = Category.objects.get_or_create(
        name='Música',
        defaults={
            'description': 'Conciertos, recitales y eventos musicales',
            'icon': '🎵',
            'color': '#ef4444'
        }
    )
    if created:
        print(f"✓ Categoría {category.name} creada")

    print("Creando ubicación básica...")
    
    # Crear una ubicación básica
    location, created = Location.objects.get_or_create(
        name='Casa Roja',
        defaults={
            'address': 'Merced 345',
            'city': 'Santiago',
            'postal_code': '8320000',
            'capacity': 120,
            'has_parking': False,
            'has_accessibility': True,
            'has_audio_equipment': True,
            'contact_name': 'Casa Roja',
            'contact_phone': '+56222334455',
            'contact_email': 'eventos@casaroja.com'
        }
    )
    if created:
        print(f"✓ Ubicación {location.name} creada")

    print("Creando evento básico...")
    
    # Crear un evento básico
    start_time = timezone.now() + timedelta(days=7)
    end_time = start_time + timedelta(hours=3)
    
    event_data = {
        'title': 'Concierto de Jazz en Vivo',
        'description': 'Una noche mágica con los mejores exponentes del jazz nacional. Disfruta de una velada inolvidable con destacados músicos.',
        'short_description': 'Una noche mágica con los mejores exponentes del jazz nacional',
        'event_type': 'performance',
        'category': category,
        'organizer': creator,
        'cultor': cultor,
        'start_datetime': start_time,
        'end_datetime': end_time,
        'duration_minutes': 180,
        'location': location,
        'base_price': 25000,
        'max_participants': 80,
        'min_participants': 20,
        'status': 'published',
        'featured': True,
        'allows_cancellation': True,
        'cancellation_hours': 24
    }
    
    event, created = Event.objects.get_or_create(
        title=event_data['title'],
        defaults=event_data
    )
    if created:
        print(f"✓ Evento '{event.title}' creado")
    else:
        print(f"✓ Evento '{event.title}' ya existe")

    print("\n¡Datos básicos creados exitosamente!")
    print(f"✓ {User.objects.count()} usuarios")
    print(f"✓ {Category.objects.count()} categorías")
    print(f"✓ {Location.objects.count()} ubicaciones")
    print(f"✓ {Event.objects.count()} eventos")
    print(f"✓ {Event.objects.filter(featured=True).count()} eventos destacados")

if __name__ == '__main__':
    create_basic_data()
