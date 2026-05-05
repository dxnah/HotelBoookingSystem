from rest_framework import serializers
from .models import Hotel, Room, Client, Booking, User, Author


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)

    class Meta:
        model = Room
        fields = '__all__'


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'


class BookingSerializer(serializers.ModelSerializer):
    room_number = serializers.CharField(source='room.room_number', read_only=True)
    client_name = serializers.CharField(source='client.name', read_only=True)
    hotel_name = serializers.CharField(source='room.hotel.name', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

    def validate(self, data):
        check_in = data.get('check_in')
        check_out = data.get('check_out')
        room = data.get('room')

        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )

        if room and check_in and check_out:
            overlapping = Booking.objects.filter(
                room=room,
                status='confirmed',
                check_in__lt=check_out,
                check_out__gt=check_in,
            )

            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)

            if overlapping.exists():
                raise serializers.ValidationError(
                    "This room is already booked for the selected dates."
                )

        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'phone', 'password']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'first_name', 'last_name', 'address', 'age', 'birthday', 'phone', 'date_joined']
        read_only_fields = ['email', 'date_joined']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['id', 'first_name', 'last_name']
        read_only_fields = ['user']