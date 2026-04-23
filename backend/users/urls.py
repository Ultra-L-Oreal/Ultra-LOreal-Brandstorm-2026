   
from django.urls import path
from .views import send_otp, verify_otp

urlpatterns = [
    path('verify-otp/', verify_otp),
    path('send-otp/', send_otp),
]