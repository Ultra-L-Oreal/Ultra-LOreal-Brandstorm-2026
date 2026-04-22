from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from .utils import generate_otp
from django.core.mail import send_mail
from .models import EmailOTP

User = get_user_model()

@api_view(['POST'])
def send_otp(request):
    email = request.data.get('email')

    otp = generate_otp()

    EmailOTP.objects.create(email=email, otp=otp)

    send_mail(
        subject="Your ScentCraft Login Code",
        message=f"Your OTP is {otp}",
        from_email="your-email@gmail.com",
        recipient_list=[email],
    )

    return Response({"message": "OTP sent"})


@api_view(['POST'])
def verify_otp(request):
    email = request.data.get('email')
    otp = request.data.get('otp')

    try:
        otp_record = EmailOTP.objects.filter(
            email=email,
            otp=otp,
            is_verified=False
        ).latest('created_at')
    except EmailOTP.DoesNotExist:
        return Response({"error": "Invalid OTP"}, status=400)

    if otp_record.is_expired():
        return Response({"error": "OTP expired"}, status=400)

    otp_record.is_verified = True
    otp_record.save()

    user, created = User.objects.get_or_create(email=email)

    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        "message": "Login successful",
        "token": token.key
    })