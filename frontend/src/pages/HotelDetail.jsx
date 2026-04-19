import { useState, useEffect } from "react";
import { API_BASE } from "../api";

const HOTEL_GALLERY = [
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
];

const AMENITIES = [
  { icon: "🍽️", label: "Fine Dining" },
  { icon: "💆", label: "Spa & Wellness" },
  { icon: "🏊", label: "Infinity Pool" },
  { icon: "🚗", label: "Valet Parking" },
  { icon: "🏋️", label: "Fitness Center" },
  { icon: "🍸", label: "Bar & Lounge" },
  { icon: "💼", label: "Conference Rooms" },
  { icon: "📶", label: "Free Wi-Fi" },
  { icon: "🎉", label: "Function Hall" },
  { icon: "🛎️", label: "24/7 Concierge" },
  { icon: "🧺", label: "Laundry Service" },
  { icon: "🚐", label: "Airport Shuttle" },
];

export default function HotelDetail({ navigate, hotelId }) {
  const [hotel, setHotel] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePhoto, setActivePhoto] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [hRes, rRes] = await Promise.all([
          fetch(`${API_BASE}/hotels/${hotelId}/`),
          fetch(`${API_BASE}/rooms/?hotel=${hotelId}`),
        ]);
        if (hRes.ok) setHotel(await hRes.json());
        if (rRes.ok) {
          const data = await rRes.json();
          setRooms(Array.isArray(data) ? data.filter(r => r.hotel === hotelId) : []);
        }
      } catch {
        // fallback silently
      } finally {
        setLoading(false);
      }
    };
    if (hotelId) fetchData();
  }, [hotelId]);

  const roomTypes = [...new Set(rooms.map(r => r.room_type))];
  const minPrice = rooms.length > 0
    ? Math.min(...rooms.map(r => parseFloat(r.price_per_night || 0)))
    : 0;
  const availableCount = rooms.filter(r => r.is_available).length;
  const displayAmenities = showAllAmenities ? AMENITIES : AMENITIES.slice(0, 6);

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <div style={{ width: "48px", height: "48px", border: "1px solid #c9a96e", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#c9a96e" }}>LOADING</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .gv-thumb { transition: opacity 0.2s, border-color 0.2s; }
        .gv-thumb:hover { opacity: 1 !important; }
        .gv-room-type:hover { background: rgba(201,169,110,0.08) !important; border-color: rgba(201,169,110,0.3) !important; }
      `}</style>

      <nav style={S.nav}>
        <button style={S.backBtn} onClick={() => navigate("book")}>← Back to Booking</button>
        <div style={S.logo}>GRAND<span style={S.logoAccent}>VELOUR</span></div>
        <button style={S.bookNowBtn} onClick={() => navigate("book")}>Book Now</button>
      </nav>

      {/* Hero Gallery */}
      <div style={S.galleryWrap}>
        <div style={S.galleryMain}>
          <img
            src={HOTEL_GALLERY[activePhoto]}
            alt={hotel?.name || "Hotel"}
            style={S.galleryMainImg}
          />
          <div style={S.galleryOverlay} />
          <div style={S.galleryHeroText}>
            <p style={S.galleryEyebrow}>GRAND VELOUR COLLECTION</p>
            <h1 style={S.galleryTitle}>{hotel?.name || "Hotel"}</h1>
            <p style={S.galleryAddr}>📍 {hotel?.address}</p>
          </div>
        </div>
        <div style={S.galleryThumbs}>
          {HOTEL_GALLERY.map((img, i) => (
            <button
              key={i}
              className="gv-thumb"
              onClick={() => setActivePhoto(i)}
              style={{
                ...S.galleryThumb,
                opacity: activePhoto === i ? 1 : 0.5,
                border: `2px solid ${activePhoto === i ? "#c9a96e" : "transparent"}`,
                padding: 0, cursor: "pointer", background: "none",
              }}
            >
              <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </button>
          ))}
        </div>
      </div>

      <div style={S.body}>
        {/* Quick Stats */}
        <div style={S.statsBar}>
          {[
            ["ROOMS AVAILABLE", `${availableCount} / ${rooms.length}`],
            ["STARTING FROM", minPrice > 0 ? `₱${minPrice.toLocaleString()}/night` : "—"],
            ["ROOM TYPES", roomTypes.length > 0 ? roomTypes.join(", ") : "—"],
            ["CONTACT", hotel?.phone || "—"],
          ].map(([label, val]) => (
            <div key={label} style={S.statItem}>
              <p style={S.statLabel}>{label}</p>
              <p style={S.statVal}>{val}</p>
            </div>
          ))}
        </div>

        <div style={S.twoCol}>
          {/* Left: About + Amenities */}
          <div>
            <div style={{ animation: "fadeUp 0.4s ease forwards" }}>
              <h2 style={S.sectionTitle}>About This Property</h2>
              <p style={S.about}>
                {hotel?.name} is part of the Grand Velour collection — a curated portfolio of luxury hotels across the Philippines.
                Each property blends contemporary elegance with authentic local character, offering guests an unforgettable experience
                from arrival to departure. Our team is dedicated to anticipating your every need.
              </p>
              {hotel?.email && (
                <p style={S.contactLine}>✉️ <span style={{ color: "#8a7a68" }}>{hotel.email}</span></p>
              )}
              {hotel?.phone && (
                <p style={S.contactLine}>📞 <span style={{ color: "#8a7a68" }}>{hotel.phone}</span></p>
              )}
            </div>

            <div style={{ marginTop: "40px" }}>
              <h2 style={S.sectionTitle}>Amenities & Services</h2>
              <div style={S.amenityGrid}>
                {displayAmenities.map(({ icon, label }) => (
                  <div key={label} style={S.amenityItem}>
                    <span style={{ fontSize: "20px", flexShrink: 0 }}>{icon}</span>
                    <span style={S.amenityLabel}>{label}</span>
                  </div>
                ))}
              </div>
              {!showAllAmenities && (
                <button style={S.showMoreBtn} onClick={() => setShowAllAmenities(true)}>
                  + Show all amenities
                </button>
              )}
            </div>

            {/* Room Types Summary */}
            {roomTypes.length > 0 && (
              <div style={{ marginTop: "40px" }}>
                <h2 style={S.sectionTitle}>Available Room Types</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {roomTypes.map(type => {
                    const typeRooms = rooms.filter(r => r.room_type === type);
                    const avail = typeRooms.filter(r => r.is_available).length;
                    const sample = typeRooms[0];
                    return (
                      <div key={type} className="gv-room-type" style={S.roomTypeRow}
                        onClick={() => navigate("book")}>
                        <div>
                          <p style={S.roomTypeName}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                          <p style={S.roomTypeSub}>
                            {avail} of {typeRooms.length} available · Up to {sample?.capacity} guests
                          </p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <p style={S.roomTypePrice}>₱{parseFloat(sample?.price_per_night || 0).toLocaleString()}</p>
                          <p style={S.roomTypePer}>per night</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Map + CTA */}
          <div>
            <div style={S.mapWrap}>
              <p style={S.mapLabel}>LOCATION</p>
              <div style={S.mapContainer}>
                <iframe
                  title="Hotel Location"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) saturate(0.7)" }}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(hotel?.address || "Philippines")}&output=embed`}
                  allowFullScreen
                />
              </div>
              <p style={S.mapAddress}>{hotel?.address}</p>
            </div>

            <div style={S.ctaCard}>
              <p style={S.ctaTitle}>Ready to book?</p>
              <p style={S.ctaSub}>
                {availableCount > 0
                  ? `${availableCount} room${availableCount !== 1 ? "s" : ""} available right now`
                  : "Check back soon for availability"}
              </p>
              <button style={S.ctaBtn} onClick={() => navigate("book")}>
                Reserve a Room →
              </button>
              <button style={S.ctaGhost} onClick={() => navigate("contact")}>
                Send an Inquiry
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520", position: "sticky", top: 0, background: "rgba(13,13,13,0.9)", backdropFilter: "blur(10px)", zIndex: 100 },
  backBtn: { background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "8px 16px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoAccent: { color: "#c9a96e" },
  bookNowBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 28px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  galleryWrap: { display: "grid", gridTemplateColumns: "1fr 140px", height: "480px" },
  galleryMain: { position: "relative", overflow: "hidden" },
  galleryMainImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.4s" },
  galleryOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" },
  galleryHeroText: { position: "absolute", bottom: "36px", left: "48px", zIndex: 2 },
  galleryEyebrow: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", margin: "0 0 8px" },
  galleryTitle: { fontSize: "44px", fontWeight: 300, margin: "0 0 8px", textShadow: "0 2px 20px rgba(0,0,0,0.5)" },
  galleryAddr: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#9a8a78", margin: 0 },
  galleryThumbs: { display: "flex", flexDirection: "column", gap: "0", borderLeft: "1px solid #1e1a16", overflow: "hidden" },
  galleryThumb: { flex: 1, overflow: "hidden" },
  body: { padding: "0 60px 80px" },
  statsBar: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderBottom: "1px solid #1e1a16", marginBottom: "48px" },
  statItem: { padding: "24px 0", borderRight: "1px solid #1e1a16", paddingLeft: "32px" },
  statLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase", margin: "0 0 6px" },
  statVal: { fontFamily: "'Jost', sans-serif", fontSize: "15px", color: "#c9a96e", margin: 0 },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 360px", gap: "48px" },
  sectionTitle: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 20px", paddingBottom: "12px", borderBottom: "1px solid #1e1a16" },
  about: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#6a5f52", lineHeight: 1.8, margin: "0 0 16px" },
  contactLine: { fontFamily: "'Jost', sans-serif", fontSize: "13px", margin: "8px 0" },
  amenityGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },
  amenityItem: { display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", border: "1px solid #1e1a16", background: "#111" },
  amenityLabel: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68" },
  showMoreBtn: { background: "none", border: "1px solid #2a2520", color: "#6a5f52", padding: "10px 20px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", cursor: "pointer", textTransform: "uppercase", marginTop: "12px" },
  roomTypeRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", border: "1px solid #1e1a16", background: "#111", cursor: "pointer", transition: "all 0.2s" },
  roomTypeName: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 4px" },
  roomTypeSub: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", margin: 0 },
  roomTypePrice: { fontSize: "20px", fontWeight: 300, color: "#c9a96e", margin: "0 0 2px" },
  roomTypePer: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", margin: 0 },
  mapWrap: { marginBottom: "24px" },
  mapLabel: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 16px", paddingBottom: "12px", borderBottom: "1px solid #1e1a16" },
  mapContainer: { height: "260px", border: "1px solid #1e1a16", overflow: "hidden" },
  mapAddress: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", margin: "8px 0 0", letterSpacing: "0.5px" },
  ctaCard: { background: "#111", border: "1px solid #2a2520", padding: "28px 24px", textAlign: "center" },
  ctaTitle: { fontSize: "24px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 8px" },
  ctaSub: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", margin: "0 0 24px" },
  ctaBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "13px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500, width: "100%", marginBottom: "10px" },
  ctaGhost: { background: "none", border: "1px solid #2a2520", color: "#6a5f52", padding: "13px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", width: "100%" },
};