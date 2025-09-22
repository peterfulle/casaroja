from rest_framework import serializers
from .models import Ticket
from events.serializers import EventListSerializer


class TicketSerializer(serializers.ModelSerializer):
    event = EventListSerializer(read_only=True)
    
    class Meta:
        model = Ticket
        fields = [
            'id', 'ticket_number', 'event', 'status', 'base_price',
            'discount_amount', 'transport_fee', 'total_price',
            'participants_count', 'participant_names', 'special_requests',
            'purchase_date', 'used_date', 'qr_code'
        ]
        read_only_fields = ['ticket_number', 'purchase_date', 'used_date', 'qr_code']


class PurchaseTicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = [
            'event', 'participants_count', 'participant_names',
            'special_requests', 'discount_code'
        ]
    
    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        
        # Calculate pricing
        event = validated_data['event']
        participants = validated_data.get('participants_count', 1)
        
        base_price = event.base_price * participants
        discount_amount = 0
        transport_fee = 0
        
        # Apply discount if provided
        discount_code = validated_data.get('discount_code')
        if discount_code and discount_code.is_valid():
            if discount_code.discount_type == 'percentage':
                discount_amount = base_price * (discount_code.discount_value / 100)
            else:
                discount_amount = discount_code.discount_value
        
        # Calculate transport fee if required
        if event.requires_transport:
            transport_fee = 5000 * participants  # Example transport fee
        
        total_price = base_price - discount_amount + transport_fee
        
        validated_data.update({
            'base_price': base_price,
            'discount_amount': discount_amount,
            'transport_fee': transport_fee,
            'total_price': total_price,
            'status': 'pending'
        })
        
        return super().create(validated_data)
