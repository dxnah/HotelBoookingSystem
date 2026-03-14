import { useState } from "react";

const ROOM_TYPES = ["single", "double", "suite", "deluxe"];

const mockHotels = [
  { id: 1, name: "Grand Velour Manila", address: "Ayala Ave, Makati", phone: "02-8123-4567", email: "manila@grandvelour.com" },
  { id: 2, name: "Grand Velour Cebu", address: "Colon St, Cebu City", phone: "032-234-5678", email: "cebu@grandvelour.com" },
];

const mockRooms = [
  { id: 1, hotel: 1, room_number: "101", room_type: "single", price_per_night: 1800, is_available: true, capacity: 1, description: "Cozy single room with city view" },
  { id: 2, hotel: 1, room_number: "201", room_type: "double", price_per_night: 2800, is_available: true, capacity: 2, description: "Spacious double room with balcony" },
  { id: 3, hotel: 1, room_number: "301", room_type: "suite", price_per_night: 6500, is_available: false, capacity: 3, description: "Luxurious suite with living area" },
  { id: 4, hotel: 1, room_number: "401", room_type: "deluxe", price_per_night: 4500, is_available: true, capacity: 2, description: "Deluxe room with premium amenities" },
  { id: 5, hotel: 2, room_number: "101", room_type: "single", price_per_night: 1600, is_available: true, capacity: 1, description: "Single room with garden view" },
  { id: 6, hotel: 2, room_number: "201", room_type: "double", price_per_night: 2600, is_available: true, capacity: 2, description: "Double room near the beach" },
];

export default function BookAppointment({ navigate }) {
  const [step, setStep] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    check_in: "", check_out: "", notes: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const filteredRooms = mockRooms.filter(r => r.hotel === selectedHotel?.id && r.is_available);

  const nights = form.check_in && form.check_out
    ? Math.max(0, (new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoom ? selectedRoom.price_per_night * nights : 0;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const roomTypeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

  if (submitted) {
    return (
      <div style={styles.page}>
        <nav style={styles.nav}>
          <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
          <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        </nav>
        <div style={styles.successWrap}>
          <div style={styles.successCard}>
            <div style={styles.successIcon}>✓</div>
            <h2 style={styles.successTitle}>Booking Confirmed!</h2>
            <p style={styles.successDesc}>
              Thank you, <strong>{form.name}</strong>! Your booking at{" "}
              <strong>{selectedHotel?.name}</strong> — Room {selectedRoom?.room_number} ({selectedRoom?.room_type}) has been confirmed.
            </p>
            <div style={styles.successDetails}>
              <div style={styles.detailRow}><span>Check-in</span><strong>{form.check_in}</strong></div>
              <div style={styles.detailRow}><span>Check-out</span><strong>{form.check_out}</strong></div>
              <div style={styles.detailRow}><span>Nights</span><strong>{nights}</strong></div>
              <div style={styles.detailRow}><span>Total</span><strong style={{ color: "#c9a96e" }}>₱{totalPrice.toLocaleString()}</strong></div>
            </div>
            <div style={{ display: "flex", gap: "12px", marginTop: "32px" }}>
              <button style={styles.primaryBtn} onClick={() => navigate("bookings")}>View My Bookings</button>
              <button style={styles.outlineBtn} onClick={() => navigate("landing")}>Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
      </nav>

      {/* Stepper */}
      <div style={styles.stepper}>
        {["Select Hotel", "Choose Room", "Your Details", "Confirm"].map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, ...(step > i + 1 ? styles.stepDone : step === i + 1 ? styles.stepActive : {}) }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, ...(step === i + 1 ? { color: "#c9a96e" } : {}) }}>{label}</span>
            {i < 3 && <div style={styles.stepLine} />}
          </div>
        ))}
      </div>

      <div style={styles.content}>
        {/* Step 1: Select Hotel */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Select a Hotel</h2>
            <div style={styles.hotelGrid}>
              {mockHotels.map(hotel => (
                <div
                  key={hotel.id}
                  style={{ ...styles.hotelCard, ...(selectedHotel?.id === hotel.id ? styles.hotelSelected : {}) }}
                  onClick={() => setSelectedHotel(hotel)}
                >
                  <div style={styles.hotelIcon}>🏨</div>
                  <h3 style={styles.hotelName}>{hotel.name}</h3>
                  <p style={styles.hotelAddr}>📍 {hotel.address}</p>
                  <p style={styles.hotelContact}>📞 {hotel.phone}</p>
                  <p style={styles.hotelContact}>✉️ {hotel.email}</p>
                </div>
              ))}
            </div>
            <button style={{ ...styles.primaryBtn, opacity: selectedHotel ? 1 : 0.4 }} disabled={!selectedHotel} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: Choose Room */}
        {step === 2 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Choose a Room at {selectedHotel?.name}</h2>
            {filteredRooms.length === 0
              ? <p style={{ color: "#6a5f52", fontFamily: "'Jost', sans-serif" }}>No available rooms at this hotel.</p>
              : (
                <div style={styles.roomGrid}>
                  {filteredRooms.map(room => (
                    <div
                      key={room.id}
                      style={{ ...styles.roomCard, ...(selectedRoom?.id === room.id ? styles.roomSelected : {}) }}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <h3 style={styles.roomNum}>Room {room.room_number}</h3>
                        <span style={{ ...styles.roomTypeBadge, background: roomTypeColor[room.room_type] + "22", color: roomTypeColor[room.room_type] }}>
                          {room.room_type}
                        </span>
                      </div>
                      <p style={styles.roomDesc}>{room.description}</p>
                      <div style={styles.roomMeta}>
                        <span>👥 Capacity: {room.capacity}</span>
                        <span style={styles.roomPrice}>₱{room.price_per_night.toLocaleString()}/night</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={styles.outlineBtn} onClick={() => setStep(1)}>← Back</button>
              <button style={{ ...styles.primaryBtn, opacity: selectedRoom ? 1 : 0.4 }} disabled={!selectedRoom} onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Client Details */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Your Details</h2>
            <div style={styles.formGrid}>
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Juan dela Cruz" },
                { label: "Email Address", key: "email", type: "email", placeholder: "juan@email.com" },
                { label: "Phone Number", key: "phone", type: "tel", placeholder: "09XX-XXX-XXXX" },
                { label: "Check-in Date", key: "check_in", type: "date" },
                { label: "Check-out Date", key: "check_out", type: "date" },
              ].map(field => (
                <div key={field.key} style={field.key === "notes" ? { gridColumn: "span 2" } : {}}>
                  <label style={styles.label}>{field.label}</label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder || ""}
                    value={form[field.key]}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    style={styles.input}
                    min={field.key === "check_out" ? form.check_in : field.key === "check_in" ? new Date().toISOString().split("T")[0] : undefined}
                  />
                </div>
              ))}
              <div style={{ gridColumn: "span 2" }}>
                <label style={styles.label}>Notes (optional)</label>
                <textarea
                  placeholder="Any special requests..."
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...styles.input, height: "80px", resize: "vertical" }}
                />
              </div>
            </div>
            {nights > 0 && (
              <div style={styles.priceSummary}>
                <span>₱{selectedRoom?.price_per_night.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span style={{ color: "#c9a96e", fontSize: "20px" }}>₱{totalPrice.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={styles.outlineBtn} onClick={() => setStep(2)}>← Back</button>
              <button
                style={{ ...styles.primaryBtn, opacity: (form.name && form.email && form.phone && form.check_in && form.check_out && nights > 0) ? 1 : 0.4 }}
                disabled={!(form.name && form.email && form.phone && form.check_in && form.check_out && nights > 0)}
                onClick={() => setStep(4)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 4 && (
          <div style={styles.stepContent}>
            <h2 style={styles.stepTitle}>Confirm Booking</h2>
            <div style={styles.confirmCard}>
              <div style={styles.confirmSection}>
                <p style={styles.confirmLabel}>HOTEL</p>
                <p style={styles.confirmValue}>{selectedHotel?.name}</p>
                <p style={styles.confirmSub}>{selectedHotel?.address}</p>
              </div>
              <div style={styles.confirmDivider} />
              <div style={styles.confirmSection}>
                <p style={styles.confirmLabel}>ROOM</p>
                <p style={styles.confirmValue}>Room {selectedRoom?.room_number} — {selectedRoom?.room_type}</p>
                <p style={styles.confirmSub}>{selectedRoom?.description}</p>
              </div>
              <div style={styles.confirmDivider} />
              <div style={styles.confirmSection}>
                <p style={styles.confirmLabel}>GUEST</p>
                <p style={styles.confirmValue}>{form.name}</p>
                <p style={styles.confirmSub}>{form.email} · {form.phone}</p>
              </div>
              <div style={styles.confirmDivider} />
              <div style={styles.confirmSection}>
                <p style={styles.confirmLabel}>DATES</p>
                <p style={styles.confirmValue}>{form.check_in} → {form.check_out}</p>
                <p style={styles.confirmSub}>{nights} night{nights > 1 ? "s" : ""}</p>
              </div>
              <div style={styles.confirmDivider} />
              <div style={{ ...styles.confirmSection, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={styles.confirmLabel}>TOTAL PRICE</p>
                <p style={{ fontSize: "28px", color: "#c9a96e", fontWeight: 300, margin: 0 }}>₱{totalPrice.toLocaleString()}</p>
              </div>
              {form.notes && (
                <>
                  <div style={styles.confirmDivider} />
                  <div style={styles.confirmSection}>
                    <p style={styles.confirmLabel}>NOTES</p>
                    <p style={styles.confirmSub}>{form.notes}</p>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={styles.outlineBtn} onClick={() => setStep(3)}>← Back</button>
              <button style={styles.primaryBtn} onClick={handleSubmit}>Confirm Booking ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520" },
  backBtn: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoAccent: { color: "#c9a96e" },
  stepper: { display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 60px", gap: "0" },
  stepItem: { display: "flex", alignItems: "center", gap: "10px" },
  stepCircle: { width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #2a2520", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32" },
  stepActive: { border: "1px solid #c9a96e", color: "#c9a96e", background: "rgba(201,169,110,0.1)" },
  stepDone: { background: "#c9a96e", color: "#0d0d0d", border: "1px solid #c9a96e" },
  stepLabel: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  stepLine: { width: "60px", height: "1px", background: "#2a2520", margin: "0 10px" },
  content: { maxWidth: "800px", margin: "0 auto", padding: "20px 60px 80px" },
  stepContent: { display: "flex", flexDirection: "column", gap: "32px" },
  stepTitle: { fontSize: "36px", fontWeight: 300, color: "#e8dcc8", margin: 0 },
  hotelGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  hotelCard: { padding: "32px", border: "1px solid #1e1a16", cursor: "pointer", transition: "border-color 0.2s", background: "#111" },
  hotelSelected: { border: "1px solid #c9a96e", background: "rgba(201,169,110,0.05)" },
  hotelIcon: { fontSize: "32px", marginBottom: "16px" },
  hotelName: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 12px" },
  hotelAddr: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: "0 0 6px" },
  hotelContact: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", margin: "0 0 4px" },
  roomGrid: { display: "flex", flexDirection: "column", gap: "12px" },
  roomCard: { padding: "24px", border: "1px solid #1e1a16", cursor: "pointer", background: "#111", transition: "border-color 0.2s" },
  roomSelected: { border: "1px solid #c9a96e", background: "rgba(201,169,110,0.05)" },
  roomNum: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 8px" },
  roomTypeBadge: { fontFamily: "'Jost', sans-serif", fontSize: "11px", padding: "4px 12px", letterSpacing: "2px", textTransform: "uppercase" },
  roomDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: "0 0 16px", lineHeight: 1.6 },
  roomMeta: { display: "flex", justifyContent: "space-between", fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68" },
  roomPrice: { color: "#c9a96e", fontWeight: 500 },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  label: { display: "block", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "8px" },
  input: { width: "100%", background: "#111", border: "1px solid #2a2520", color: "#e8dcc8", padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  priceSummary: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", border: "1px solid #2a2520", fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68" },
  confirmCard: { border: "1px solid #1e1a16", background: "#111", overflow: "hidden" },
  confirmSection: { padding: "24px 32px" },
  confirmDivider: { height: "1px", background: "#1e1a16" },
  confirmLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", margin: "0 0 8px", textTransform: "uppercase" },
  confirmValue: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 4px" },
  confirmSub: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: 0 },
  primaryBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  outlineBtn: { background: "transparent", border: "1px solid #2a2520", color: "#8a7a68", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
};