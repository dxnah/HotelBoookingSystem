from django.urls import path
from . import views

urlpatterns = [
    # Hotels
    path('hotels/', views.HotelListCreate.as_view()),
    path('hotels/<int:pk>/', views.HotelDetail.as_view()),

    # Rooms
    path('rooms/', views.RoomListCreate.as_view()),
    path('rooms/<int:pk>/', views.RoomDetail.as_view()),

    # Clients
    path('clients/', views.ClientListCreate.as_view()),
    path('clients/<int:pk>/', views.ClientDetail.as_view()),

    # Bookings
    path('bookings/', views.BookingListCreate.as_view()),
    path('bookings/<int:pk>/', views.BookingDetail.as_view()),

    # Special Actions
    path('bookings/<int:pk>/cancel/', views.CancelBooking.as_view()),
    path('bookings/<int:pk>/reschedule/', views.RescheduleBooking.as_view()),

    # User Auth
    path('user/register/', views.UserRegisterView.as_view()),
    path('user/login/', views.UserLoginView.as_view()),
    path('user/profile/', views.UserProfileView.as_view()),

    # Authors
    path('authors/', views.AuthorListCreate.as_view()),
    path('authors/<int:pk>/', views.AuthorDetail.as_view()),
]