import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookAppointment from "./pages/BookAppointment";
import ViewBookings from "./pages/ViewBookings";
import AdminDashboard from "./pages/AdminDashboard";
import RoomsPage from "./pages/RoomsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");

  const navigate = (page) => setCurrentPage(page);

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      {currentPage === "landing" && <LandingPage navigate={navigate} />}
      {currentPage === "book" && <BookAppointment navigate={navigate} />}
      {currentPage === "bookings" && <ViewBookings navigate={navigate} />}
      {currentPage === "admin" && <AdminDashboard navigate={navigate} />}
      {currentPage === "rooms" && <RoomsPage navigate={navigate} />}
    </div>
  );
}