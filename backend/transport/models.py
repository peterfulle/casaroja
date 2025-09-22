from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class TransportGroup(models.Model):
    """
    Groups of transport providers that work together
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    
    # Contact information
    contact_person = models.CharField(max_length=100)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField()
    
    # Service areas
    service_areas = models.JSONField(default=list, blank=True)  # List of cities/zones
    
    # Operational settings
    is_active = models.BooleanField(default=True)
    default_rate_per_passenger = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    default_rate_per_km = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


class TransportRoute(models.Model):
    """
    Predefined routes for transport services
    """
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    
    # Route details
    origin_name = models.CharField(max_length=200)
    origin_address = models.TextField()
    origin_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    origin_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    destination_name = models.CharField(max_length=200)
    destination_address = models.TextField()
    destination_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    destination_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Route characteristics
    estimated_duration_minutes = models.PositiveIntegerField()
    estimated_distance_km = models.DecimalField(max_digits=6, decimal_places=2)
    
    # Stops along the way
    waypoints = models.JSONField(default=list, blank=True)
    
    # Pricing
    base_price = models.DecimalField(max_digits=6, decimal_places=2)
    price_per_passenger = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name}: {self.origin_name} → {self.destination_name}"


class TransportService(models.Model):
    """
    Specific transport services for events
    """
    STATUS_CHOICES = (
        ('scheduled', 'Programado'),
        ('confirmed', 'Confirmado'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completado'),
        ('cancelled', 'Cancelado'),
    )
    
    # Relations
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='transport_services')
    route = models.ForeignKey(TransportRoute, on_delete=models.CASCADE, related_name='services')
    transport_group = models.ForeignKey(TransportGroup, on_delete=models.CASCADE, related_name='services')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='driven_services')
    vehicle = models.ForeignKey('Vehicle', on_delete=models.CASCADE, related_name='services')
    
    # Schedule
    departure_datetime = models.DateTimeField()
    arrival_datetime = models.DateTimeField()
    return_departure_datetime = models.DateTimeField(null=True, blank=True)
    return_arrival_datetime = models.DateTimeField(null=True, blank=True)
    
    # Capacity and passengers
    max_passengers = models.PositiveIntegerField()
    current_passengers = models.PositiveIntegerField(default=0)
    
    # Pricing
    price_per_passenger = models.DecimalField(max_digits=6, decimal_places=2)
    total_service_cost = models.DecimalField(max_digits=8, decimal_places=2)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    # Tracking
    actual_departure_time = models.DateTimeField(null=True, blank=True)
    actual_arrival_time = models.DateTimeField(null=True, blank=True)
    
    # Notes and requirements
    special_instructions = models.TextField(blank=True)
    accessibility_features = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transport for {self.event.title} - {self.departure_datetime.strftime('%Y-%m-%d %H:%M')}"

    @property
    def available_seats(self):
        return self.max_passengers - self.current_passengers

    @property
    def is_full(self):
        return self.current_passengers >= self.max_passengers


class Vehicle(models.Model):
    """
    Vehicles available for transport services
    """
    VEHICLE_TYPES = (
        ('car', 'Auto'),
        ('van', 'Furgón'),
        ('minibus', 'Minibús'),
        ('bus', 'Bus'),
        ('motorcycle', 'Motocicleta'),
    )
    
    FUEL_TYPES = (
        ('gasoline', 'Gasolina'),
        ('diesel', 'Diesel'),
        ('electric', 'Eléctrico'),
        ('hybrid', 'Híbrido'),
        ('gas', 'Gas'),
    )
    
    # Basic info
    license_plate = models.CharField(max_length=10, unique=True)
    brand = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.PositiveIntegerField()
    color = models.CharField(max_length=30)
    
    # Technical specifications
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    fuel_type = models.CharField(max_length=20, choices=FUEL_TYPES)
    passenger_capacity = models.PositiveIntegerField()
    
    # Owner information
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_vehicles')
    transport_group = models.ForeignKey(TransportGroup, on_delete=models.CASCADE, related_name='vehicles')
    
    # Features and accessibility
    has_air_conditioning = models.BooleanField(default=False)
    has_wifi = models.BooleanField(default=False)
    is_wheelchair_accessible = models.BooleanField(default=False)
    has_seat_belts = models.BooleanField(default=True)
    
    # Documentation
    registration_expiry = models.DateField()
    insurance_expiry = models.DateField()
    technical_review_expiry = models.DateField()
    
    # Operational status
    is_active = models.BooleanField(default=True)
    current_mileage = models.PositiveIntegerField(default=0)
    
    # Maintenance
    last_maintenance_date = models.DateField(null=True, blank=True)
    next_maintenance_due = models.DateField(null=True, blank=True)
    maintenance_notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.license_plate} - {self.brand} {self.model} ({self.year})"

    @property
    def is_documents_valid(self):
        from django.utils import timezone
        today = timezone.now().date()
        return (
            self.registration_expiry > today and
            self.insurance_expiry > today and
            self.technical_review_expiry > today
        )


class PassengerBooking(models.Model):
    """
    Individual passenger bookings for transport services
    """
    STATUS_CHOICES = (
        ('booked', 'Reservado'),
        ('confirmed', 'Confirmado'),
        ('checked_in', 'Registrado'),
        ('boarded', 'Abordó'),
        ('completed', 'Completado'),
        ('no_show', 'No Asistió'),
        ('cancelled', 'Cancelado'),
    )
    
    # Relations
    transport_service = models.ForeignKey(TransportService, on_delete=models.CASCADE, related_name='passenger_bookings')
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_bookings')
    ticket = models.OneToOneField('tickets.Ticket', on_delete=models.CASCADE, related_name='transport_booking')
    
    # Pickup details
    pickup_location = models.CharField(max_length=200)
    pickup_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    pickup_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Status and tracking
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='booked')
    seat_number = models.CharField(max_length=10, blank=True)
    
    # Timing
    estimated_pickup_time = models.DateTimeField()
    actual_pickup_time = models.DateTimeField(null=True, blank=True)
    check_in_time = models.DateTimeField(null=True, blank=True)
    
    # Special requirements
    special_needs = models.TextField(blank=True)
    emergency_contact_name = models.CharField(max_length=100, blank=True)
    emergency_contact_phone = models.CharField(max_length=20, blank=True)
    
    # QR Code for boarding
    qr_code_used = models.BooleanField(default=False)
    qr_scan_time = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.passenger.username} - {self.transport_service}"


class TransportRating(models.Model):
    """
    Ratings for transport services
    """
    # Relations
    transport_service = models.ForeignKey(TransportService, on_delete=models.CASCADE, related_name='ratings')
    passenger = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transport_ratings')
    driver = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_transport_ratings')
    
    # Ratings (1-5 scale)
    overall_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    punctuality_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    vehicle_condition_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    driver_service_rating = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)], null=True, blank=True
    )
    
    # Comments
    comment = models.TextField(blank=True)
    would_use_again = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['transport_service', 'passenger']

    def __str__(self):
        return f"Rating by {self.passenger.username} for {self.transport_service} - {self.overall_rating}★"


class TransportIncident(models.Model):
    """
    Track incidents during transport services
    """
    INCIDENT_TYPES = (
        ('delay', 'Retraso'),
        ('mechanical', 'Problema Mecánico'),
        ('accident', 'Accidente'),
        ('no_show_driver', 'Conductor No Asistió'),
        ('route_change', 'Cambio de Ruta'),
        ('other', 'Otro'),
    )
    
    SEVERITY_LEVELS = (
        ('low', 'Baja'),
        ('medium', 'Media'),
        ('high', 'Alta'),
        ('critical', 'Crítica'),
    )
    
    # Relations
    transport_service = models.ForeignKey(TransportService, on_delete=models.CASCADE, related_name='incidents')
    reported_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reported_incidents')
    
    # Incident details
    incident_type = models.CharField(max_length=20, choices=INCIDENT_TYPES)
    severity = models.CharField(max_length=20, choices=SEVERITY_LEVELS)
    title = models.CharField(max_length=200)
    description = models.TextField()
    
    # Resolution
    is_resolved = models.BooleanField(default=False)
    resolved_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='resolved_incidents'
    )
    resolution_notes = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Incident: {self.title} - {self.get_severity_display()}"

    class Meta:
        ordering = ['-created_at']
