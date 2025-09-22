from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'events', views.EventViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'locations', views.LocationViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('featured/', views.FeaturedEventsView.as_view(), name='featured_events'),
    path('upcoming/', views.UpcomingEventsView.as_view(), name='upcoming_events'),
]
