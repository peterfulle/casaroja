from rest_framework import serializers
from .models import Event, Category, Location
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'icon', 'color', 'is_active']


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'address', 'city', 'postal_code',
            'latitude', 'longitude', 'capacity', 'has_parking',
            'has_accessibility', 'has_audio_equipment',
            'contact_name', 'contact_phone', 'contact_email'
        ]


class EventListSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    cultor = UserSerializer(read_only=True)
    available_spots = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'short_description', 'event_type', 'category',
            'organizer', 'cultor', 'start_datetime', 'end_datetime',
            'location', 'base_price', 'max_participants', 'available_spots',
            'status', 'main_image', 'featured'
        ]


class EventDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    location = LocationSerializer(read_only=True)
    organizer = UserSerializer(read_only=True)
    cultor = UserSerializer(read_only=True)
    available_spots = serializers.ReadOnlyField()
    is_sold_out = serializers.ReadOnlyField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'description', 'short_description', 'event_type',
            'category', 'organizer', 'cultor', 'start_datetime', 'end_datetime',
            'duration_minutes', 'location', 'requires_transport', 'meeting_point',
            'base_price', 'max_participants', 'min_participants', 'available_spots',
            'is_sold_out', 'difficulty_level', 'requirements', 'allows_cancellation',
            'cancellation_hours', 'status', 'main_image', 'gallery_images', 'featured',
            'tags', 'created_at', 'updated_at'
        ]


class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = [
            'title', 'description', 'short_description', 'event_type',
            'category', 'cultor', 'start_datetime', 'end_datetime',
            'duration_minutes', 'location', 'requires_transport', 'meeting_point',
            'base_price', 'max_participants', 'min_participants',
            'difficulty_level', 'requirements', 'allows_cancellation',
            'cancellation_hours', 'main_image', 'tags'
        ]
    
    def create(self, validated_data):
        validated_data['organizer'] = self.context['request'].user
        return super().create(validated_data)
