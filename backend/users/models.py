
from django.utils import timezone
from datetime import timedelta

from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    username = None
    email = models.EmailField(unique=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

class EmailOTP(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_verified = models.BooleanField(default=False)

    def is_expired(self):
        from datetime import timedelta
        return self.created_at < timezone.now() - timedelta(minutes=5)