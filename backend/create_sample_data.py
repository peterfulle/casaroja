#!/usr/bin/env python
"""
Script para crear datos de prueba en Casa Roja
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

def create_sample_data():
    """Crear datos de ejemplo para la aplicación"""
    
    # Crear usuarios
    print("Creando usuarios...")
    
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

    # Crear categorías
    print("Creando categorías...")
    
    categories_data = [
        {
            'name': 'Música',
            'description': 'Conciertos, recitales y eventos musicales',
            'icon': '🎵',
            'color': '#ef4444'
        },
        {
            'name': 'Teatro',
            'description': 'Obras de teatro, performances y artes escénicas',
            'icon': '🎭',
            'color': '#8b5cf6'
        },
        {
            'name': 'Arte Visual',
            'description': 'Exposiciones, galerías y arte contemporáneo',
            'icon': '🎨',
            'color': '#06b6d4'
        },
        {
            'name': 'Literatura',
            'description': 'Presentaciones de libros, lecturas y talleres literarios',
            'icon': '📚',
            'color': '#10b981'
        },
        {
            'name': 'Danza',
            'description': 'Espectáculos de danza y expresión corporal',
            'icon': '💃',
            'color': '#f59e0b'
        }
    ]

    categories = []
    for cat_data in categories_data:
        category, created = Category.objects.get_or_create(
            name=cat_data['name'],
            defaults=cat_data
        )
        categories.append(category)
        if created:
            print(f"✓ Categoría {category.name} creada")

    # Crear ubicaciones
    print("Creando ubicaciones...")
    
    locations_data = [
        {
            'name': 'Teatro Municipal Santiago',
            'address': 'Agustinas 794',
            'city': 'Santiago',
            'postal_code': '8340518',
            'capacity': 1500,
            'has_parking': True,
            'has_accessibility': True,
            'has_audio_equipment': True,
            'contact_name': 'Administración Teatro',
            'contact_phone': '+56222083900',
            'contact_email': 'contacto@municipal.cl'
        },
        {
            'name': 'Centro Cultural La Moneda',
            'address': 'Plaza de la Ciudadanía 26',
            'city': 'Santiago',
            'postal_code': '8340476',
            'capacity': 800,
            'has_parking': True,
            'has_accessibility': True,
            'has_audio_equipment': True,
            'contact_name': 'Centro Cultural',
            'contact_phone': '+56222069100',
            'contact_email': 'info@ccplm.cl'
        },
        {
            'name': 'Espacio Riesco',
            'address': 'El Salto 5000',
            'city': 'Huechuraba',
            'postal_code': '8580702',
            'capacity': 3000,
            'has_parking': True,
            'has_accessibility': True,
            'has_audio_equipment': True,
            'contact_name': 'Espacio Riesco',
            'contact_phone': '+56222039200',
            'contact_email': 'eventos@espacioriesco.cl'
        },
        {
            'name': 'Café Cultural Casa Roja',
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
    ]

    locations = []
    for loc_data in locations_data:
        location, created = Location.objects.get_or_create(
            name=loc_data['name'],
            defaults=loc_data
        )
        locations.append(location)
        if created:
            print(f"✓ Ubicación {location.name} creada")

    # Crear eventos
    print("Creando eventos...")
    
    events_data = [
        {
            'title': 'Concierto de Jazz en Vivo',
            'short_description': 'Una noche mágica con los mejores exponentes del jazz nacional',
            'description': 'Disfruta de una velada inolvidable con destacados músicos de jazz que presentarán un repertorio que va desde los clásicos hasta composiciones contemporáneas. El evento contará con tres sets musicales y una experiencia gastronómica única.',
            'event_type': 'performance',
            'category': categories[0],  # Música
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=7),
            'end_datetime': timezone.now() + timedelta(days=7, hours=3),
            'duration_minutes': 180,
            'location': locations[3],  # Casa Roja
            'base_price': 25000,
            'max_participants': 80,
            'min_participants': 20,
            'status': 'published',
            'featured': True,
            'allows_cancellation': True,
            'cancellation_hours': 24
        },
        {
            'title': 'Exposición Arte Contemporáneo',
            'short_description': 'Muestra colectiva de artistas emergentes chilenos',
            'description': 'Una exposición que reúne las obras más destacadas de jóvenes artistas chilenos, explorando temas de identidad, memoria y territorio. La muestra incluye pinturas, esculturas y instalaciones multimedia.',
            'event_type': 'exhibition',
            'category': categories[2],  # Arte Visual
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=3),
            'end_datetime': timezone.now() + timedelta(days=33),
            'duration_minutes': 43200,  # 30 días en minutos (para exposición)
            'location': locations[1],  # Centro Cultural La Moneda
            'base_price': 15000,
            'max_participants': 200,
            'status': 'published',
            'featured': True,
            'allows_cancellation': True,
            'cancellation_hours': 48
        },
        {
            'title': 'Hamlet - Versión Contemporánea',
            'short_description': 'La clásica obra de Shakespeare en una puesta en escena moderna',
            'description': 'Una innovadora adaptación de la obra maestra de Shakespeare, ambientada en el Chile actual. La compañía teatral "Nuevos Horizontes" presenta esta versión que combina elementos clásicos con problemáticas contemporáneas.',
            'event_type': 'performance',
            'category': categories[1],  # Teatro
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=14),
            'end_datetime': timezone.now() + timedelta(days=14, hours=2),
            'duration_minutes': 120,
            'location': locations[0],  # Teatro Municipal
            'base_price': 35000,
            'max_participants': 400,
            'min_participants': 50,
            'status': 'published',
            'featured': True,
            'allows_cancellation': True,
            'cancellation_hours': 72
        },
        {
            'title': 'Taller de Escritura Creativa',
            'short_description': 'Desarrolla tu creatividad literaria con técnicas innovadoras',
            'description': 'Un taller intensivo de escritura creativa dirigido por reconocidos autores nacionales. Aprende técnicas narrativas, desarrollo de personajes y estructuras dramáticas en un ambiente colaborativo y estimulante.',
            'event_type': 'workshop',
            'category': categories[3],  # Literatura
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=10),
            'end_datetime': timezone.now() + timedelta(days=10, hours=4),
            'duration_minutes': 240,
            'location': locations[3],  # Casa Roja
            'base_price': 45000,
            'max_participants': 25,
            'min_participants': 8,
            'status': 'published',
            'featured': False,
            'allows_cancellation': True,
            'cancellation_hours': 48
        },
        {
            'title': 'Festival de Danza Urbana',
            'short_description': 'Competencia y showcase de los mejores bailarines urbanos',
            'description': 'Un evento que celebra la cultura urbana a través de la danza. Incluye competencias de breakdance, hip-hop y freestyle, además de showcases de las mejores crews del país. Ideal para toda la familia.',
            'event_type': 'festival',
            'category': categories[4],  # Danza
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=21),
            'end_datetime': timezone.now() + timedelta(days=21, hours=6),
            'duration_minutes': 360,
            'location': locations[2],  # Espacio Riesco
            'base_price': 20000,
            'max_participants': 1500,
            'min_participants': 100,
            'status': 'published',
            'featured': True,
            'allows_cancellation': True,
            'cancellation_hours': 24
        },
        {
            'title': 'Recital de Poesía: Voces Nuevas',
            'short_description': 'Encuentro de jóvenes poetas emergentes',
            'description': 'Una noche dedicada a la nueva poesía chilena. Jóvenes autores compartirán sus obras más recientes en un ambiente íntimo y acogedor. El evento incluye una mesa redonda sobre el futuro de la literatura nacional.',
            'event_type': 'session',
            'category': categories[3],  # Literatura
            'organizer': creator,
            'cultor': cultor,
            'start_datetime': timezone.now() + timedelta(days=5),
            'end_datetime': timezone.now() + timedelta(days=5, hours=2),
            'duration_minutes': 120,
            'location': locations[3],  # Casa Roja
            'base_price': 12000,
            'max_participants': 60,
            'min_participants': 15,
            'status': 'published',
            'featured': False,
            'allows_cancellation': True,
            'cancellation_hours': 12
        }
    ]

    for event_data in events_data:
        event, created = Event.objects.get_or_create(
            title=event_data['title'],
            defaults=event_data
        )
        if created:
            print(f"✓ Evento '{event.title}' creado")

    print("\n¡Datos de ejemplo creados exitosamente!")
    print(f"✓ {User.objects.count()} usuarios")
    print(f"✓ {Category.objects.count()} categorías")
    print(f"✓ {Location.objects.count()} ubicaciones")
    print(f"✓ {Event.objects.count()} eventos")
    print(f"✓ {Event.objects.filter(featured=True).count()} eventos destacados")

if __name__ == '__main__':
    create_sample_data()
