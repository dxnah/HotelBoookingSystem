import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookAppointment from "./pages/BookAppointment";
import ViewBookings from "./pages/ViewBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import RoomsPage from "./pages/RoomsPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("landing");
  const [previousPage, setPreviousPage] = useState("landing");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  const navigate = (page) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
  };

  const goBack = () => {
    setCurrentPage(previousPage);
    setPreviousPage("landing");
  };

  const handleAdminNav = () => {
    // Always require login when clicking Admin button
    setIsAdminAuthenticated(false);
    navigate("admin");
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    navigate("landing");
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      {currentPage === "landing" && <LandingPage navigate={navigate} onAdminClick={handleAdminNav} />}
      {currentPage === "book" && <BookAppointment navigate={navigate} goBack={goBack} previousPage={previousPage} />}
      {currentPage === "bookings" && <ViewBookings navigate={navigate} goBack={goBack} previousPage={previousPage} />}
      {currentPage === "admin" && !isAdminAuthenticated && (
        <AdminLogin
          navigate={navigate}
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
        />
      )}
      {currentPage === "admin" && isAdminAuthenticated && (
        <AdminDashboard navigate={navigate} onLogout={handleAdminLogout} />
      )}
      {currentPage === "rooms" && <RoomsPage navigate={navigate} goBack={goBack} />}
      {currentPage === "about" && <AboutPage navigate={navigate} />}
    </div>
  );
}