from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import RegexValidator


class User(AbstractUser):
    """
    Custom User model with role-based permissions
    """
    USER_TYPES = (
        ('client', 'Cliente'),
        ('cultor', 'Cultor'),
        ('manager', 'Gestor'),
        ('transport', 'Transportista'),
        ('event_creator', 'Creador de Eventos'),
    )
    
    user_type = models.CharField(max_length=20, choices=USER_TYPES, default='client')
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$')
    phone_number = models.CharField(validators=[phone_regex], max_length=17, blank=True)
    profile_image = models.ImageField(upload_to='profiles/', null=True, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.username} - {self.get_user_type_display()}"


class UserProfile(models.Model):
    """
    Extended profile information for users
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(max_length=500, blank=True)
    location = models.CharField(max_length=100, blank=True)
    website = models.URLField(blank=True)
    social_facebook = models.URLField(blank=True)
    social_instagram = models.URLField(blank=True)
    social_youtube = models.URLField(blank=True)
    
    # Preferences
    language = models.CharField(max_length=10, default='es')
    timezone = models.CharField(max_length=50, default='America/Santiago')
    notifications_email = models.BooleanField(default=True)
    notifications_sms = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Profile: {self.user.username}"


class CultorProfile(models.Model):
    """
    Specific profile for artists/cultors
    """
    CATEGORIES = (
        ('music', 'Música'),
        ('visual_arts', 'Artes Visuales'),
        ('theater', 'Teatro'),
        ('dance', 'Danza'),
        ('crafts', 'Artesanías'),
        ('literature', 'Literatura'),
        ('photography', 'Fotografía'),
        ('other', 'Otro'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='cultor_profile')
    category = models.CharField(max_length=20, choices=CATEGORIES)
    specialties = models.JSONField(default=list, blank=True)  # List of specific skills
    experience_years = models.PositiveIntegerField(default=0)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    
    # Portfolio
    portfolio_images = models.JSONField(default=list, blank=True)
    portfolio_videos = models.JSONField(default=list, blank=True)
    achievements = models.TextField(blank=True)
    
    # Settings
    is_available = models.BooleanField(default=True)
    max_group_size = models.PositiveIntegerField(default=10)
    minimum_session_duration = models.PositiveIntegerField(default=60)  # minutes
    accepts_home_visits = models.BooleanField(default=True)
    
    # Location
    work_radius = models.PositiveIntegerField(default=10)  # km
    work_locations = models.JSONField(default=list, blank=True)
    
    # Statistics
    total_sessions = models.PositiveIntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cultor: {self.user.username} - {self.get_category_display()}"


class TransportProfile(models.Model):
    """
    Profile for transport providers
    """
    VEHICLE_TYPES = (
        ('car', 'Auto'),
        ('van', 'Furgón'),
        ('bus', 'Bus'),
        ('minibus', 'Minibús'),
    )
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='transport_profile')
    company_name = models.CharField(max_length=100, blank=True)
    license_number = models.CharField(max_length=50)
    vehicle_type = models.CharField(max_length=20, choices=VEHICLE_TYPES)
    vehicle_capacity = models.PositiveIntegerField()
    vehicle_plate = models.CharField(max_length=10)
    vehicle_model = models.CharField(max_length=50)
    vehicle_year = models.PositiveIntegerField()
    
    # Documentation
    license_expiry = models.DateField()
    insurance_expiry = models.DateField()
    technical_review_expiry = models.DateField()
    
    # Operational
    is_active = models.BooleanField(default=True)
    service_areas = models.JSONField(default=list, blank=True)
    rate_per_km = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    rate_per_passenger = models.DecimalField(max_digits=6, decimal_places=2, default=0)
    
    # Statistics
    total_trips = models.PositiveIntegerField(default=0)
    total_earnings = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Transport: {self.user.username} - {self.vehicle_plate}"
