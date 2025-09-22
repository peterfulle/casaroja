from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


class ChatRoom(models.Model):
    """
    Chat rooms for different purposes
    """
    ROOM_TYPES = (
        ('direct', 'Mensaje Directo'),
        ('event', 'Chat de Evento'),
        ('support', 'Soporte'),
        ('group', 'Grupo'),
        ('transport', 'Chat de Transporte'),
    )
    
    # Basic info
    name = models.CharField(max_length=200, blank=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPES)
    room_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Participants
    participants = models.ManyToManyField(User, through='ChatParticipant', related_name='chat_rooms')
    
    # Relations (optional, depending on room type)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, null=True, blank=True, related_name='chat_rooms')
    transport_service = models.ForeignKey(
        'transport.TransportService', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='chat_rooms'
    )
    
    # Settings
    is_active = models.BooleanField(default=True)
    is_private = models.BooleanField(default=False)
    auto_close_after_event = models.BooleanField(default=True)
    
    # Metadata
    description = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        if self.name:
            return f"{self.name} ({self.get_room_type_display()})"
        return f"Chat Room {self.room_id} ({self.get_room_type_display()})"

    @property
    def participant_count(self):
        return self.participants.count()

    @property
    def last_message(self):
        return self.messages.order_by('-created_at').first()


class ChatParticipant(models.Model):
    """
    Through model for chat room participants with additional info
    """
    ROLES = (
        ('member', 'Miembro'),
        ('admin', 'Administrador'),
        ('moderator', 'Moderador'),
        ('owner', 'Propietario'),
    )
    
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLES, default='member')
    
    # Status
    is_active = models.BooleanField(default=True)
    joined_at = models.DateTimeField(auto_now_add=True)
    left_at = models.DateTimeField(null=True, blank=True)
    
    # Notifications
    notifications_enabled = models.BooleanField(default=True)
    last_read_at = models.DateTimeField(auto_now_add=True)
    
    # Permissions
    can_send_messages = models.BooleanField(default=True)
    can_send_files = models.BooleanField(default=True)

    class Meta:
        unique_together = ['chat_room', 'user']

    def __str__(self):
        return f"{self.user.username} in {self.chat_room}"

    @property
    def unread_count(self):
        return self.chat_room.messages.filter(
            created_at__gt=self.last_read_at,
            sender__ne=self.user
        ).count()


class ChatMessage(models.Model):
    """
    Individual messages in chat rooms
    """
    MESSAGE_TYPES = (
        ('text', 'Texto'),
        ('image', 'Imagen'),
        ('file', 'Archivo'),
        ('location', 'Ubicación'),
        ('system', 'Sistema'),
        ('event_update', 'Actualización de Evento'),
    )
    
    # Basic info
    message_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    
    # Content
    message_type = models.CharField(max_length=20, choices=MESSAGE_TYPES, default='text')
    content = models.TextField()
    
    # Media attachments
    image = models.ImageField(upload_to='chat/images/', null=True, blank=True)
    file_attachment = models.FileField(upload_to='chat/files/', null=True, blank=True)
    file_name = models.CharField(max_length=255, blank=True)
    file_size = models.PositiveIntegerField(null=True, blank=True)  # in bytes
    
    # Location data (for location messages)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    location_name = models.CharField(max_length=200, blank=True)
    
    # Reply functionality
    reply_to = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='replies')
    
    # Message status
    is_edited = models.BooleanField(default=False)
    edited_at = models.DateTimeField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    # Metadata
    metadata = models.JSONField(default=dict, blank=True)  # For additional data like mentions, etc.
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        content_preview = self.content[:50] + "..." if len(self.content) > 50 else self.content
        return f"{self.sender.username}: {content_preview}"

    @property
    def is_system_message(self):
        return self.message_type == 'system'


class MessageRead(models.Model):
    """
    Track which messages have been read by which users
    """
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='read_receipts')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_reads')
    read_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['message', 'user']

    def __str__(self):
        return f"{self.user.username} read message {self.message.message_id}"


class ChatNotification(models.Model):
    """
    Notifications for chat events
    """
    NOTIFICATION_TYPES = (
        ('new_message', 'Nuevo Mensaje'),
        ('mention', 'Mencionado'),
        ('room_invite', 'Invitación a Chat'),
        ('room_update', 'Actualización de Chat'),
        ('event_reminder', 'Recordatorio de Evento'),
    )
    
    STATUS_CHOICES = (
        ('unread', 'No Leída'),
        ('read', 'Leída'),
        ('dismissed', 'Descartada'),
    )
    
    # Basic info
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_notifications')
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    
    # Content
    title = models.CharField(max_length=200)
    message = models.TextField()
    
    # Relations
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, null=True, blank=True)
    chat_message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, null=True, blank=True)
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unread')
    read_at = models.DateTimeField(null=True, blank=True)
    
    # Delivery
    sent_via_email = models.BooleanField(default=False)
    sent_via_push = models.BooleanField(default=False)
    
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.notification_type} for {self.user.username}: {self.title}"


class SupportTicket(models.Model):
    """
    Support tickets for customer service
    """
    PRIORITY_LEVELS = (
        ('low', 'Baja'),
        ('normal', 'Normal'),
        ('high', 'Alta'),
        ('urgent', 'Urgente'),
    )
    
    STATUS_CHOICES = (
        ('open', 'Abierto'),
        ('in_progress', 'En Progreso'),
        ('waiting_customer', 'Esperando Cliente'),
        ('resolved', 'Resuelto'),
        ('closed', 'Cerrado'),
    )
    
    CATEGORIES = (
        ('technical', 'Técnico'),
        ('billing', 'Facturación'),
        ('event', 'Evento'),
        ('transport', 'Transporte'),
        ('account', 'Cuenta'),
        ('general', 'General'),
    )
    
    # Basic info
    ticket_number = models.CharField(max_length=20, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORIES)
    priority = models.CharField(max_length=20, choices=PRIORITY_LEVELS, default='normal')
    
    # Relations
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='support_tickets')
    assigned_to = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='assigned_tickets'
    )
    chat_room = models.OneToOneField(ChatRoom, on_delete=models.CASCADE, related_name='support_ticket')
    
    # Related objects
    event = models.ForeignKey('events.Event', on_delete=models.SET_NULL, null=True, blank=True)
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.SET_NULL, null=True, blank=True)
    payment = models.ForeignKey('payments.Payment', on_delete=models.SET_NULL, null=True, blank=True)
    
    # Status and resolution
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    resolution = models.TextField(blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    
    # Satisfaction
    customer_rating = models.PositiveIntegerField(null=True, blank=True)  # 1-5 scale
    customer_feedback = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.ticket_number:
            # Generate ticket number
            count = SupportTicket.objects.count() + 1
            self.ticket_number = f"SUP-{count:06d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.ticket_number}: {self.title}"

    class Meta:
        ordering = ['-created_at']


class ChatModerationLog(models.Model):
    """
    Log of moderation actions in chat rooms
    """
    ACTIONS = (
        ('message_deleted', 'Mensaje Eliminado'),
        ('user_muted', 'Usuario Silenciado'),
        ('user_kicked', 'Usuario Expulsado'),
        ('user_banned', 'Usuario Baneado'),
        ('warning_issued', 'Advertencia Emitida'),
    )
    
    # Basic info
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='moderation_logs')
    moderator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='moderation_actions')
    target_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='received_moderations')
    
    # Action details
    action = models.CharField(max_length=30, choices=ACTIONS)
    reason = models.TextField()
    
    # Related objects
    message = models.ForeignKey(ChatMessage, on_delete=models.SET_NULL, null=True, blank=True)
    
    # Duration (for temporary actions like mutes)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.action} by {self.moderator.username} on {self.target_user.username}"

    class Meta:
        ordering = ['-created_at']
