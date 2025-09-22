from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, UserProfile, CultorProfile, TransportProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'user_type', 'is_verified', 'is_active', 'date_joined')
    list_filter = ('user_type', 'is_verified', 'is_active', 'date_joined')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    fieldsets = UserAdmin.fieldsets + (
        ('Custom Fields', {
            'fields': ('user_type', 'phone_number', 'profile_image', 'birth_date', 'is_verified')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'location', 'language', 'notifications_email')
    list_filter = ('language', 'notifications_email', 'notifications_sms')
    search_fields = ('user__username', 'user__email', 'location')


@admin.register(CultorProfile)
class CultorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'category', 'hourly_rate', 'is_available', 'total_sessions', 'average_rating')
    list_filter = ('category', 'is_available', 'experience_years')
    search_fields = ('user__username', 'user__email')
    readonly_fields = ('total_sessions', 'average_rating', 'total_earnings')


@admin.register(TransportProfile)
class TransportProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'vehicle_type', 'vehicle_plate', 'vehicle_capacity', 'is_active')
    list_filter = ('vehicle_type', 'is_active')
    search_fields = ('user__username', 'vehicle_plate', 'company_name')
