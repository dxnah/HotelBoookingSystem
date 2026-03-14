from django.contrib import admin
from .models import Hotel, Room, Client, Booking

admin.site.register(Hotel)
admin.site.register(Room)
admin.site.register(Client)
admin.site.register(Booking)