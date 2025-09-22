from django.db import models
from django.contrib.auth import get_user_model
import uuid
from decimal import Decimal

User = get_user_model()


class PaymentMethod(models.Model):
    """
    Available payment methods
    """
    PAYMENT_TYPES = (
        ('credit_card', 'Tarjeta de Crédito'),
        ('debit_card', 'Tarjeta de Débito'),
        ('bank_transfer', 'Transferencia Bancaria'),
        ('cash', 'Efectivo'),
        ('webpay', 'Webpay'),
        ('paypal', 'PayPal'),
        ('mercadopago', 'MercadoPago'),
        ('khipu', 'Khipu'),
    )
    
    name = models.CharField(max_length=100)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_TYPES)
    description = models.TextField(blank=True)
    
    # Configuration
    api_key = models.CharField(max_length=200, blank=True)
    secret_key = models.CharField(max_length=200, blank=True)
    webhook_url = models.URLField(blank=True)
    
    # Fees and limits
    fixed_fee = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    percentage_fee = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    minimum_amount = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    maximum_amount = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    
    # Settings
    is_active = models.BooleanField(default=True)
    requires_verification = models.BooleanField(default=False)
    supports_refunds = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.get_payment_type_display()})"

    def calculate_fee(self, amount):
        """Calculate fee for a given amount"""
        percentage_fee = amount * (self.percentage_fee / 100)
        return self.fixed_fee + percentage_fee


class Payment(models.Model):
    """
    Payment transactions
    """
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado'),
        ('refunded', 'Reembolsado'),
        ('partially_refunded', 'Parcialmente Reembolsado'),
    )
    
    # Identification
    payment_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    external_id = models.CharField(max_length=200, blank=True)  # Gateway transaction ID
    
    # Relations
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    ticket = models.ForeignKey('tickets.Ticket', on_delete=models.CASCADE, related_name='payments')
    payment_method = models.ForeignKey(PaymentMethod, on_delete=models.CASCADE)
    
    # Amount details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default='CLP')
    
    # Status and dates
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    
    # Gateway response
    gateway_response = models.JSONField(default=dict, blank=True)
    failure_reason = models.TextField(blank=True)
    
    # Metadata
    description = models.CharField(max_length=500, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.payment_id} - {self.status} - ${self.total_amount}"

    class Meta:
        ordering = ['-created_at']

    @property
    def is_successful(self):
        return self.status == 'completed'

    def calculate_refund_amount(self, refund_percentage=100):
        """Calculate refund amount based on percentage"""
        if refund_percentage > 100:
            refund_percentage = 100
        return (self.total_amount * Decimal(refund_percentage)) / 100


class PaymentRefund(models.Model):
    """
    Payment refunds
    """
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado'),
    )
    
    # Identification
    refund_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    external_id = models.CharField(max_length=200, blank=True)
    
    # Relations
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='refunds')
    processed_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='processed_refunds')
    
    # Amount and reason
    refund_amount = models.DecimalField(max_digits=10, decimal_places=2)
    reason = models.TextField()
    
    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # Gateway response
    gateway_response = models.JSONField(default=dict, blank=True)
    failure_reason = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Refund {self.refund_id} - ${self.refund_amount}"

    class Meta:
        ordering = ['-created_at']


class Commission(models.Model):
    """
    Commission tracking for cultors and platform
    """
    # Relations
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='commission')
    cultor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commissions')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='commissions')
    
    # Amount breakdown
    gross_amount = models.DecimalField(max_digits=10, decimal_places=2)
    platform_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=15.0)
    platform_commission = models.DecimalField(max_digits=10, decimal_places=2)
    cultor_earning = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Transport commission (if applicable)
    transport_commission = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    transport_provider = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='transport_commissions'
    )
    
    # Payout status
    is_paid_to_cultor = models.BooleanField(default=False)
    paid_to_cultor_at = models.DateTimeField(null=True, blank=True)
    payout_reference = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.platform_commission:
            self.platform_commission = (self.gross_amount * self.platform_percentage) / 100
        if not self.cultor_earning:
            self.cultor_earning = self.gross_amount - self.platform_commission - self.transport_commission
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Commission for {self.cultor.username} - Event: {self.event.title}"


class Payout(models.Model):
    """
    Payouts to cultors and transport providers
    """
    STATUS_CHOICES = (
        ('pending', 'Pendiente'),
        ('processing', 'Procesando'),
        ('completed', 'Completado'),
        ('failed', 'Fallido'),
        ('cancelled', 'Cancelado'),
    )
    
    PAYOUT_TYPES = (
        ('bank_transfer', 'Transferencia Bancaria'),
        ('paypal', 'PayPal'),
        ('check', 'Cheque'),
        ('cash', 'Efectivo'),
    )
    
    # Identification
    payout_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    
    # Relations
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payouts')
    commissions = models.ManyToManyField(Commission, related_name='payouts')
    
    # Amount and method
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    payout_method = models.CharField(max_length=20, choices=PAYOUT_TYPES)
    
    # Banking details (for bank transfers)
    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=50, blank=True)
    account_holder_name = models.CharField(max_length=200, blank=True)
    
    # Status and processing
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    processed_by = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='processed_payouts'
    )
    processed_at = models.DateTimeField(null=True, blank=True)
    
    # External references
    external_reference = models.CharField(max_length=200, blank=True)
    notes = models.TextField(blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payout {self.payout_id} - {self.recipient.username} - ${self.total_amount}"

    class Meta:
        ordering = ['-created_at']


class Invoice(models.Model):
    """
    Invoices for payments (for tax purposes)
    """
    INVOICE_TYPES = (
        ('boleta', 'Boleta'),
        ('factura', 'Factura'),
        ('factura_exenta', 'Factura Exenta'),
    )
    
    # Identification
    invoice_number = models.CharField(max_length=50, unique=True)
    invoice_type = models.CharField(max_length=20, choices=INVOICE_TYPES)
    
    # Relations
    payment = models.OneToOneField(Payment, on_delete=models.CASCADE, related_name='invoice')
    
    # Customer details
    customer_name = models.CharField(max_length=200)
    customer_rut = models.CharField(max_length=12, blank=True)  # Chilean RUT
    customer_address = models.TextField(blank=True)
    customer_email = models.EmailField()
    
    # Invoice details
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=19.0)  # IVA in Chile
    tax_amount = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    # Items
    items = models.JSONField(default=list)  # List of invoice items
    
    # Electronic invoice data (for SII compliance in Chile)
    dte_xml = models.TextField(blank=True)
    dte_pdf = models.FileField(upload_to='invoices/pdf/', blank=True, null=True)
    folio = models.CharField(max_length=20, blank=True)
    
    # Status
    is_sent = models.BooleanField(default=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.customer_name}"

    class Meta:
        ordering = ['-created_at']
