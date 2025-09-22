from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Category(models.Model):
    """
    Categories for cultural events
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # FontAwesome icon class
    color = models.CharField(max_length=7, default='#007bff')  # Hex color
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Categories"

    def __str__(self):
        return self.name


class Location(models.Model):
    """
    Physical locations where events can take place
    """
    name = models.CharField(max_length=200)
    address = models.TextField()
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Capacity and features
    capacity = models.PositiveIntegerField(default=1)
    has_parking = models.BooleanField(default=False)
    has_accessibility = models.BooleanField(default=False)
    has_audio_equipment = models.BooleanField(default=False)
    
    # Contact
    contact_name = models.CharField(max_length=100, blank=True)
    contact_phone = models.CharField(max_length=20, blank=True)
    contact_email = models.EmailField(blank=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.city}"


class Event(models.Model):
    """
    Cultural events created by cultors or event creators
    """
    EVENT_TYPES = (
        ('session', 'Sesión Individual'),
        ('workshop', 'Taller'),
        ('performance', 'Presentación'),
        ('exhibition', 'Exposición'),
        ('conference', 'Conferencia'),
        ('festival', 'Festival'),
    )
    
    STATUS_CHOICES = (
        ('draft', 'Borrador'),
        ('published', 'Publicado'),
        ('sold_out', 'Agotado'),
        ('cancelled', 'Cancelado'),
        ('completed', 'Completado'),
    )
    
    # Basic info
    title = models.CharField(max_length=200)
    description = models.TextField()
    short_description = models.CharField(max_length=300, blank=True)
    event_type = models.CharField(max_length=20, choices=EVENT_TYPES, default='session')
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='events')
    
    # Organizer
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    cultor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='cultor_events')
    
    # Scheduling
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField()
    
    # Location
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='events')
    requires_transport = models.BooleanField(default=False)
    meeting_point = models.CharField(max_length=200, blank=True)
    
    # Pricing
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    max_participants = models.PositiveIntegerField(default=1)
    min_participants = models.PositiveIntegerField(default=1)
    
    # Media
    main_image = models.ImageField(upload_to='events/images/', null=True, blank=True)
    gallery_images = models.JSONField(default=list, blank=True)
    video_url = models.URLField(blank=True)
    
    # Settings
    is_recurring = models.BooleanField(default=False)
    recurring_pattern = models.JSONField(default=dict, blank=True)  # Store recurrence rules
    allows_cancellation = models.BooleanField(default=True)
    cancellation_hours = models.PositiveIntegerField(default=24)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    featured = models.BooleanField(default=False)
    
    # Metadata
    tags = models.JSONField(default=list, blank=True)
    requirements = models.TextField(blank=True)  # What participants need to bring
    difficulty_level = models.PositiveIntegerField(
        default=1, 
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['start_datetime']

    def __str__(self):
        return f"{self.title} - {self.start_datetime.strftime('%Y-%m-%d %H:%M')}"

    @property
    def available_spots(self):
        from tickets.models import Ticket
        sold_tickets = Ticket.objects.filter(
            event=self, 
            status__in=['confirmed', 'used']
        ).count()
        return self.max_participants - sold_tickets

    @property
    def is_sold_out(self):
        return self.available_spots <= 0


class EventDiscount(models.Model):
    """
    Discount codes for events
    """
    DISCOUNT_TYPES = (
        ('percentage', 'Porcentaje'),
        ('fixed', 'Monto Fijo'),
    )
    
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='discounts')
    code = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Usage limits
    max_uses = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    max_uses_per_user = models.PositiveIntegerField(default=1)
    
    # Validity
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    
    # Conditions
    minimum_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    applicable_user_types = models.JSONField(default=list, blank=True)  # e.g., ['student', 'senior']
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.code} - {self.event.title}"


class Review(models.Model):
    """
    Reviews for events and cultors
    """
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reviews')
    cultor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_reviews')
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='given_reviews')
    
    rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    title = models.CharField(max_length=200, blank=True)
    comment = models.TextField(blank=True)
    
    # Specific ratings
    rating_content = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    rating_organization = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    rating_location = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    
    would_recommend = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)  # If reviewer actually attended
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['event', 'reviewer']

    def __str__(self):
        return f"Review by {self.reviewer.username} for {self.event.title} - {self.rating}★"
