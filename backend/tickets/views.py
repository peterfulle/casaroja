from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Ticket
from .serializers import TicketSerializer, PurchaseTicketSerializer


class TicketViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Ticket.objects.filter(customer=self.request.user)
    
    @action(detail=True, methods=['post'])
    def use_ticket(self, request, pk=None):
        ticket = self.get_object()
        if ticket.status == 'confirmed':
            ticket.status = 'used'
            ticket.save()
            return Response({'status': 'Ticket usado exitosamente'})
        return Response(
            {'error': 'Ticket no puede ser usado'}, 
            status=status.HTTP_400_BAD_REQUEST
        )


class PurchaseTicketView(generics.CreateAPIView):
    serializer_class = PurchaseTicketSerializer
    permission_classes = [IsAuthenticated]


class MyTicketsView(generics.ListAPIView):
    serializer_class = TicketSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Ticket.objects.filter(customer=self.request.user).order_by('-purchase_date')
