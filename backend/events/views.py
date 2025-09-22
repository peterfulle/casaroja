from rest_framework import viewsets, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Event, Category, Location
from .serializers import (
    EventListSerializer, EventDetailSerializer, EventCreateSerializer,
    CategorySerializer, LocationSerializer
)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True)
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]


class LocationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Location.objects.filter(is_active=True)
    serializer_class = LocationSerializer
    permission_classes = [AllowAny]


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.filter(status='published').order_by('start_datetime')
    permission_classes = [AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'event_type', 'location', 'status']
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['start_datetime', 'created_at', 'current_price']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return EventListSerializer
        elif self.action == 'create':
            return EventCreateSerializer
        return EventDetailSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        featured_events = self.queryset.filter(featured=True)[:6]
        serializer = EventListSerializer(featured_events, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def upcoming(self, request):
        upcoming_events = self.queryset.filter(
            start_datetime__gte=timezone.now()
        )[:10]
        serializer = EventListSerializer(upcoming_events, many=True)
        return Response(serializer.data)


class FeaturedEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Event.objects.filter(
            status='published',
            featured=True
        )[:6]


class UpcomingEventsView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        return Event.objects.filter(
            status='published',
            start_datetime__gte=timezone.now()
        ).order_by('start_datetime')[:10]
