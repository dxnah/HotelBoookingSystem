from rest_framework import serializers
from .models import Hotel, Room, Client, Booking


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

        # Check out must be after check in
        if check_in and check_out:
            if check_out <= check_in:
                raise serializers.ValidationError(
                    "Check-out date must be after check-in date."
                )

        # Conflict detection — same room, overlapping dates
        if room and check_in and check_out:
            overlapping = Booking.objects.filter(
                room=room,
                status='confirmed',
                check_in__lt=check_out,
                check_out__gt=check_in,
            )

            # Exclude self when updating
            if self.instance:
                overlapping = overlapping.exclude(pk=self.instance.pk)

            if overlapping.exists():
                raise serializers.ValidationError(
                    "This room is already booked for the selected dates."
                )

        return data