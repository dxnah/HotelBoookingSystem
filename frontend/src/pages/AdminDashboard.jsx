import { useState } from "react";

const initHotels = [
  { id: 1, name: "Grand Velour Manila", address: "Ayala Ave, Makati", phone: "02-8123-4567", email: "manila@grandvelour.com" },
  { id: 2, name: "Grand Velour Cebu", address: "Colon St, Cebu City", phone: "032-234-5678", email: "cebu@grandvelour.com" },
];
const initRooms = [
  { id: 1, hotel: 1, room_number: "101", room_type: "single", price_per_night: 1800, is_available: true, capacity: 1, description: "Cozy single room" },
  { id: 2, hotel: 1, room_number: "201", room_type: "double", price_per_night: 2800, is_available: true, capacity: 2, description: "Spacious double room" },
  { id: 3, hotel: 1, room_number: "301", room_type: "suite", price_per_night: 6500, is_available: false, capacity: 3, description: "Luxurious suite" },
  { id: 4, hotel: 2, room_number: "101", room_type: "deluxe", price_per_night: 4500, is_available: true, capacity: 2, description: "Deluxe with sea view" },
];
const initClients = [
  { id: 1, name: "Maria Santos", email: "maria@email.com", phone: "09171234567", created_at: "2024-12-01" },
  { id: 2, name: "Jose Reyes", email: "jose@email.com", phone: "09281234567", created_at: "2024-12-05" },
  { id: 3, name: "Ana Cruz", email: "ana@email.com", phone: "09391234567", created_at: "2024-12-10" },
];
const initBookings = [
  { id: 1, client_id: 1, room_id: 2, check_in: "2024-12-20", check_out: "2024-12-23", status: "confirmed", total_price: 8400, notes: "Early check-in" },
  { id: 2, client_id: 2, room_id: 3, check_in: "2024-12-25", check_out: "2024-12-28", status: "confirmed", total_price: 19500, notes: "" },
  { id: 3, client_id: 3, room_id: 1, check_in: "2024-12-15", check_out: "2024-12-17", status: "cancelled", total_price: 3200, notes: "" },
];

const TABS = ["Overview", "Hotels", "Rooms", "Clients", "Bookings"];
const statusColor = { confirmed: "#7eb87e", cancelled: "#c97b6e", rescheduled: "#c9a96e" };
const roomTypeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

export default function AdminDashboard({ navigate }) {
  const [tab, setTab] = useState("Overview");
  const [hotels, setHotels] = useState(initHotels);
  const [rooms, setRooms] = useState(initRooms);
  const [clients, setClients] = useState(initClients);
  const [bookings, setBookings] = useState(initBookings);
  const [modal, setModal] = useState(null); // { type, data }
  const [form, setForm] = useState({});

  const openAdd = (type) => { setModal({ type, mode: "add" }); setForm({}); };
  const openEdit = (type, data) => { setModal({ type, mode: "edit" }); setForm({ ...data }); };
  const closeModal = () => { setModal(null); setForm({}); };

  const save = () => {
    if (modal.type === "hotel") {
      if (modal.mode === "add") setHotels([...hotels, { ...form, id: Date.now() }]);
      else setHotels(hotels.map(h => h.id === form.id ? form : h));
    }
    if (modal.type === "room") {
      if (modal.mode === "add") setRooms([...rooms, { ...form, id: Date.now(), hotel: parseInt(form.hotel), price_per_night: parseFloat(form.price_per_night), capacity: parseInt(form.capacity), is_available: form.is_available === "true" || form.is_available === true }]);
      else setRooms(rooms.map(r => r.id === form.id ? { ...form, hotel: parseInt(form.hotel), price_per_night: parseFloat(form.price_per_night), capacity: parseInt(form.capacity), is_available: form.is_available === "true" || form.is_available === true } : r));
    }
    if (modal.type === "client") {
      if (modal.mode === "add") setClients([...clients, { ...form, id: Date.now(), created_at: new Date().toISOString().split("T")[0] }]);
      else setClients(clients.map(c => c.id === form.id ? form : c));
    }
    if (modal.type === "booking") {
      if (modal.mode === "edit") setBookings(bookings.map(b => b.id === form.id ? { ...form, client_id: parseInt(form.client_id), room_id: parseInt(form.room_id) } : b));
    }
    closeModal();
  };

  const del = (type, id) => {
    if (!window.confirm("Delete this record?")) return;
    if (type === "hotel") setHotels(hotels.filter(h => h.id !== id));
    if (type === "room") setRooms(rooms.filter(r => r.id !== id));
    if (type === "client") setClients(clients.filter(c => c.id !== id));
    if (type === "booking") setBookings(bookings.filter(b => b.id !== id));
  };

  const getClient = (id) => clients.find(c => c.id === id);
  const getRoom = (id) => rooms.find(r => r.id === id);
  const getHotel = (id) => hotels.find(h => h.id === id);

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarLogo}>GRAND<span style={{ color: "#c9a96e" }}>VELOUR</span></div>
        <p style={styles.sidebarSub}>Admin Panel</p>
        <nav style={styles.sidebarNav}>
          {TABS.map(t => (
            <button key={t} style={{ ...styles.sidebarBtn, ...(tab === t ? styles.sidebarActive : {}) }} onClick={() => setTab(t)}>
              {t === "Overview" ? "◈" : t === "Hotels" ? "🏨" : t === "Rooms" ? "🛏" : t === "Clients" ? "👤" : "📋"} {t}
            </button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back to Site</button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>
        {/* Overview */}
        {tab === "Overview" && (
          <div>
            <h1 style={styles.pageTitle}>Overview</h1>
            <div style={styles.statsGrid}>
              {[
                { label: "Hotels", value: hotels.length, icon: "🏨", color: "#c9a96e" },
                { label: "Rooms", value: rooms.length, icon: "🛏️", color: "#7eb87e" },
                { label: "Clients", value: clients.length, icon: "👤", color: "#6a9fb5" },
                { label: "Bookings", value: bookings.length, icon: "📋", color: "#c97b6e" },
                { label: "Confirmed", value: bookings.filter(b => b.status === "confirmed").length, icon: "✓", color: "#7eb87e" },
                { label: "Cancelled", value: bookings.filter(b => b.status === "cancelled").length, icon: "✕", color: "#c97b6e" },
                { label: "Available Rooms", value: rooms.filter(r => r.is_available).length, icon: "🟢", color: "#7eb87e" },
                { label: "Total Revenue", value: "₱" + bookings.filter(b => b.status === "confirmed").reduce((a, b) => a + b.total_price, 0).toLocaleString(), icon: "₱", color: "#c9a96e" },
              ].map((s, i) => (
                <div key={i} style={styles.statCard}>
                  <span style={styles.statIcon}>{s.icon}</span>
                  <span style={{ ...styles.statValue, color: s.color }}>{s.value}</span>
                  <span style={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>

            <h2 style={styles.sectionTitle}>Recent Bookings</h2>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Guest", "Room", "Check-in", "Check-out", "Status", "Total"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {bookings.slice(0, 5).map(b => {
                    const c = getClient(b.client_id); const r = getRoom(b.room_id);
                    return (
                      <tr key={b.id} style={styles.tr}>
                        <td style={styles.td}>{c?.name}</td>
                        <td style={styles.td}>{r ? `Room ${r.room_number}` : "—"}</td>
                        <td style={styles.td}>{b.check_in}</td>
                        <td style={styles.td}>{b.check_out}</td>
                        <td style={styles.td}><span style={{ color: statusColor[b.status], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{b.status}</span></td>
                        <td style={{ ...styles.td, color: "#c9a96e" }}>₱{b.total_price.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Hotels */}
        {tab === "Hotels" && (
          <div>
            <div style={styles.tabHeader}>
              <h1 style={styles.pageTitle}>Hotels</h1>
              <button style={styles.addBtn} onClick={() => openAdd("hotel")}>+ Add Hotel</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Name", "Address", "Phone", "Email", "Rooms", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {hotels.map(h => (
                    <tr key={h.id} style={styles.tr}>
                      <td style={{ ...styles.td, color: "#e8dcc8", fontFamily: "'Cormorant Garamond',serif", fontSize: "17px" }}>{h.name}</td>
                      <td style={styles.td}>{h.address}</td>
                      <td style={styles.td}>{h.phone}</td>
                      <td style={styles.td}>{h.email}</td>
                      <td style={styles.td}>{rooms.filter(r => r.hotel === h.id).length}</td>
                      <td style={styles.td}>
                        <button style={styles.editBtn} onClick={() => openEdit("hotel", h)}>Edit</button>
                        <button style={styles.delBtn} onClick={() => del("hotel", h.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Rooms */}
        {tab === "Rooms" && (
          <div>
            <div style={styles.tabHeader}>
              <h1 style={styles.pageTitle}>Rooms</h1>
              <button style={styles.addBtn} onClick={() => openAdd("room")}>+ Add Room</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Hotel", "Room #", "Type", "Price/Night", "Capacity", "Available", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {rooms.map(r => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>{getHotel(r.hotel)?.name}</td>
                      <td style={{ ...styles.td, color: "#e8dcc8" }}>Room {r.room_number}</td>
                      <td style={styles.td}><span style={{ color: roomTypeColor[r.room_type], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{r.room_type}</span></td>
                      <td style={{ ...styles.td, color: "#c9a96e" }}>₱{r.price_per_night.toLocaleString()}</td>
                      <td style={styles.td}>{r.capacity}</td>
                      <td style={styles.td}><span style={{ color: r.is_available ? "#7eb87e" : "#c97b6e", fontSize: "11px", fontFamily: "'Jost',sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>{r.is_available ? "Yes" : "No"}</span></td>
                      <td style={styles.td}>
                        <button style={styles.editBtn} onClick={() => openEdit("room", r)}>Edit</button>
                        <button style={styles.delBtn} onClick={() => del("room", r.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Clients */}
        {tab === "Clients" && (
          <div>
            <div style={styles.tabHeader}>
              <h1 style={styles.pageTitle}>Clients</h1>
              <button style={styles.addBtn} onClick={() => openAdd("client")}>+ Add Client</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["Name", "Email", "Phone", "Joined", "Bookings", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={{ ...styles.td, color: "#e8dcc8", fontFamily: "'Cormorant Garamond',serif", fontSize: "17px" }}>{c.name}</td>
                      <td style={styles.td}>{c.email}</td>
                      <td style={styles.td}>{c.phone}</td>
                      <td style={styles.td}>{c.created_at}</td>
                      <td style={styles.td}>{bookings.filter(b => b.client_id === c.id).length}</td>
                      <td style={styles.td}>
                        <button style={styles.editBtn} onClick={() => openEdit("client", c)}>Edit</button>
                        <button style={styles.delBtn} onClick={() => del("client", c.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings */}
        {tab === "Bookings" && (
          <div>
            <div style={styles.tabHeader}>
              <h1 style={styles.pageTitle}>Bookings</h1>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead><tr>{["#", "Guest", "Room", "Check-in", "Check-out", "Status", "Total", "Notes", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr></thead>
                <tbody>
                  {bookings.map(b => {
                    const c = getClient(b.client_id); const r = getRoom(b.room_id);
                    return (
                      <tr key={b.id} style={styles.tr}>
                        <td style={styles.td}>#{b.id}</td>
                        <td style={{ ...styles.td, color: "#e8dcc8", fontFamily: "'Cormorant Garamond',serif", fontSize: "16px" }}>{c?.name}</td>
                        <td style={styles.td}>{r ? `Room ${r.room_number}` : "—"}</td>
                        <td style={styles.td}>{b.check_in}</td>
                        <td style={styles.td}>{b.check_out}</td>
                        <td style={styles.td}><span style={{ color: statusColor[b.status], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>{b.status}</span></td>
                        <td style={{ ...styles.td, color: "#c9a96e" }}>₱{b.total_price.toLocaleString()}</td>
                        <td style={{ ...styles.td, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.notes || "—"}</td>
                        <td style={styles.td}>
                          <button style={styles.editBtn} onClick={() => openEdit("booking", b)}>Edit</button>
                          <button style={styles.delBtn} onClick={() => del("booking", b.id)}>Delete</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div style={styles.overlay} onClick={closeModal}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHead}>
              <h3 style={styles.modalTitle}>{modal.mode === "add" ? "Add" : "Edit"} {modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}</h3>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div style={styles.modalBody}>
              {modal.type === "hotel" && (
                <>
                  {[["name", "Hotel Name", "text"], ["address", "Address", "text"], ["phone", "Phone", "text"], ["email", "Email", "email"]].map(([k, l, t]) => (
                    <div key={k} style={styles.field}>
                      <label style={styles.fieldLabel}>{l}</label>
                      <input style={styles.input} type={t} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                </>
              )}
              {modal.type === "room" && (
                <>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Hotel</label>
                    <select style={styles.input} value={form.hotel || ""} onChange={e => setForm({ ...form, hotel: e.target.value })}>
                      <option value="">Select hotel</option>
                      {hotels.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                    </select>
                  </div>
                  {[["room_number", "Room Number", "text"], ["price_per_night", "Price/Night", "number"], ["capacity", "Capacity", "number"], ["description", "Description", "text"]].map(([k, l, t]) => (
                    <div key={k} style={styles.field}>
                      <label style={styles.fieldLabel}>{l}</label>
                      <input style={styles.input} type={t} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Room Type</label>
                    <select style={styles.input} value={form.room_type || ""} onChange={e => setForm({ ...form, room_type: e.target.value })}>
                      <option value="">Select type</option>
                      {["single", "double", "suite", "deluxe"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Available</label>
                    <select style={styles.input} value={String(form.is_available)} onChange={e => setForm({ ...form, is_available: e.target.value })}>
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </>
              )}
              {modal.type === "client" && (
                <>
                  {[["name", "Full Name", "text"], ["email", "Email", "email"], ["phone", "Phone", "text"]].map(([k, l, t]) => (
                    <div key={k} style={styles.field}>
                      <label style={styles.fieldLabel}>{l}</label>
                      <input style={styles.input} type={t} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                </>
              )}
              {modal.type === "booking" && (
                <>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Status</label>
                    <select style={styles.input} value={form.status || ""} onChange={e => setForm({ ...form, status: e.target.value })}>
                      {["confirmed", "cancelled", "rescheduled"].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  {[["check_in", "Check-in", "date"], ["check_out", "Check-out", "date"]].map(([k, l, t]) => (
                    <div key={k} style={styles.field}>
                      <label style={styles.fieldLabel}>{l}</label>
                      <input style={styles.input} type={t} value={form[k] || ""} onChange={e => setForm({ ...form, [k]: e.target.value })} />
                    </div>
                  ))}
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Notes</label>
                    <textarea style={{ ...styles.input, height: "70px", resize: "vertical" }} value={form.notes || ""} onChange={e => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </>
              )}
              <button style={styles.saveBtn} onClick={save}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { display: "flex", background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  sidebar: { width: "220px", borderRight: "1px solid #1e1a16", display: "flex", flexDirection: "column", padding: "32px 0", position: "sticky", top: 0, height: "100vh", flexShrink: 0 },
  sidebarLogo: { fontSize: "18px", fontWeight: 600, letterSpacing: "4px", padding: "0 24px 4px" },
  sidebarSub: { fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#4a3f32", padding: "0 24px", margin: "0 0 32px", textTransform: "uppercase" },
  sidebarNav: { display: "flex", flexDirection: "column", gap: "2px", flex: 1 },
  sidebarBtn: { background: "none", border: "none", color: "#6a5f52", cursor: "pointer", padding: "12px 24px", textAlign: "left", fontFamily: "'Jost',sans-serif", fontSize: "13px", letterSpacing: "1px" },
  sidebarActive: { color: "#c9a96e", background: "rgba(201,169,110,0.08)", borderLeft: "2px solid #c9a96e" },
  sidebarFooter: { padding: "24px" },
  backBtn: { background: "none", border: "none", color: "#4a3f32", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "12px" },
  main: { flex: 1, padding: "48px 60px", overflowY: "auto" },
  pageTitle: { fontSize: "42px", fontWeight: 300, margin: "0 0 40px" },
  tabHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "60px" },
  statCard: { border: "1px solid #1e1a16", padding: "28px", display: "flex", flexDirection: "column", gap: "8px" },
  statIcon: { fontSize: "20px" },
  statValue: { fontSize: "32px", fontWeight: 300 },
  statLabel: { fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  sectionTitle: { fontSize: "28px", fontWeight: 300, margin: "0 0 24px" },
  tableWrap: { border: "1px solid #1e1a16", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: {},
  th: { fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase", padding: "14px 20px", textAlign: "left", borderBottom: "1px solid #1e1a16", background: "#111" },
  tr: { borderBottom: "1px solid #1a1612" },
  td: { padding: "14px 20px", fontFamily: "'Jost',sans-serif", fontSize: "13px", color: "#8a7a68", verticalAlign: "middle" },
  addBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "12px 28px", fontFamily: "'Jost',sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  editBtn: { background: "none", border: "1px solid #2a2520", color: "#8a7a68", padding: "6px 14px", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "11px", marginRight: "8px" },
  delBtn: { background: "none", border: "1px solid #3a1a16", color: "#c97b6e", padding: "6px 14px", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: "11px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#111", border: "1px solid #2a2520", width: "440px", maxHeight: "80vh", overflow: "auto" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 32px", borderBottom: "1px solid #1e1a16" },
  modalTitle: { fontSize: "22px", fontWeight: 400, margin: 0 },
  closeBtn: { background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontSize: "16px" },
  modalBody: { padding: "24px 32px", display: "flex", flexDirection: "column", gap: "16px" },
  field: {},
  fieldLabel: { display: "block", fontFamily: "'Jost',sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "8px" },
  input: { width: "100%", background: "#0d0d0d", border: "1px solid #2a2520", color: "#e8dcc8", padding: "10px 14px", fontFamily: "'Jost',sans-serif", fontSize: "14px", boxSizing: "border-box", outline: "none" },
  saveBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "12px", fontFamily: "'Jost',sans-serif", fontSize: "12px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase", marginTop: "8px" },
};