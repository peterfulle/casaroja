from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'tickets', views.TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('purchase/', views.PurchaseTicketView.as_view(), name='purchase_ticket'),
    path('my-tickets/', views.MyTicketsView.as_view(), name='my_tickets'),
]
