from django.db import models
from django.contrib.auth import get_user_model
import uuid
import qrcode
from io import BytesIO
from django.core.files import File
from PIL import Image

User = get_user_model()


class Ticket(models.Model):
    """
    Tickets for cultural events
    """
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('confirmed', 'Confirmado'),
        ('used', 'Usado'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
    )
    
    # Identification
    ticket_number = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    qr_code = models.ImageField(upload_to='tickets/qr/', blank=True, null=True)
    
    # Relations
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='tickets')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='purchased_tickets')
    
    # Pricing
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    transport_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Discount applied
    discount_code = models.ForeignKey(
        'events.EventDiscount', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # Status and metadata
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    participants_count = models.PositiveIntegerField(default=1)
    participant_names = models.JSONField(default=list, blank=True)
    
    # Transport
    needs_transport = models.BooleanField(default=False)
    pickup_location = models.CharField(max_length=200, blank=True)
    transport_assigned = models.ForeignKey(
        'transport.TransportService', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    
    # Usage tracking
    checked_in_at = models.DateTimeField(null=True, blank=True)
    checked_in_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='checked_in_tickets'
    )
    
    # Special requirements
    special_requirements = models.TextField(blank=True)
    accessibility_needs = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Generate QR code if not exists
        if not self.qr_code:
            self.generate_qr_code()
        super().save(*args, **kwargs)

    def generate_qr_code(self):
        """Generate QR code for the ticket"""
        qr_data = f"casaroja:ticket:{self.ticket_number}"
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save to BytesIO
        buffer = BytesIO()
        img.save(buffer, format='PNG')
        
        # Create Django file
        filename = f"ticket_{self.ticket_number}.png"
        filebuffer = File(buffer, name=filename)
        self.qr_code.save(filename, filebuffer, save=False)

    def __str__(self):
        return f"Ticket {self.ticket_number} - {self.event.title}"

    class Meta:
        ordering = ['-created_at']


class Subscription(models.Model):
    """
    Cultural subscriptions (like New York Pass)
    """
    SUBSCRIPTION_TYPES = (
        ('monthly', 'Mensual'),
        ('quarterly', 'Trimestral'),
        ('semiannual', 'Semestral'),
        ('annual', 'Anual'),
    )
    
    STATUS_CHOICES = (
        ('active', 'Activa'),
        ('paused', 'Pausada'),
        ('expired', 'Expirada'),
        ('cancelled', 'Cancelada'),
    )
    
    # Basic info
    name = models.CharField(max_length=100)
    description = models.TextField()
    subscription_type = models.CharField(max_length=20, choices=SUBSCRIPTION_TYPES)
    
    # Pricing
    price = models.DecimalField(max_digits=8, decimal_places=2)
    currency = models.CharField(max_length=3, default='CLP')
    
    # Benefits
    includes_transport = models.BooleanField(default=False)
    max_events_per_month = models.PositiveIntegerField(null=True, blank=True)  # None = unlimited
    allowed_categories = models.ManyToManyField('events.Category', blank=True)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    
    # Restrictions
    excluded_events = models.ManyToManyField('events.Event', blank=True)
    premium_events_included = models.BooleanField(default=False)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.get_subscription_type_display()}"


class UserSubscription(models.Model):
    """
    User's active subscriptions
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    subscription = models.ForeignKey(Subscription, on_delete=models.CASCADE)
    
    # Dates
    start_date = models.DateField()
    end_date = models.DateField()
    auto_renew = models.BooleanField(default=True)
    
    # Usage tracking
    events_used_this_month = models.PositiveIntegerField(default=0)
    total_events_used = models.PositiveIntegerField(default=0)
    
    # Status
    status = models.CharField(max_length=20, choices=Subscription.STATUS_CHOICES, default='active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.subscription.name}"

    @property
    def is_valid(self):
        from django.utils import timezone
        return (
            self.status == 'active' and 
            self.start_date <= timezone.now().date() <= self.end_date
        )

    @property
    def can_book_more_events(self):
        if not self.subscription.max_events_per_month:
            return True
        return self.events_used_this_month < self.subscription.max_events_per_month


class TicketCancellation(models.Model):
    """
    Track ticket cancellations and refunds
    """
    CANCELLATION_REASONS = (
        ('customer_request', 'Solicitud del Cliente'),
        ('event_cancelled', 'Evento Cancelado'),
        ('force_majeure', 'Fuerza Mayor'),
        ('no_show', 'No Asistió'),
        ('other', 'Otro'),
    )
    
    ticket = models.OneToOneField(Ticket, on_delete=models.CASCADE, related_name='cancellation')
    reason = models.CharField(max_length=30, choices=CANCELLATION_REASONS)
    description = models.TextField(blank=True)
    
    # Refund info
    refund_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    refund_processed = models.BooleanField(default=False)
    refund_processed_at = models.DateTimeField(null=True, blank=True)
    
    # Who processed
    cancelled_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='processed_cancellations')
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cancellation for {self.ticket.ticket_number}"


class TicketTransfer(models.Model):
    """
    Track ticket transfers between users
    """
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('accepted', 'Aceptado'),
        ('rejected', 'Rechazado'),
        ('expired', 'Expirado'),
    )
    
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='transfers')
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_transfers')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transfers')
    
    transfer_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    
    # Transfer details
    message = models.TextField(blank=True)
    valid_until = models.DateTimeField()
    
    accepted_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transfer {self.ticket.ticket_number}: {self.from_user.username} → {self.to_user.username}"
