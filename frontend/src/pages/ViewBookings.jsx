import { useState, useEffect } from "react";
import { API_BASE } from "../api";

const statusStyle = {
  confirmed: { color: "#7eb87e", bg: "rgba(126,184,126,0.1)", border: "rgba(126,184,126,0.3)" },
  cancelled: { color: "#c97b6e", bg: "rgba(201,123,110,0.1)", border: "rgba(201,123,110,0.3)" },
  rescheduled: { color: "#c9a96e", bg: "rgba(201,169,110,0.1)", border: "rgba(201,169,110,0.3)" },
};

const roomTypeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

const backLabel = (prev) => {
  if (!prev || prev === "landing") return "← Back to Home";
  if (prev === "book") return "← Back to Booking";
  if (prev === "rooms") return "← Back to Accommodations";
  return "← Back to Previous";
};

export default function ViewBookings({ navigate, goBack, previousPage }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [activeAction, setActiveAction] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/bookings/`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Could not load bookings. Is the Django server running?");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const clientName = (b.client_name || "").toLowerCase();
    const roomNum = String(b.room_number || "");
    const hotelName = (b.hotel_name || "").toLowerCase();
    const matchSearch =
      clientName.includes(search.toLowerCase()) ||
      roomNum.includes(search) ||
      hotelName.includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const nights = (b) =>
    Math.max(0, (new Date(b.check_out) - new Date(b.check_in)) / (1000 * 60 * 60 * 24));

  const closeModal = () => {
    setSelected(null);
    setActiveAction(null);
  };

  if (loading) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e", fontFamily: "'Jost', sans-serif", fontSize: "14px", letterSpacing: "3px" }}>
      LOADING...
    </div>
  );

  if (error) return (
    <div style={{ background: "#0d0d0d", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#c97b6e", fontFamily: "'Jost', sans-serif", fontSize: "14px", letterSpacing: "2px", textAlign: "center", padding: "40px" }}>
      {error}
    </div>
  );

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={goBack ? goBack : () => navigate("landing")}>
          {backLabel(previousPage)}
        </button>
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
                <span style={{ ...styles.statNum, color: statusStyle[s].color }}>
                  {bookings.filter(b => b.status === s).length}
                </span>
                <span style={styles.statLabel}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filters}>
          <input
            type="text"
            placeholder="Search by name, hotel, or room..."
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
                <tr>
                  <td colSpan={9} style={{ ...styles.td, textAlign: "center", color: "#4a3f32", padding: "48px" }}>
                    {bookings.length === 0 ? "No bookings yet." : "No bookings match your search."}
                  </td>
                </tr>
              ) : filtered.map(b => (
                <tr key={b.id} style={styles.tr} onClick={() => { setSelected(b); setActiveAction(null); }}>
                  <td style={styles.td}>#{b.id}</td>
                  <td style={styles.td}>
                    <div style={styles.guestName}>{b.client_name || "—"}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.hotelName}>{b.hotel_name || "—"}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.roomBadge,
                      color: roomTypeColor[b.room_type] || "#8a7a68",
                      background: (roomTypeColor[b.room_type] || "#8a7a68") + "15"
                    }}>
                      {b.room_number ? `Room ${b.room_number}` : "—"}
                    </span>
                  </td>
                  <td style={styles.td}>{b.check_in}</td>
                  <td style={styles.td}>{b.check_out}</td>
                  <td style={styles.td}>{nights(b)}n</td>
                  <td style={{ ...styles.td, color: "#c9a96e" }}>
                    ₱{parseFloat(b.total_price || 0).toLocaleString()}
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      color: statusStyle[b.status]?.color || "#8a7a68",
                      background: statusStyle[b.status]?.bg || "transparent",
                      border: `1px solid ${statusStyle[b.status]?.border || "#2a2520"}`
                    }}>
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
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Booking #{selected.id}</h3>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div style={styles.modalBody}>

              {/* Booking Details — hidden when an action is active */}
              {!activeAction && (
                <>
                  {[
                    { label: "GUEST", value: selected.client_name },
                    { label: "HOTEL", value: selected.hotel_name },
                    { label: "ROOM", value: selected.room_number ? `Room ${selected.room_number}` : "—" },
                    { label: "CHECK-IN", value: selected.check_in },
                    { label: "CHECK-OUT", value: selected.check_out },
                    { label: "DURATION", value: `${nights(selected)} night${nights(selected) > 1 ? "s" : ""}` },
                    { label: "TOTAL PRICE", value: `₱${parseFloat(selected.total_price || 0).toLocaleString()}`, highlight: true },
                    ...(selected.notes ? [{ label: "NOTES", value: selected.notes }] : []),
                  ].map((row, i) => (
                    <div key={i} style={styles.modalRow}>
                      <span style={styles.modalLabel}>{row.label}</span>
                      <div>
                        <span style={{
                          ...styles.modalValue,
                          ...(row.highlight ? { color: "#c9a96e", fontSize: "22px" } : {})
                        }}>
                          {row.value}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div style={styles.modalRow}>
                    <span style={styles.modalLabel}>STATUS</span>
                    <span style={{
                      ...styles.statusBadge,
                      color: statusStyle[selected.status]?.color,
                      background: statusStyle[selected.status]?.bg,
                      border: `1px solid ${statusStyle[selected.status]?.border}`
                    }}>
                      {selected.status}
                    </span>
                  </div>
                </>
              )}

              {/* Actions — only for confirmed bookings */}
              {selected.status === "confirmed" && (
                <div style={{ borderTop: !activeAction ? "1px solid #1e1a16" : "none" }}>

                  {/* Action Buttons */}
                  {!activeAction && (
                    <div style={{ padding: "20px 32px", display: "flex", gap: "12px" }}>
                      <button
                        style={{ flex: 1, background: "rgba(106,159,181,0.1)", border: "1px solid rgba(106,159,181,0.3)", color: "#6a9fb5", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}
                        onClick={() => setActiveAction("edit")}
                      >
                        Edit Profile
                      </button>
                      <button
                        style={{ flex: 1, background: "rgba(201,169,110,0.1)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}
                        onClick={() => setActiveAction("reschedule")}
                      >
                        Reschedule
                      </button>
                      <button
                        style={{ flex: 1, background: "rgba(201,123,110,0.1)", border: "1px solid rgba(201,123,110,0.3)", color: "#c97b6e", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}
                        onClick={() => setActiveAction("cancel")}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Edit Profile Form */}
                  {activeAction === "edit" && (
                    <div style={{ padding: "28px 32px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", margin: 0 }}>Edit Profile</p>
                        <button style={{ background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "11px" }} onClick={() => setActiveAction(null)}>← Back</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {[
                          ["editName", "Full Name", "text", selected.client_name],
                          ["editEmail", "Email", "email", ""],
                          ["editPhone", "Phone", "text", ""],
                          ["editNotes", "Special Requests / Notes", "text", selected.notes || ""],
                        ].map(([key, label, type, defaultVal]) => (
                          <div key={key}>
                            <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "6px" }}>{label}</label>
                            <input
                              type={type}
                              id={`modal-${key}`}
                              defaultValue={defaultVal}
                              style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2520", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Jost',sans-serif", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                            />
                          </div>
                        ))}
                        <button
                          style={{ background: "#6a9fb5", border: "none", color: "#0d0d0d", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500, marginTop: "4px" }}
                          onClick={async () => {
                            const newName = document.getElementById("modal-editName").value;
                            const newEmail = document.getElementById("modal-editEmail").value;
                            const newPhone = document.getElementById("modal-editPhone").value;
                            const newNotes = document.getElementById("modal-editNotes").value;
                            const [clientRes, bookingRes] = await Promise.all([
                              fetch(`${API_BASE}/clients/${selected.client}/`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone }),
                              }),
                              fetch(`${API_BASE}/bookings/${selected.id}/`, {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ notes: newNotes }),
                              }),
                            ]);
                            if (clientRes.ok && bookingRes.ok) {
                              const updatedClient = await clientRes.json();
                              const updatedBooking = await bookingRes.json();
                              setBookings(prev => prev.map(b => b.id === selected.id ? { ...b, client_name: updatedClient.name, notes: updatedBooking.notes } : b));
                              setSelected(prev => ({ ...prev, client_name: updatedClient.name, notes: updatedBooking.notes }));
                              setActiveAction(null);
                              alert("Profile updated!");
                            } else {
                              alert("Could not update. Check your inputs.");
                            }
                          }}
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Reschedule Form */}
                  {activeAction === "reschedule" && (
                    <div style={{ padding: "28px 32px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", margin: 0 }}>Reschedule</p>
                        <button style={{ background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "11px" }} onClick={() => setActiveAction(null)}>← Back</button>
                      </div>
                      <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "6px" }}>Check-in</label>
                          <input type="date" id="modal-checkin" defaultValue={selected.check_in}
                            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2520", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Jost',sans-serif", fontSize: "13px", boxSizing: "border-box", outline: "none", colorScheme: "dark" }}
                          />
                        </div>
                        <div style={{ flex: 1 }}>
                          <label style={{ display: "block", fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "6px" }}>Check-out</label>
                          <input type="date" id="modal-checkout" defaultValue={selected.check_out}
                            style={{ width: "100%", background: "#0d0d0d", border: "1px solid #2a2520", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Jost',sans-serif", fontSize: "13px", boxSizing: "border-box", outline: "none", colorScheme: "dark" }}
                          />
                        </div>
                      </div>
                      <button
                        style={{ background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.3)", color: "#c9a96e", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", width: "100%" }}
                        onClick={async () => {
                          const newCheckIn = document.getElementById("modal-checkin").value;
                          const newCheckOut = document.getElementById("modal-checkout").value;
                          if (!newCheckIn || !newCheckOut) return alert("Please select both dates.");
                          const res = await fetch(`${API_BASE}/bookings/${selected.id}/reschedule/`, {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ check_in: newCheckIn, check_out: newCheckOut }),
                          });
                          if (res.ok) {
                            const updated = await res.json();
                            setBookings(prev => prev.map(b => b.id === selected.id ? { ...b, ...updated } : b));
                            setSelected(prev => ({ ...prev, ...updated }));
                            setActiveAction(null);
                          } else {
                            const err = await res.json();
                            alert("Error: " + JSON.stringify(err));
                          }
                        }}
                      >
                        Confirm Reschedule
                      </button>
                    </div>
                  )}

                  {/* Cancel Confirm */}
                  {activeAction === "cancel" && (
                    <div style={{ padding: "28px 32px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#c97b6e", textTransform: "uppercase", margin: 0 }}>Cancel Booking</p>
                        <button style={{ background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "11px" }} onClick={() => setActiveAction(null)}>← Back</button>
                      </div>
                      <p style={{ fontFamily: "'Jost',sans-serif", fontSize: "13px", color: "#8a7a68", marginBottom: "20px" }}>Are you sure you want to cancel this booking? This cannot be undone.</p>
                      <button
                        style={{ width: "100%", background: "rgba(201,123,110,0.15)", border: "1px solid rgba(201,123,110,0.4)", color: "#c97b6e", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" }}
                        onClick={async () => {
                          const res = await fetch(`${API_BASE}/bookings/${selected.id}/cancel/`, { method: "PATCH" });
                          if (res.ok) {
                            setBookings(prev => prev.map(b => b.id === selected.id ? { ...b, status: "cancelled" } : b));
                            setSelected(prev => ({ ...prev, status: "cancelled" }));
                            setActiveAction(null);
                          } else {
                            alert("Could not cancel booking.");
                          }
                        }}
                      >
                        Confirm Cancellation
                      </button>
                    </div>
                  )}

                </div>
              )}
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
  backBtn: { background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "8px 16px" },
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
  tr: { borderBottom: "1px solid #1a1612", cursor: "pointer" },
  td: { padding: "16px 20px", fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68", verticalAlign: "middle" },
  guestName: { color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px" },
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
};