from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, BasePermission
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .models import Hotel, Room, Client, Booking, User, Author
from .serializers import (
    HotelSerializer, RoomSerializer, ClientSerializer, BookingSerializer,
    UserRegistrationSerializer, UserLoginSerializer, UserProfileSerializer,
    AuthorSerializer
)


# --- Hotel ---
class HotelListCreate(generics.ListCreateAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


class HotelDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer


# --- Room ---
class RoomListCreate(generics.ListCreateAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer


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


class BookingDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


# --- Cancel Booking ---
class CancelBooking(APIView):
    def patch(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
            if booking.status == 'cancelled':
                return Response(
                    {'error': 'Booking is already cancelled.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            booking.status = 'cancelled'
            booking.save()
            return Response(
                {'message': 'Booking cancelled successfully.'},
                status=status.HTTP_200_OK
            )
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


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
            serializer = BookingSerializer(
                booking,
                data=request.data,
                partial=True
            )
            if serializer.is_valid():
                serializer.save(status='rescheduled')
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Booking.DoesNotExist:
            return Response(
                {'error': 'Booking not found.'},
                status=status.HTTP_404_NOT_FOUND
            )


# --- User Registration ---
class UserRegisterView(APIView):
    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
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
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
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


# --- Author Permissions ---
class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user


# --- Authors ---
class AuthorListCreate(generics.ListCreateAPIView):
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Author.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AuthorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = AuthorSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Author.objects.filter(user=self.request.user)