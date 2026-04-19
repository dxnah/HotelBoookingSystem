from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import authenticate
from datetime import date
from .models import Hotel, Room, Client, Booking
from .serializers import (
    HotelSerializer, RoomSerializer, ClientSerializer,
    BookingSerializer, UserRegistrationSerializer,
    UserProfileSerializer
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# --- Hotel ---
class HotelListCreate(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

class HotelDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

# --- Room ---
class RoomListCreate(generics.ListCreateAPIView):
    serializer_class = RoomSerializer

    def get_queryset(self):
        today = date.today()
        expired_bookings = Booking.objects.filter(
            status__in=['confirmed', 'rescheduled'],
            check_out__lt=today
        )
        for booking in expired_bookings:
            booking.room.is_available = True
            booking.room.save()
        return Room.objects.all()

class RoomDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

# --- Client ---
class ClientListCreate(generics.ListCreateAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ClientDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

# --- Booking ---
class BookingListCreate(generics.ListCreateAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_create(self, serializer):
        booking = serializer.save()
        if booking.status == 'confirmed':
            booking.room.is_available = False
            booking.room.save()

class BookingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    def perform_update(self, serializer):
        booking = serializer.save()
        if booking.status == 'cancelled':
            booking.room.is_available = True
            booking.room.save()
        elif booking.status in ['confirmed', 'rescheduled']:
            booking.room.is_available = False
            booking.room.save()

class MyBookings(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        email = request.user.email
        try:
            client = Client.objects.get(email=email)
            bookings = Booking.objects.filter(client=client)
            serializer = BookingSerializer(bookings, many=True)
            return Response(serializer.data)
        except Client.DoesNotExist:
            return Response([])

# --- Cancel Booking ---
class CancelBooking(APIView):
    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            if booking.status == 'cancelled':
                return Response({'error': 'Booking is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)
            booking.status = 'cancelled'
            booking.save()
            booking.room.is_available = True
            booking.room.save()
            return Response({'message': 'Booking cancelled successfully.'}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

# --- Reschedule Booking ---
class RescheduleBooking(APIView):
    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            if booking.status == 'cancelled':
                return Response(
                    {'error': 'Cannot reschedule a cancelled booking.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer = BookingSerializer(booking, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save(status='rescheduled')
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

# --- User Registration ---
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# --- User Login ---
class UserLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, username=email, password=password)
        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': UserProfileSerializer(user).data
            }, status=status.HTTP_200_OK)
        return Response(
            {'error': 'Invalid email or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

# --- User Profile ---
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def put(self, request):
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)