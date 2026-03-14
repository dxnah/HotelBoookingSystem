import { useState } from "react";

const mockBookings = [
  { id: 1, client: { name: "Maria Santos", email: "maria@email.com", phone: "09171234567" }, room: { room_number: "201", room_type: "double", hotel: { name: "Grand Velour Manila" } }, check_in: "2024-12-20", check_out: "2024-12-23", status: "confirmed", total_price: 8400, notes: "Early check-in requested" },
  { id: 2, client: { name: "Jose Reyes", email: "jose@email.com", phone: "09281234567" }, room: { room_number: "301", room_type: "suite", hotel: { name: "Grand Velour Manila" } }, check_in: "2024-12-25", check_out: "2024-12-28", status: "confirmed", total_price: 19500, notes: "" },
  { id: 3, client: { name: "Ana Cruz", email: "ana@email.com", phone: "09391234567" }, room: { room_number: "101", room_type: "single", hotel: { name: "Grand Velour Cebu" } }, check_in: "2024-12-15", check_out: "2024-12-17", status: "cancelled", total_price: 3200, notes: "Cancelled due to emergency" },
  { id: 4, client: { name: "Maria Santos", email: "maria@email.com", phone: "09171234567" }, room: { room_number: "401", room_type: "deluxe", hotel: { name: "Grand Velour Manila" } }, check_in: "2025-01-05", check_out: "2025-01-08", status: "rescheduled", total_price: 13500, notes: "Moved from Dec 28" },
];

const statusStyle = {
  confirmed: { color: "#7eb87e", bg: "rgba(126,184,126,0.1)", border: "rgba(126,184,126,0.3)" },
  cancelled: { color: "#c97b6e", bg: "rgba(201,123,110,0.1)", border: "rgba(201,123,110,0.3)" },
  rescheduled: { color: "#c9a96e", bg: "rgba(201,169,110,0.1)", border: "rgba(201,169,110,0.3)" },
};

const roomTypeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

export default function ViewBookings({ navigate }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = mockBookings.filter(b => {
    const matchSearch = b.client.name.toLowerCase().includes(search.toLowerCase()) ||
      b.client.email.toLowerCase().includes(search.toLowerCase()) ||
      b.room.room_number.includes(search);
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const nights = (b) => Math.max(0, (new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <button style={styles.bookBtn} onClick={() => navigate("book")}>+ New Booking</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.header}>
          <div>
            <p style={styles.headerSub}>RESERVATION RECORDS</p>
            <h1 style={styles.headerTitle}>My Bookings</h1>
          </div>
          <div style={styles.stats}>
            {["confirmed", "rescheduled", "cancelled"].map(s => (
              <div key={s} style={styles.statBox}>
                <span style={{ ...styles.statNum, color: statusStyle[s].color }}>{mockBookings.filter(b => b.status === s).length}</span>
                <span style={styles.statLabel}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by name, email, or room..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.filterBtns}>
            {["all", "confirmed", "rescheduled", "cancelled"].map(s => (
              <button
                key={s}
                style={{ ...styles.filterBtn, ...(filterStatus === s ? styles.filterActive : {}) }}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                {["#", "Guest", "Hotel", "Room", "Check-in", "Check-out", "Nights", "Total", "Status"].map(h => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={9} style={{ ...styles.td, textAlign: "center", color: "#4a3f32", padding: "48px" }}>No bookings found.</td></tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={styles.tr} onClick={() => setSelected(b)}>
                  <td style={styles.td}>#{b.id}</td>
                  <td style={styles.td}>
                    <div style={styles.guestName}>{b.client.name}</div>
                    <div style={styles.guestEmail}>{b.client.email}</div>
                  </td>
                  <td style={styles.td}><span style={styles.hotelName}>{b.room.hotel.name}</span></td>
                  <td style={styles.td}>
                    <span style={{ ...styles.roomBadge, color: roomTypeColor[b.room.room_type], background: roomTypeColor[b.room.room_type] + "15" }}>
                      {b.room.room_number} · {b.room.room_type}
                    </span>
                  </td>
                  <td style={styles.td}>{b.check_in}</td>
                  <td style={styles.td}>{b.check_out}</td>
                  <td style={styles.td}>{nights(b)}n</td>
                  <td style={{ ...styles.td, color: "#c9a96e" }}>₱{b.total_price.toLocaleString()}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.statusBadge, color: statusStyle[b.status].color, background: statusStyle[b.status].bg, border: `1px solid ${statusStyle[b.status].border}` }}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selected && (
        <div style={styles.modalOverlay} onClick={() => setSelected(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Booking #{selected.id}</h3>
              <button style={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              {[
                { label: "GUEST", value: selected.client.name, sub: `${selected.client.email} · ${selected.client.phone}` },
                { label: "HOTEL", value: selected.room.hotel.name },
                { label: "ROOM", value: `Room ${selected.room.room_number}`, sub: selected.room.room_type },
                { label: "CHECK-IN", value: selected.check_in },
                { label: "CHECK-OUT", value: selected.check_out },
                { label: "DURATION", value: `${nights(selected)} night${nights(selected) > 1 ? "s" : ""}` },
                { label: "TOTAL PRICE", value: `₱${selected.total_price.toLocaleString()}`, highlight: true },
                ...(selected.notes ? [{ label: "NOTES", value: selected.notes }] : []),
              ].map((row, i) => (
                <div key={i} style={styles.modalRow}>
                  <span style={styles.modalLabel}>{row.label}</span>
                  <div>
                    <span style={{ ...styles.modalValue, ...(row.highlight ? { color: "#c9a96e", fontSize: "22px" } : {}) }}>{row.value}</span>
                    {row.sub && <div style={styles.modalSub}>{row.sub}</div>}
                  </div>
                </div>
              ))}
              <div style={styles.modalRow}>
                <span style={styles.modalLabel}>STATUS</span>
                <span style={{ ...styles.statusBadge, color: statusStyle[selected.status].color, background: statusStyle[selected.status].bg, border: `1px solid ${statusStyle[selected.status].border}` }}>
                  {selected.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520" },
  backBtn: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px" },
  logoAccent: { color: "#c9a96e" },
  bookBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  content: { padding: "60px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "48px" },
  headerSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", margin: "0 0 8px" },
  headerTitle: { fontSize: "48px", fontWeight: 300, margin: 0 },
  stats: { display: "flex", gap: "32px" },
  statBox: { textAlign: "center" },
  statNum: { display: "block", fontSize: "36px", fontWeight: 300 },
  statLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  filters: { display: "flex", gap: "16px", marginBottom: "32px", alignItems: "center" },
  searchInput: { flex: 1, background: "#111", border: "1px solid #2a2520", color: "#e8dcc8", padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "13px", outline: "none" },
  filterBtns: { display: "flex", gap: "8px" },
  filterBtn: { background: "none", border: "1px solid #1e1a16", color: "#4a3f32", padding: "10px 16px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" },
  filterActive: { border: "1px solid #c9a96e", color: "#c9a96e", background: "rgba(201,169,110,0.08)" },
  tableWrap: { border: "1px solid #1e1a16", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#111" },
  th: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase", padding: "16px 20px", textAlign: "left", borderBottom: "1px solid #1e1a16" },
  tr: { borderBottom: "1px solid #1a1612", cursor: "pointer", transition: "background 0.2s" },
  td: { padding: "16px 20px", fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68", verticalAlign: "middle" },
  guestName: { color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px" },
  guestEmail: { fontSize: "12px", color: "#4a3f32", marginTop: "2px" },
  hotelName: { fontSize: "13px" },
  roomBadge: { padding: "4px 10px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase" },
  statusBadge: { padding: "4px 12px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", display: "inline-block" },
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#111", border: "1px solid #2a2520", width: "480px", maxHeight: "80vh", overflow: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid #1e1a16" },
  modalTitle: { fontSize: "24px", fontWeight: 400, margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontSize: "16px" },
  modalBody: { padding: "8px 0" },
  modalRow: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 32px", borderBottom: "1px solid #1a1612" },
  modalLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", paddingTop: "4px" },
  modalValue: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8", display: "block" },
  modalSub: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", marginTop: "2px" },
};