import { useState, useRef, useEffect } from "react";

// Load jsPDF dynamically
function loadjsPDF() {
  return new Promise((resolve) => {
    if (window.jspdf) { resolve(window.jspdf.jsPDF); return; }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve(window.jspdf.jsPDF);
    document.head.appendChild(script);
  });
}

const mockHotels = [
  { id: 1, name: "Grand Velour Manila", address: "Ayala Ave, Makati", phone: "02-8123-4567", email: "manila@grandvelour.com" },
  { id: 2, name: "Grand Velour Cebu", address: "Colon St, Cebu City", phone: "032-234-5678", email: "cebu@grandvelour.com" },
  { id: 3, name: "Grand Velour BGC", address: "9th Ave, Bonifacio Global City, Taguig", phone: "02-8765-4321", email: "bgc@grandvelour.com" },
  { id: 4, name: "Grand Velour Iloilo", address: "Iznart St, Iloilo City", phone: "033-321-9876", email: "iloilo@grandvelour.com" },
  { id: 5, name: "Grand Velour Cagayan de Oro", address: "Corrales Ave, Cagayan de Oro City", phone: "088-857-4321", email: "cdo@grandvelour.com" },
  { id: 6, name: "Grand Velour Davao", address: "JP Laurel Ave, Davao City", phone: "082-224-5678", email: "davao@grandvelour.com" },
];

// 6 room types with cover photo + gallery images
const ROOM_TYPE_INFO = {
  classic: {
    label: "Classic Room",
    price: 2200,
    capacity: 1,
    size: "28 sqm",
    description: "A cozy retreat with a queen bed, city view, and complimentary breakfast — perfect for solo travelers.",
    cover: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80",
    ],
    color: "#6a9fb5",
  },
  superior_twin: {
    label: "Superior Twin",
    price: 3200,
    capacity: 2,
    size: "35 sqm",
    description: "Two twin beds with a garden view — great for friends or colleagues traveling together.",
    cover: "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
    ],
    color: "#7eb87e",
  },
  deluxe: {
    label: "Deluxe Suite",
    price: 4500,
    capacity: 2,
    size: "45 sqm",
    description: "King bed, sea view, and a private balcony — an elevated stay with premium amenities throughout.",
    cover: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
    ],
    color: "#c97b6e",
  },
  family: {
    label: "Family Room",
    price: 5500,
    capacity: 4,
    size: "55 sqm",
    description: "Two queen beds with pool view and kids amenities — designed for families who want space and comfort.",
    cover: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
      "https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
    ],
    color: "#9b7ec8",
  },
  junior_suite: {
    label: "Junior Suite",
    price: 6800,
    capacity: 2,
    size: "65 sqm",
    description: "King bed, separate living area, and exclusive rooftop access — perfect for romantic getaways.",
    cover: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
    ],
    color: "#c9a96e",
  },
  presidential: {
    label: "Presidential Suite",
    price: 12000,
    capacity: 4,
    size: "120 sqm",
    description: "Two bedrooms, grand living area, panoramic views, and 24/7 butler service — the pinnacle of luxury.",
    cover: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80",
      "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=600&q=80",
    ],
    color: "#e8c87a",
  },
};

const UNAVAIL_REASONS = ["Occupied", "On Maintenance", "Reserved", "Occupied", "On Maintenance"];

// Different pattern per hotel+type so every card shows a unique available count
const UNAVAIL_PATTERNS = [
  [2],        // 4 available
  [0, 3],     // 3 available
  [1],        // 4 available
  [2, 4],     // 3 available
  [],         // 5 available — fully open
  [0],        // 4 available
  [1, 3],     // 3 available
  [4],        // 4 available
  [0, 2, 4],  // 2 available
  [3],        // 4 available
  [1, 4],     // 3 available
  [0, 2],     // 3 available
];

function generateRooms() {
  const rooms = [];
  let id = 1;
  const types = Object.keys(ROOM_TYPE_INFO);
  mockHotels.forEach(hotel => {
    types.forEach((type, typeIdx) => {
      const info = ROOM_TYPE_INFO[type];
      const pattern = UNAVAIL_PATTERNS[(hotel.id * 3 + typeIdx) % UNAVAIL_PATTERNS.length];
      for (let i = 0; i < 5; i++) {
        const roomNum = `${typeIdx + 1}0${i + 1}`;
        const unavailable = pattern.includes(i);
        rooms.push({
          id: id++,
          hotel: hotel.id,
          room_number: roomNum,
          room_type: type,
          price_per_night: info.price,
          is_available: !unavailable,
          unavail_reason: unavailable ? UNAVAIL_REASONS[i] : null,
          capacity: info.capacity,
          description: info.description,
          size: info.size,
          gallery: info.gallery,
        });
      }
    });
  });
  return rooms;
}

const mockRooms = generateRooms();

// ── Photo Carousel ────────────────────────────────────────────────────
function PhotoCarousel({ images, height = 160 }) {
  const [idx, setIdx] = useState(0);
  const prev = (e) => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); };
  return (
    <div style={{ position: "relative", height, overflow: "hidden", background: "#0a0a0a", flexShrink: 0 }}>
      <img
        src={images[idx]}
        alt=""
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />
      {images.length > 1 && (
        <>
          <button onClick={prev} style={carouselBtn("left")}>‹</button>
          <button onClick={next} style={carouselBtn("right")}>›</button>
          <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "5px" }}>
            {images.map((_, i) => (
              <button key={i} onClick={e => { e.stopPropagation(); setIdx(i); }}
                style={{ width: i === idx ? "18px" : "6px", height: "6px", borderRadius: "3px", border: "none", cursor: "pointer", background: i === idx ? "#c9a96e" : "rgba(255,255,255,0.45)", padding: 0, transition: "all 0.2s" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const carouselBtn = (side) => ({
  position: "absolute", [side]: "8px", top: "50%", transform: "translateY(-50%)",
  background: "rgba(0,0,0,0.55)", border: "none", color: "#e8dcc8",
  width: "28px", height: "28px", cursor: "pointer", fontSize: "16px",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2,
});

// ── QR Code ───────────────────────────────────────────────────────────
function QRCode({ value, size = 140 }) {
  return (
    <img
      src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}&bgcolor=111111&color=c9a96e&margin=10`}
      alt="Booking QR" width={size} height={size} style={{ display: "block" }}
    />
  );
}

// ── Main Component ────────────────────────────────────────────────────
export default function BookAppointment({ navigate, goBack, previousPage }) {
  const [step, setStep] = useState(1);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", guests: "", check_in: "", check_out: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);
  const [bookingRefState] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());

  const typeInfo = selectedRoomType ? ROOM_TYPE_INFO[selectedRoomType] : null;
  const roomsOfType = selectedRoomType
    ? mockRooms.filter(r => r.hotel === selectedHotel?.id && r.room_type === selectedRoomType)
    : [];

  const nights = form.check_in && form.check_out
    ? Math.max(0, (new Date(form.check_out) - new Date(form.check_in)) / (1000 * 60 * 60 * 24))
    : 0;
  const totalPrice = selectedRoom ? selectedRoom.price_per_night * nights : 0;
  const bookingRef = `GV-${bookingRefState}`;

  const qrData = `Grand Velour Booking | Ref: ${bookingRef} | Guest: ${form.name} | Hotel: ${selectedHotel?.name} | Room No: ${selectedRoom?.room_number} | Type: ${typeInfo?.label} | Guests: ${form.guests} | Check-in: ${form.check_in} | Check-out: ${form.check_out} | Total: PHP ${totalPrice.toLocaleString()}`;

  const handleDownloadReceipt = async () => {
    const jsPDF = await loadjsPDF();
    const issueDate = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "legal" });
    const W = doc.internal.pageSize.getWidth();   // 215.9mm
    const H = doc.internal.pageSize.getHeight();  // 355.6mm
    let y = 0;

    // ── Gold top bar ──────────────────────────────────
    doc.setFillColor(201, 169, 110);
    doc.rect(0, 0, W, 4, "F");
    y = 10;

    // ── Header ───────────────────────────────────────
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.setTextColor(26, 21, 16);
    // "GRAND" normal color, "VELOUR" gold — approximate with two drawText calls
    const grandW = doc.getTextWidth("GRAND");
    const velourW = doc.getTextWidth("VELOUR");
    const totalW = grandW + velourW;
    const hx = (W - totalW) / 2;
    doc.setTextColor(26, 21, 16);
    doc.text("GRAND", hx, y + 8);
    doc.setTextColor(201, 169, 110);
    doc.text("VELOUR", hx + grandW, y + 8);
    y += 12;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(154, 138, 120);
    doc.text("HOTELS & RESORTS  ·  PHILIPPINES", W / 2, y, { align: "center" });
    y += 5;

    doc.setDrawColor(224, 216, 204);
    doc.line(14, y, W - 14, y);
    y += 5;

    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(201, 169, 110);
    doc.text("Official Booking Receipt", W / 2, y, { align: "center" });
    y += 8;

    // ── Ref strip ─────────────────────────────────────
    doc.setFillColor(250, 247, 242);
    doc.rect(0, y, W, 16, "F");
    doc.setDrawColor(224, 216, 204);
    doc.line(0, y, W, y);
    doc.line(0, y + 16, W, y + 16);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(154, 138, 120);
    doc.text("BOOKING REFERENCE", 16, y + 5);
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.setTextColor(201, 169, 110);
    doc.text(bookingRef, 16, y + 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.setTextColor(154, 138, 120);
    doc.text("DATE ISSUED", W - 16, y + 5, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(106, 95, 82);
    doc.text(issueDate, W - 16, y + 13, { align: "right" });
    y += 22;

    // ── Helper: draw a section ─────────────────────────
    const drawSection = (title, rows) => {
      // Section label
      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(201, 169, 110);
      doc.text(title, 16, y);
      doc.setDrawColor(240, 235, 227);
      doc.line(16, y + 2, W - 16, y + 2);
      y += 8;

      rows.forEach(([key, val]) => {
        if (!val && val !== 0) return;
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(154, 138, 120);
        doc.text(String(key), 16, y);
        doc.setFont("times", "normal");
        doc.setFontSize(10);
        doc.setTextColor(42, 32, 24);
        doc.text(String(val), W - 16, y, { align: "right" });
        y += 7;
      });

      doc.setDrawColor(224, 216, 204);
      doc.line(0, y + 2, W, y + 2);
      y += 8;
    };

    drawSection("GUEST INFORMATION", [
      ["Name", form.name],
      ...(form.email ? [["Email", form.email]] : []),
      ["Phone", form.phone],
      ["Number of Guests", `${form.guests} person${Number(form.guests) > 1 ? "s" : ""}`],
    ]);

    drawSection("RESERVATION DETAILS", [
      ["Hotel", selectedHotel?.name],
      ["Address", selectedHotel?.address],
      ["Room Number", `Room ${selectedRoom?.room_number}`],
      ["Room Type", typeInfo?.label],
      ["Room Size", selectedRoom?.size],
    ]);

    drawSection("STAY DETAILS", [
      ["Check-in", form.check_in],
      ["Check-out", form.check_out],
      ["Duration", `${nights} night${nights > 1 ? "s" : ""}`],
      ...(form.notes ? [["Special Requests", form.notes]] : []),
    ]);

    // Billing summary
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(201, 169, 110);
    doc.text("BILLING SUMMARY", 16, y);
    doc.setDrawColor(240, 235, 227);
    doc.line(16, y + 2, W - 16, y + 2);
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(154, 138, 120);
    doc.text("Rate per Night", 16, y);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(42, 32, 24);
    doc.text(`PHP ${selectedRoom?.price_per_night.toLocaleString()}`, W - 16, y, { align: "right" });
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(154, 138, 120);
    doc.text("Number of Nights", 16, y);
    doc.setFont("times", "normal");
    doc.setFontSize(10);
    doc.setTextColor(42, 32, 24);
    doc.text(String(nights), W - 16, y, { align: "right" });
    y += 5;

    // Dashed line
    doc.setDrawColor(200, 190, 178);
    doc.setLineDashPattern([1, 2], 0);
    doc.line(16, y, W - 16, y);
    doc.setLineDashPattern([], 0);
    y += 8;

    // ── Total box ─────────────────────────────────────
    doc.setFillColor(250, 247, 242);
    doc.rect(0, y, W, 20, "F");
    doc.setDrawColor(201, 169, 110);
    doc.setLineWidth(0.8);
    doc.line(0, y, W, y);
    doc.setLineWidth(0.2);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(106, 95, 82);
    doc.text("TOTAL AMOUNT DUE", 16, y + 7);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(176, 160, 144);
    doc.text(`PHP ${selectedRoom?.price_per_night.toLocaleString()} x ${nights} night${nights > 1 ? "s" : ""}`, 16, y + 13);

    doc.setFont("times", "normal");
    doc.setFontSize(26);
    doc.setTextColor(201, 169, 110);
    doc.text(`PHP ${totalPrice.toLocaleString()}`, W - 16, y + 14, { align: "right" });
    y += 26;

    // ── Perforation dots ──────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(200, 190, 178);
    doc.text("· · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · · ·", W / 2, y, { align: "center" });
    y += 8;

    doc.setDrawColor(224, 216, 204);
    doc.line(0, y, W, y);
    y += 8;

    // ── Footer ────────────────────────────────────────
    doc.setFont("times", "italic");
    doc.setFontSize(12);
    doc.setTextColor(106, 95, 82);
    doc.text("Thank you for choosing Grand Velour.", W / 2, y, { align: "center" });
    y += 8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(176, 160, 144);
    doc.text(`${selectedHotel?.email}  ·  ${selectedHotel?.phone}`, W / 2, y, { align: "center" });
    y += 5;
    doc.text(selectedHotel?.address, W / 2, y, { align: "center" });
    y += 10;

    // "Present receipt" stamp box
    const stampText = "PRESENT THIS RECEIPT UPON CHECK-IN";
    const stampW = doc.getTextWidth(stampText) + 16;
    doc.setDrawColor(201, 169, 110);
    doc.rect((W - stampW) / 2, y - 4, stampW, 10, "S");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(201, 169, 110);
    doc.text(stampText, W / 2, y + 2.5, { align: "center" });
    y += 14;

    // ── Gold bottom bar ───────────────────────────────
    doc.setFillColor(201, 169, 110);
    doc.rect(0, H - 4, W, 4, "F");

    doc.save(`GrandVelour_Receipt_${bookingRef}.pdf`);
  };

  // ── Success Screen ────────────────────────────────────────────────
  if (submitted) {
    return (
      <div style={S.page}>
        <nav style={S.nav}>
          <button style={S.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
          <div style={S.logo}>GRAND<span style={S.logoAccent}>VELOUR</span></div>
        </nav>
        <div style={S.successWrap}>
          <div style={S.successCard}>
            <div style={S.successHeader}>
              <div style={S.successIconWrap}><span style={S.successIcon}>✓</span></div>
              <h2 style={S.successTitle}>Booking Confirmed!</h2>
              <p style={S.successRef}>Reference: <span style={{ color: "#c9a96e" }}>{bookingRef}</span></p>
              <p style={S.successDesc}>
                Thank you, <strong>{form.name}</strong>! Your reservation at <strong>{selectedHotel?.name}</strong> is confirmed.
              </p>
            </div>
            <div style={S.successBody}>
              <div style={S.qrSection}>
                <p style={S.qrLabel}>SCAN TO VERIFY</p>
                <div style={S.qrWrap}><QRCode value={qrData} size={140} /></div>
                <p style={S.qrSub}>Present at check-in</p>
              </div>
              <div style={S.detailsSection}>
                {[
                  ["HOTEL", selectedHotel?.name],
                  ["ROOM NO.", `Room ${selectedRoom?.room_number}`],
                  ["ROOM TYPE", typeInfo?.label],
                  ["GUESTS", `${form.guests} person${Number(form.guests) > 1 ? "s" : ""}`],
                  ["CHECK-IN", form.check_in],
                  ["CHECK-OUT", form.check_out],
                  ["NIGHTS", `${nights}`],
                  ["TOTAL", `₱${totalPrice.toLocaleString()}`, true],
                ].map(([label, value, gold], i, arr) => (
                  <div key={i}>
                    <div style={S.detailRow}>
                      <span style={S.detailLabel}>{label}</span>
                      <span style={{ ...S.detailValue, ...(gold ? { color: "#c9a96e", fontSize: "18px" } : {}) }}>{value}</span>
                    </div>
                    {i < arr.length - 1 && <div style={S.detailDivider} />}
                  </div>
                ))}
              </div>
            </div>
            <div style={S.successActions}>
              <button style={S.primaryBtn} onClick={handleDownloadReceipt}>🧾 View & Download Receipt</button>
              <button style={S.outlineBtn} onClick={() => navigate("bookings")}>View My Bookings</button>
              <button style={S.ghostBtn} onClick={() => navigate("landing")}>Back to Home</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <button style={S.backBtn} onClick={goBack}>
          ← {previousPage === "landing" || !previousPage ? "Back to Home" : previousPage === "bookings" ? "Back to My Bookings" : previousPage === "rooms" ? "Back to Accommodations" : "Back to Previous Page"}
        </button>
        <div style={S.logo}>GRAND<span style={S.logoAccent}>VELOUR</span></div>
      </nav>

      {/* Stepper */}
      <div style={S.stepper}>
        {["Select Hotel", "Choose Room", "Your Details", "Confirm"].map((label, i) => (
          <div key={i} style={S.stepItem}>
            <div style={{ ...S.stepCircle, ...(step > i + 1 ? S.stepDone : step === i + 1 ? S.stepActive : {}) }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...S.stepLabel, ...(step === i + 1 ? { color: "#c9a96e" } : {}) }}>{label}</span>
            {i < 3 && <div style={S.stepLine} />}
          </div>
        ))}
      </div>

      <div style={S.content}>

        {/* ── STEP 1: Select Hotel ── */}
        {step === 1 && (
          <div style={S.stepContent}>
            <h2 style={S.stepTitle}>Select a Hotel</h2>
            <div style={S.hotelGrid}>
              {mockHotels.map(hotel => (
                <div key={hotel.id}
                  style={{ ...S.hotelCard, ...(selectedHotel?.id === hotel.id ? S.hotelSelected : {}) }}
                  onClick={() => setSelectedHotel(hotel)}>
                  <div style={S.hotelIcon}>🏨</div>
                  <h3 style={S.hotelName}>{hotel.name}</h3>
                  <p style={S.hotelAddr}>📍 {hotel.address}</p>
                  <p style={S.hotelContact}>📞 {hotel.phone}</p>
                  <p style={S.hotelContact}>✉️ {hotel.email}</p>
                </div>
              ))}
            </div>
            <button style={{ ...S.primaryBtn, opacity: selectedHotel ? 1 : 0.4 }} disabled={!selectedHotel} onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        )}

        {/* ── STEP 2a: Room Type Selection ── */}
        {step === 2 && !selectedRoomType && (
          <div style={S.stepContent}>
            <div>
              <h2 style={S.stepTitle}>Choose a Room Type</h2>
              <p style={S.stepSubtitle}>at {selectedHotel?.name}</p>
            </div>
            <div style={S.typeGrid}>
              {Object.entries(ROOM_TYPE_INFO).map(([key, info]) => {
                const availCount = mockRooms.filter(r => r.hotel === selectedHotel.id && r.room_type === key && r.is_available).length;
                return (
                  <div key={key} style={S.typeCard} onClick={() => setSelectedRoomType(key)}>
                    <div style={S.typeCoverWrap}>
                      <img src={info.cover} alt={info.label} style={S.typeCover} />
                      <div style={S.typeCoverOverlay} />
                      <span style={{ ...S.typeBadge, background: "rgba(13,13,13,0.88)", color: info.color, borderLeft: `3px solid ${info.color}` }}>
                        {info.label}
                      </span>
                      <div style={S.typeAvailBubble}>
                        <span style={{ color: availCount > 0 ? "#7eb87e" : "#c97b6e" }}>●</span>{" "}
                        {availCount} of 5 available
                      </div>
                    </div>
                    <div style={S.typeBody}>
                      <div style={S.typeMetaRow}>
                        <span style={S.typeMeta}>👥 Up to {info.capacity} guests</span>
                        <span style={S.typeMeta}>📐 {info.size}</span>
                      </div>
                      <p style={S.typeDesc}>{info.description}</p>
                      <div style={S.typeFooter}>
                        <span style={S.typePrice}>₱{info.price.toLocaleString()}<span style={S.perNight}>/night</span></span>
                        <span style={S.typeViewBtn}>View rooms →</span>
                      </div>
                      <div style={S.typeCta}>
                        ✨ Is this the vibe you're looking for? Click to explore available rooms inside.
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <button style={S.outlineBtn} onClick={() => setStep(1)}>← Back</button>
          </div>
        )}

        {/* ── STEP 2b: Individual Rooms ── */}
        {step === 2 && selectedRoomType && (
          <div style={S.stepContent}>
            <div>
              <button style={{ background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", color: "#a09080", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "8px 16px", marginBottom: "12px", display: "inline-flex", alignItems: "center", gap: "6px" }}
                onClick={() => { setSelectedRoomType(null); setSelectedRoom(null); }}>
                ← Back to Room Types
              </button>
              <h2 style={S.stepTitle}>{typeInfo?.label}</h2>
              <p style={S.stepSubtitle}>
                {selectedHotel?.name} · {roomsOfType.filter(r => r.is_available).length} of {roomsOfType.length} rooms available
              </p>
            </div>

            <div style={S.roomsGrid}>
              {roomsOfType.map(room => {
                const isAvail = room.is_available;
                const isSelected = selectedRoom?.id === room.id;
                return (
                  <div key={room.id}
                    style={{
                      ...S.roomCard,
                      ...(isSelected ? S.roomSelected : {}),
                      ...(isAvail ? {} : S.roomUnavailable),
                      cursor: isAvail ? "pointer" : "not-allowed",
                    }}
                    onClick={() => isAvail && setSelectedRoom(room)}>
                    {/* Carousel */}
                    <div style={{ position: "relative" }}>
                      <PhotoCarousel images={typeInfo.gallery} height={160} />
                      {!isAvail && (
                        <div style={S.unavailOverlay}>
                          <span style={{ fontSize: "22px" }}>🚫</span>
                          <span style={S.unavailText}>Room Unavailable</span>
                          <span style={S.unavailReason}>{room.unavail_reason}</span>
                        </div>
                      )}
                      {isAvail && (
                        <div style={S.vacantBadge}>● Vacant</div>
                      )}
                    </div>
                    {/* Info */}
                    <div style={S.roomCardBody}>
                      <div style={S.roomCardTop}>
                        <span style={S.roomNumber}>Room {room.room_number}</span>
                        <span style={{ fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: isAvail ? "#7eb87e" : "#c97b6e" }}>
                          {isAvail ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <div style={S.roomCardMeta}>
                        <span>👥 Max {room.capacity}</span>
                        <span>📐 {room.size}</span>
                        <span style={{ color: "#c9a96e" }}>₱{room.price_per_night.toLocaleString()}/night</span>
                      </div>
                      {isAvail && (
                        <div style={{ ...S.selectRoomBtn, ...(isSelected ? S.selectRoomBtnActive : {}) }}>
                          {isSelected ? "✓ Selected" : "Select this room"}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <button style={S.outlineBtn} onClick={() => { setSelectedRoomType(null); setSelectedRoom(null); }}>← Back</button>
              <button style={{ ...S.primaryBtn, opacity: selectedRoom ? 1 : 0.4 }} disabled={!selectedRoom} onClick={() => setStep(3)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Your Details ── */}
        {step === 3 && (
          <div style={S.stepContent}>
            <h2 style={S.stepTitle}>Your Details</h2>
            <div style={S.formGrid}>
              <div>
                <label style={S.label}>Full Name</label>
                <input type="text" placeholder="Juan dela Cruz" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Email Address <span style={S.optionalBadge}>Optional</span></label>
                <input type="email" placeholder="juan@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Phone Number</label>
                <input type="tel" placeholder="09XX-XXX-XXXX" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} style={S.input} />
              </div>
              <div>
                <label style={S.label}>Number of Guests</label>
                <input type="number" placeholder={`1–${selectedRoom?.capacity}`} min="1" max={selectedRoom?.capacity}
                  value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} style={S.input} />
                <p style={S.inputHint}>For safety compliance · Room capacity: {selectedRoom?.capacity} person{selectedRoom?.capacity > 1 ? "s" : ""}</p>
              </div>
              <div>
                <label style={S.label}>Check-in Date</label>
                <input type="date" value={form.check_in}
                  onChange={e => setForm({ ...form, check_in: e.target.value })}
                  style={S.input} min={new Date().toISOString().split("T")[0]} />
              </div>
              <div>
                <label style={S.label}>Check-out Date</label>
                <input type="date" value={form.check_out}
                  onChange={e => setForm({ ...form, check_out: e.target.value })}
                  style={S.input} min={form.check_in || new Date().toISOString().split("T")[0]} />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={S.label}>Notes <span style={S.optionalBadge}>Optional</span></label>
                <textarea placeholder="Any special requests..." value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  style={{ ...S.input, height: "80px", resize: "vertical" }} />
              </div>
            </div>
            {nights > 0 && (
              <div style={S.priceSummary}>
                <span>₱{selectedRoom?.price_per_night.toLocaleString()} × {nights} night{nights > 1 ? "s" : ""}</span>
                <span style={{ color: "#c9a96e", fontSize: "20px" }}>₱{totalPrice.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={S.outlineBtn} onClick={() => setStep(2)}>← Back</button>
              <button
                style={{ ...S.primaryBtn, opacity: (form.name && form.phone && form.guests && form.check_in && form.check_out && nights > 0) ? 1 : 0.4 }}
                disabled={!(form.name && form.phone && form.guests && form.check_in && form.check_out && nights > 0)}
                onClick={() => setStep(4)}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4: Confirm ── */}
        {step === 4 && (
          <div style={S.stepContent}>
            <h2 style={S.stepTitle}>Confirm Booking</h2>
            <div style={S.confirmCard}>
              {[
                { label: "HOTEL", value: selectedHotel?.name, sub: selectedHotel?.address },
                { label: "ROOM TYPE", value: typeInfo?.label, sub: `${selectedRoom?.size} · Up to ${selectedRoom?.capacity} guests` },
                { label: "ROOM NUMBER", value: `Room ${selectedRoom?.room_number}` },
                { label: "GUEST", value: form.name, sub: `${form.email ? form.email + " · " : ""}${form.phone}` },
                { label: "NUMBER OF GUESTS", value: `${form.guests} person${Number(form.guests) > 1 ? "s" : ""}` },
                { label: "DATES", value: `${form.check_in} → ${form.check_out}`, sub: `${nights} night${nights > 1 ? "s" : ""}` },
                { label: "TOTAL PRICE", value: `₱${totalPrice.toLocaleString()}`, gold: true },
                ...(form.notes ? [{ label: "NOTES", sub: form.notes }] : []),
              ].map((row, i, arr) => (
                <div key={i}>
                  <div style={S.confirmSection}>
                    <p style={S.confirmLabel}>{row.label}</p>
                    {row.value && <p style={{ ...S.confirmValue, ...(row.gold ? { color: "#c9a96e", fontSize: "28px", fontWeight: 300 } : {}) }}>{row.value}</p>}
                    {row.sub && <p style={S.confirmSub}>{row.sub}</p>}
                  </div>
                  {i < arr.length - 1 && <div style={S.confirmDivider} />}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "12px" }}>
              <button style={S.outlineBtn} onClick={() => setStep(3)}>← Back</button>
              <button style={S.primaryBtn} onClick={() => setSubmitted(true)}>Confirm Booking ✓</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520" },
  backBtn: { background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "8px 16px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoAccent: { color: "#c9a96e" },
  stepper: { display: "flex", justifyContent: "center", alignItems: "center", padding: "40px 60px 0" },
  stepItem: { display: "flex", alignItems: "center", gap: "10px" },
  stepCircle: { width: "32px", height: "32px", borderRadius: "50%", border: "1px solid #2a2520", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32" },
  stepActive: { border: "1px solid #c9a96e", color: "#c9a96e", background: "rgba(201,169,110,0.1)" },
  stepDone: { background: "#c9a96e", color: "#0d0d0d", border: "1px solid #c9a96e" },
  stepLabel: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  stepLine: { width: "60px", height: "1px", background: "#2a2520", margin: "0 10px" },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "40px 60px 80px" },
  stepContent: { display: "flex", flexDirection: "column", gap: "32px" },
  stepTitle: { fontSize: "36px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 4px" },
  stepSubtitle: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: 0 },
  hotelGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  hotelCard: { padding: "28px", border: "1px solid #1e1a16", cursor: "pointer", background: "#111" },
  hotelSelected: { border: "1px solid #c9a96e", background: "rgba(201,169,110,0.05)" },
  hotelIcon: { fontSize: "28px", marginBottom: "12px" },
  hotelName: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 10px" },
  hotelAddr: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", margin: "0 0 5px" },
  hotelContact: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", margin: "0 0 3px" },
  typeGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  typeCard: { border: "1px solid #1e1a16", background: "#111", cursor: "pointer", overflow: "hidden" },
  typeCoverWrap: { position: "relative", height: "180px", overflow: "hidden" },
  typeCover: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  typeCoverOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.28)" },
  typeBadge: { position: "absolute", top: "12px", left: "0px", fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", padding: "5px 12px", fontWeight: 500 },
  typeAvailBubble: { position: "absolute", bottom: "10px", right: "10px", background: "rgba(13,13,13,0.78)", fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#e8dcc8", padding: "4px 10px" },
  typeBody: { padding: "18px 22px" },
  typeMetaRow: { display: "flex", gap: "16px", marginBottom: "10px" },
  typeMeta: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32" },
  typeDesc: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", lineHeight: 1.65, margin: "0 0 12px" },
  typeFooter: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  typePrice: { fontSize: "20px", fontWeight: 300, color: "#c9a96e" },
  perNight: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#6a5f52" },
  typeViewBtn: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#c9a96e", letterSpacing: "1px" },
  typeCta: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", fontStyle: "italic", borderTop: "1px solid #1e1a16", paddingTop: "10px", lineHeight: 1.6 },
  roomsGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  roomCard: { border: "1px solid #1e1a16", background: "#111", overflow: "hidden" },
  roomSelected: { border: "1px solid #c9a96e", background: "rgba(201,169,110,0.04)" },
  roomUnavailable: { opacity: 0.52, filter: "grayscale(55%)" },
  unavailOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.78)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px" },
  unavailText: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#c97b6e", letterSpacing: "1px", textTransform: "uppercase" },
  unavailReason: { fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#8a6a62", letterSpacing: "1px" },
  vacantBadge: { position: "absolute", bottom: "8px", right: "8px", background: "rgba(13,13,13,0.8)", color: "#7eb87e", fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", padding: "3px 10px", textTransform: "uppercase" },
  roomCardBody: { padding: "14px 18px" },
  roomCardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  roomNumber: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8" },
  roomCardMeta: { display: "flex", gap: "10px", flexWrap: "wrap", fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#6a5f52", marginBottom: "12px" },
  selectRoomBtn: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "#6a5f52", border: "1px solid #2a2520", padding: "8px", textAlign: "center" },
  selectRoomBtnActive: { background: "rgba(201,169,110,0.12)", color: "#c9a96e", border: "1px solid #c9a96e" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  label: { display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "8px" },
  optionalBadge: { fontSize: "9px", letterSpacing: "1px", color: "#4a3f32", border: "1px solid #2a2520", padding: "2px 7px", textTransform: "uppercase", fontFamily: "'Jost', sans-serif" },
  input: { width: "100%", background: "#111", border: "1px solid #2a2520", color: "#e8dcc8", padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  inputHint: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", margin: "6px 0 0" },
  priceSummary: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px", border: "1px solid #2a2520", fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68" },
  confirmCard: { border: "1px solid #1e1a16", background: "#111", overflow: "hidden" },
  confirmSection: { padding: "20px 32px" },
  confirmDivider: { height: "1px", background: "#1e1a16" },
  confirmLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", margin: "0 0 6px", textTransform: "uppercase" },
  confirmValue: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 4px" },
  confirmSub: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: 0 },
  primaryBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  outlineBtn: { background: "transparent", border: "1px solid #2a2520", color: "#8a7a68", padding: "14px 32px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
  ghostBtn: { background: "transparent", border: "none", color: "#4a3f32", padding: "14px 20px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
  successWrap: { display: "flex", justifyContent: "center", padding: "60px 20px 80px" },
  successCard: { background: "#111", border: "1px solid #2a2520", width: "100%", maxWidth: "680px", overflow: "hidden" },
  successHeader: { padding: "48px 48px 32px", textAlign: "center", borderBottom: "1px solid #1e1a16" },
  successIconWrap: { width: "56px", height: "56px", borderRadius: "50%", border: "1px solid #c9a96e", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" },
  successIcon: { color: "#c9a96e", fontSize: "24px" },
  successTitle: { fontSize: "36px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 8px" },
  successRef: { fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", color: "#4a3f32", margin: "0 0 16px", textTransform: "uppercase" },
  successDesc: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68", lineHeight: 1.7, margin: 0 },
  successBody: { display: "flex", borderBottom: "1px solid #1e1a16" },
  qrSection: { width: "200px", flexShrink: 0, padding: "32px 24px", borderRight: "1px solid #1e1a16", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" },
  qrLabel: { fontFamily: "'Jost', sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", margin: 0, textAlign: "center" },
  qrWrap: { border: "1px solid #2a2520", padding: "8px" },
  qrSub: { fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#4a3f32", textAlign: "center", margin: 0 },
  detailsSection: { flex: 1, padding: "16px 0" },
  detailRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 28px" },
  detailLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  detailValue: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#e8dcc8" },
  detailDivider: { height: "1px", background: "#1a1612", margin: "0 28px" },
  successActions: { display: "flex", gap: "12px", padding: "28px 48px", justifyContent: "center", flexWrap: "wrap" },
};