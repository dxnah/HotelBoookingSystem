import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookAppointment from "./pages/BookAppointment";
import ViewBookings from "./pages/ViewBookings";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import RoomsPage from "./pages/RoomsPage";
import AboutPage from "./pages/AboutPage";
import FeaturePage from "./pages/FeaturePage";
import FloorMapPage from "./pages/FloorMapPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
  () => {
    if (sessionStorage.getItem("isAdminAuthenticated") === "true") return "admin";
    return sessionStorage.getItem("currentPage") || "landing";
  }
);
  const [previousPage, setPreviousPage] = useState("landing");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(
    () => sessionStorage.getItem("isAdminAuthenticated") === "true"
  );
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [scrollToFeatures, setScrollToFeatures] = useState(false);

  const navigate = (page, data) => {
  if (data) setSelectedFeature(data);
  setPreviousPage(currentPage);
  setCurrentPage(page);
  setScrollToFeatures(false);
  sessionStorage.setItem("currentPage", page);
};

  const navigateToFeatures = () => {
    setScrollToFeatures(true);
    setPreviousPage(currentPage);
    setCurrentPage("landing");
  };

  const goBack = () => {
  setCurrentPage(previousPage);
  setPreviousPage("landing");
  sessionStorage.setItem("currentPage", previousPage);
};

  const handleAdminNav = () => {
    setIsAdminAuthenticated(false);
    navigate("admin");
  };

  const handleAdminLogout = () => {
    sessionStorage.removeItem("isAdminAuthenticated");
    sessionStorage.removeItem("authToken");
    setIsAdminAuthenticated(false);
    navigate("landing");
  };

  return (
    <div style={{ fontFamily: "'Cormorant Garamond', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />
      {currentPage === "landing" && <LandingPage navigate={navigate} onAdminClick={handleAdminNav} scrollToFeatures={scrollToFeatures} />}
      {currentPage === "book" && <BookAppointment navigate={navigate} goBack={goBack} previousPage={previousPage} />}
      {currentPage === "bookings" && <ViewBookings navigate={navigate} goBack={goBack} previousPage={previousPage} />}
      {currentPage === "admin" && !isAdminAuthenticated && <AdminLogin navigate={navigate} onLoginSuccess={() => {
        sessionStorage.setItem("isAdminAuthenticated", "true");
        setIsAdminAuthenticated(true);
      }} />}
      {currentPage === "admin" && isAdminAuthenticated && <AdminDashboard navigate={navigate} onLogout={handleAdminLogout} />}
      {currentPage === "rooms" && <RoomsPage navigate={navigate} goBack={goBack} />}
      {currentPage === "about" && <AboutPage navigate={navigate} />}
      {currentPage === "feature" && <FeaturePage navigate={navigate} feature={selectedFeature} onBack={navigateToFeatures} />}
      {currentPage === "floormap" && <FloorMapPage navigate={navigate} />}
    </div>
  );
}