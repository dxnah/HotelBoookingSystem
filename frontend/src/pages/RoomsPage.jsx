import { useState } from "react";

const rooms = [
  {
    id: 1,
    name: "Deluxe Suite",
    price: "₱4,500",
    img: "🛏️",
    type: "deluxe",
    capacity: 2,
    size: "45 sqm",
    desc: "King bed, sea view, private balcony",
    details: "Our Deluxe Suite offers a breathtaking sea view from your private balcony. Featuring a king-size bed with premium linens, a modern bathroom with rainfall shower, and a cozy sitting area perfect for unwinding after a long day.",
    amenities: ["King Bed", "Sea View", "Private Balcony", "Rainfall Shower", "Mini Bar", "Smart TV", "Free WiFi", "Air Conditioning"],
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
  },
  {
    id: 2,
    name: "Classic Room",
    price: "₱2,200",
    img: "🏨",
    type: "single",
    capacity: 1,
    size: "28 sqm",
    desc: "Queen bed, city view, complimentary breakfast",
    details: "The Classic Room is perfect for solo travelers or couples looking for comfort and value. Enjoy a stunning city view from your window, and start your morning with our complimentary breakfast served in the dining area.",
    amenities: ["Queen Bed", "City View", "Complimentary Breakfast", "Work Desk", "Smart TV", "Free WiFi", "Air Conditioning", "In-room Safe"],
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
  },
  {
    id: 3,
    name: "Presidential Suite",
    price: "₱12,000",
    img: "👑",
    type: "suite",
    capacity: 4,
    size: "120 sqm",
    desc: "Two bedrooms, living room, butler service",
    details: "The pinnacle of luxury, our Presidential Suite spans over 120 square meters featuring two bedrooms, a spacious living room, a private dining area, and dedicated butler service available around the clock.",
    amenities: ["2 King Beds", "Living Room", "Butler Service", "Private Dining", "Jacuzzi", "Premium Bar", "Panoramic View", "VIP Lounge Access"],
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
  },
  {
    id: 4,
    name: "Superior Twin",
    price: "₱3,200",
    img: "🛌",
    type: "double",
    capacity: 2,
    size: "35 sqm",
    desc: "Two twin beds, garden view, ideal for friends",
    details: "The Superior Twin Room is ideal for friends or colleagues traveling together. With two comfortable twin beds and a serene garden view, it offers a relaxing retreat in the middle of the city.",
    amenities: ["2 Twin Beds", "Garden View", "Work Desk", "Smart TV", "Free WiFi", "Air Conditioning", "Daily Housekeeping", "Coffee Maker"],
    image: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
  },
  {
    id: 5,
    name: "Junior Suite",
    price: "₱6,800",
    img: "✨",
    type: "suite",
    capacity: 2,
    size: "65 sqm",
    desc: "King bed, separate living area, rooftop access",
    details: "The Junior Suite offers a generous living space with a separate seating area and exclusive rooftop access. Perfect for romantic getaways or special occasions, it combines elegance with comfort.",
    amenities: ["King Bed", "Living Area", "Rooftop Access", "Soaking Tub", "Premium Toiletries", "Smart TV", "Free WiFi", "Turndown Service"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
  },
  {
    id: 6,
    name: "Family Room",
    price: "₱5,500",
    img: "👨‍👩‍👧",
    type: "double",
    capacity: 4,
    size: "55 sqm",
    desc: "Two queen beds, kids amenities, pool view",
    details: "Designed for families, this spacious room features two queen beds and special amenities for children. Enjoy a lovely pool view and easy access to the family-friendly areas of the hotel.",
    amenities: ["2 Queen Beds", "Pool View", "Kids Amenities", "Extra Pillows", "Smart TV", "Free WiFi", "Air Conditioning", "Adjoining Room Option"],
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
  },
];

const typeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

export default function RoomsPage({ navigate }) {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? rooms : rooms.filter(r => r.type === filter);

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back</button>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <button style={styles.bookNavBtn} onClick={() => navigate("book")}>Reserve a Room</button>
      </nav>

      {/* Header */}
      <div style={styles.header}>
        <p style={styles.headerSub}>EXPLORE OUR SPACES</p>
        <h1 style={styles.headerTitle}>Our Accommodations</h1>
        <p style={styles.headerDesc}>From cozy classic rooms to lavish presidential suites — find your perfect stay.</p>
      </div>

      {/* Filter */}
      <div style={styles.filterBar}>
        {["all", "single", "double", "deluxe", "suite"].map(f => (
          <button
            key={f}
            style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
            onClick={() => setFilter(f)}
          >
            {f === "all" ? "All Rooms" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Rooms Grid */}
      <div style={styles.grid}>
        {filtered.map(room => (
          <div key={room.id} style={styles.card} onClick={() => setSelected(room)}>
            <div style={styles.cardImgWrap}>
              <img src={room.image} alt={room.name} style={styles.cardImg} />
              <div style={styles.cardImgOverlay} />
              <span style={{ ...styles.typeBadge, color: typeColor[room.type], background: typeColor[room.type] + "22", border: `1px solid ${typeColor[room.type]}44` }}>
                {room.type}
              </span>
            </div>
            <div style={styles.cardBody}>
              <div style={styles.cardTop}>
                <h3 style={styles.cardName}>{room.name}</h3>
                <span style={styles.cardPrice}>{room.price}<span style={styles.perNight}>/night</span></span>
              </div>
              <p style={styles.cardDesc}>{room.desc}</p>
              <div style={styles.cardMeta}>
                <span style={styles.metaItem}>👥 {room.capacity} guest{room.capacity > 1 ? "s" : ""}</span>
                <span style={styles.metaItem}>📐 {room.size}</span>
              </div>
              <button style={styles.viewBtn}>View Details →</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            {/* Image */}
            <div style={styles.modalImgWrap}>
              <img src={selected.image} alt={selected.name} style={styles.modalImg} />
              <div style={styles.modalImgOverlay} />
              <button style={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
              <div style={styles.modalImgText}>
                <span style={{ ...styles.modalTypeBadge, color: typeColor[selected.type] }}>{selected.type}</span>
                <h2 style={styles.modalTitle}>{selected.name}</h2>
                <p style={styles.modalPrice}>{selected.price}<span style={{ fontSize: "14px", color: "#a09080" }}>/night</span></p>
              </div>
            </div>

            {/* Body */}
            <div style={styles.modalBody}>
              <div style={styles.modalMeta}>
                <span style={styles.modalMetaItem}>👥 Up to {selected.capacity} guests</span>
                <span style={styles.modalMetaItem}>📐 {selected.size}</span>
              </div>
              <p style={styles.modalDesc}>{selected.details}</p>

              {/* Amenities */}
              <p style={styles.amenitiesLabel}>AMENITIES</p>
              <div style={styles.amenitiesGrid}>
                {selected.amenities.map((a, i) => (
                  <span key={i} style={styles.amenityItem}>✓ {a}</span>
                ))}
              </div>

              <button style={styles.bookBtn} onClick={() => { setSelected(null); navigate("book"); }}>
                Book This Room
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 100 },
  backBtn: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px" },
  logoAccent: { color: "#c9a96e" },
  bookNavBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  header: { textAlign: "center", padding: "80px 60px 40px" },
  headerSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", marginBottom: "16px" },
  headerTitle: { fontSize: "60px", fontWeight: 300, margin: "0 0 20px" },
  headerDesc: { fontFamily: "'Jost', sans-serif", fontSize: "15px", color: "#6a5f52", margin: 0 },
  filterBar: { display: "flex", justifyContent: "center", gap: "12px", padding: "0 60px 48px" },
  filterBtn: { background: "none", border: "1px solid #1e1a16", color: "#4a3f32", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
  filterActive: { border: "1px solid #c9a96e", color: "#c9a96e", background: "rgba(201,169,110,0.08)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", padding: "0 60px 80px" },
  card: { background: "#111", border: "1px solid #1e1a16", cursor: "pointer", overflow: "hidden" },
  cardImgWrap: { position: "relative", height: "220px", overflow: "hidden" },
  cardImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" },
  cardImgOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.3)" },
  typeBadge: { position: "absolute", top: "16px", left: "16px", padding: "4px 12px", fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" },
  cardBody: { padding: "28px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  cardName: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: 0 },
  cardPrice: { fontSize: "20px", fontWeight: 300, color: "#c9a96e", whiteSpace: "nowrap" },
  perNight: { fontSize: "11px", color: "#6a5f52", fontFamily: "'Jost', sans-serif" },
  cardDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", lineHeight: 1.6, margin: "0 0 16px" },
  cardMeta: { display: "flex", gap: "20px", marginBottom: "20px" },
  metaItem: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32" },
  viewBtn: { background: "none", border: "none", color: "#c9a96e", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", padding: 0 },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: "20px" },
  modal: { background: "#111", border: "1px solid #2a2520", width: "600px", maxHeight: "90vh", overflow: "auto" },
  modalImgWrap: { position: "relative", height: "300px", flexShrink: 0 },
  modalImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  modalImgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.2) 60%)" },
  closeBtn: { position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.5)", border: "1px solid #2a2520", color: "#e8dcc8", cursor: "pointer", width: "32px", height: "32px", fontSize: "14px" },
  modalImgText: { position: "absolute", bottom: "24px", left: "32px" },
  modalTypeBadge: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", display: "block", marginBottom: "8px" },
  modalTitle: { fontSize: "36px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 8px" },
  modalPrice: { fontSize: "28px", fontWeight: 300, color: "#c9a96e", margin: 0 },
  modalBody: { padding: "32px" },
  modalMeta: { display: "flex", gap: "24px", marginBottom: "20px" },
  modalMetaItem: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52" },
  modalDesc: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68", lineHeight: 1.8, margin: "0 0 28px" },
  amenitiesLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 16px" },
  amenitiesGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "32px" },
  amenityItem: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68" },
  bookBtn: { width: "100%", background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
};