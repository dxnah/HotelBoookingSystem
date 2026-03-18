import { useState, useEffect, useCallback } from "react";
import { API_BASE } from "../api";
import { styles } from "../styles/AdminDashboard.js";

const TABS = ["Overview", "Hotels", "Rooms", "Clients", "Bookings"];
const statusColor = { confirmed: "#7eb87e", cancelled: "#c97b6e", rescheduled: "#c9a96e" };
const roomTypeColor = { single: "#6a9fb5", double: "#7eb87e", suite: "#c9a96e", deluxe: "#c97b6e" };

export default function AdminDashboard({ navigate, onLogout }) {
  const [tab, setTab] = useState("");
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [clients, setClients] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const token = localStorage.getItem("authToken");
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Token ${token}` }),
  };

  // ── Fetch all data ───────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [h, r, c, b] = await Promise.all([
        fetch(`${API_BASE}/hotels/`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/rooms/`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/clients/`, { headers }).then(res => res.json()),
        fetch(`${API_BASE}/bookings/`, { headers }).then(res => res.json()),
      ]);
      setHotels(Array.isArray(h) ? h : []);
      setRooms(Array.isArray(r) ? r : []);
      setClients(Array.isArray(c) ? c : []);
      setBookings(Array.isArray(b) ? b : []);
    } catch (err) {
      setError("Failed to load data. Is the Django server running?");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openAdd = (type) => { setModal({ type, mode: "add" }); setForm({}); };
  const openEdit = (type, data) => { setModal({ type, mode: "edit" }); setForm({ ...data }); };
  const closeModal = () => { setModal(null); setForm({}); };

  // ── Save (Create or Update) ──────────────────────────────
  const save = async () => {
    const { type, mode } = modal;
    const isEdit = mode === "edit";

    const endpoints = {
      hotel: `${API_BASE}/hotels/`,
      room: `${API_BASE}/rooms/`,
      client: `${API_BASE}/clients/`,
      booking: `${API_BASE}/bookings/`,
    };

    const url = isEdit ? `${endpoints[type]}${form.id}/` : endpoints[type];
    const method = isEdit ? "PUT" : "POST";

    const payload = { ...form };
    delete payload.hotel_name;
    delete payload.client_name;

    if (type === "room") {
      payload.hotel = parseInt(payload.hotel);
      payload.price_per_night = parseFloat(payload.price_per_night);
      payload.capacity = parseInt(payload.capacity);
      payload.is_available = payload.is_available === "true" || payload.is_available === true;
    }

    if (type === "booking") {
      payload.room = parseInt(payload.room);
      payload.client = parseInt(payload.client);
      delete payload.room_number;
      delete payload.total_price;
      delete payload.created_at;
      delete payload.updated_at;
    }

    try {
      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        alert("Error: " + JSON.stringify(errData));
        return;
      }

      await fetchAll();
      closeModal();
    } catch (err) {
      alert("Network error. Is Django running?");
    }
  };

  // ── Delete ───────────────────────────────────────────────
  const del = async (type, id) => {
    if (!window.confirm("Delete this record?")) return;

    const endpoints = {
      hotel: `${API_BASE}/hotels/`,
      room: `${API_BASE}/rooms/`,
      client: `${API_BASE}/clients/`,
      booking: `${API_BASE}/bookings/`,
    };

    try {
      const res = await fetch(`${endpoints[type]}${id}/`, {
        method: "DELETE",
        headers,
      });

      if (!res.ok && res.status !== 204) {
        alert("Delete failed.");
        return;
      }

      await fetchAll();
    } catch (err) {
      alert("Network error.");
    }
  };

  const getClient = (id) => clients.find(c => c.id === id);
  const getRoom = (id) => rooms.find(r => r.id === id);
  const getHotel = (id) => hotels.find(h => h.id === id);

  // ── Loading / Error states ───────────────────────────────
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
          <button style={styles.logoutBtn} onClick={onLogout || (() => navigate("landing"))}>⏻ Logout</button>
        </div>
      </div>

      {/* Main */}
      <div style={styles.main}>

        {/* Overview */}
        {(tab === "Overview" || tab === "") && (
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
                {
                  label: "Total Revenue",
                  value: "₱" + bookings
                    .filter(b => b.status === "confirmed")
                    .reduce((a, b) => a + parseFloat(b.total_price || 0), 0)
                    .toLocaleString(),
                  icon: "₱",
                  color: "#c9a96e"
                },
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
                <thead>
                  <tr>{["Guest", "Room", "Check-in", "Check-out", "Status", "Total"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map(b => (
                    <tr key={b.id} style={styles.tr}>
                      <td style={styles.td}>{b.client_name || getClient(b.client)?.name || "—"}</td>
                      <td style={styles.td}>{b.room_number ? `Room ${b.room_number}` : getRoom(b.room) ? `Room ${getRoom(b.room).room_number}` : "—"}</td>
                      <td style={styles.td}>{b.check_in}</td>
                      <td style={styles.td}>{b.check_out}</td>
                      <td style={styles.td}>
                        <span style={{ color: statusColor[b.status], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#c9a96e" }}>₱{parseFloat(b.total_price || 0).toLocaleString()}</td>
                    </tr>
                  ))}
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
                <thead>
                  <tr>{["Name", "Address", "Phone", "Email", "Rooms", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
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
                <thead>
                  <tr>{["Hotel", "Room #", "Type", "Price/Night", "Capacity", "Available", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {rooms.map(r => (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.td}>{r.hotel_name || getHotel(r.hotel)?.name || "—"}</td>
                      <td style={{ ...styles.td, color: "#e8dcc8" }}>Room {r.room_number}</td>
                      <td style={styles.td}>
                        <span style={{ color: roomTypeColor[r.room_type], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {r.room_type}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#c9a96e" }}>₱{parseFloat(r.price_per_night).toLocaleString()}</td>
                      <td style={styles.td}>{r.capacity}</td>
                      <td style={styles.td}>
                        <span style={{ color: r.is_available ? "#7eb87e" : "#c97b6e", fontSize: "11px", fontFamily: "'Jost',sans-serif", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {r.is_available ? "Yes" : "No"}
                        </span>
                      </td>
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
                <thead>
                  <tr>{["Name", "Email", "Phone", "Joined", "Bookings", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {clients.map(c => (
                    <tr key={c.id} style={styles.tr}>
                      <td style={{ ...styles.td, color: "#e8dcc8", fontFamily: "'Cormorant Garamond',serif", fontSize: "17px" }}>{c.name}</td>
                      <td style={styles.td}>{c.email}</td>
                      <td style={styles.td}>{c.phone}</td>
                      <td style={styles.td}>{c.created_at ? c.created_at.split("T")[0] : "—"}</td>
                      <td style={styles.td}>{bookings.filter(b => b.client === c.id).length}</td>
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
              <button style={styles.addBtn} onClick={() => openAdd("booking")}>+ Add Booking</button>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>{["#", "Guest", "Room", "Check-in", "Check-out", "Status", "Total", "Notes", "Actions"].map(h => <th key={h} style={styles.th}>{h}</th>)}</tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b.id} style={styles.tr}>
                      <td style={styles.td}>#{b.id}</td>
                      <td style={{ ...styles.td, color: "#e8dcc8", fontFamily: "'Cormorant Garamond',serif", fontSize: "16px" }}>
                        {b.client_name || getClient(b.client)?.name || "—"}
                      </td>
                      <td style={styles.td}>
                        {b.room_number ? `Room ${b.room_number}` : getRoom(b.room) ? `Room ${getRoom(b.room).room_number}` : "—"}
                      </td>
                      <td style={styles.td}>{b.check_in}</td>
                      <td style={styles.td}>{b.check_out}</td>
                      <td style={styles.td}>
                        <span style={{ color: statusColor[b.status], fontFamily: "'Jost',sans-serif", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={{ ...styles.td, color: "#c9a96e" }}>₱{parseFloat(b.total_price || 0).toLocaleString()}</td>
                      <td style={{ ...styles.td, maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {b.notes || "—"}
                      </td>
                      <td style={styles.td}>
                        <button style={styles.editBtn} onClick={() => openEdit("booking", b)}>Edit</button>
                        <button style={styles.delBtn} onClick={() => del("booking", b.id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
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
              <h3 style={styles.modalTitle}>
                {modal.mode === "add" ? "Add" : "Edit"} {modal.type.charAt(0).toUpperCase() + modal.type.slice(1)}
              </h3>
              <button style={styles.closeBtn} onClick={closeModal}>✕</button>
            </div>
            <div style={styles.modalBody}>

              {/* Hotel Form */}
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

              {/* Room Form */}
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

              {/* Client Form */}
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

              {/* Booking Form */}
              {modal.type === "booking" && (
                <>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Client</label>
                    <select style={styles.input} value={form.client || ""} onChange={e => setForm({ ...form, client: e.target.value })}>
                      <option value="">Select client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Room</label>
                    <select style={styles.input} value={form.room || ""} onChange={e => setForm({ ...form, room: e.target.value })}>
                      <option value="">Select room</option>
                      {rooms.map(r => (
                        <option key={r.id} value={r.id}>
                          Room {r.room_number} — {r.hotel_name || getHotel(r.hotel)?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={styles.field}>
                    <label style={styles.fieldLabel}>Status</label>
                    <select style={styles.input} value={form.status || "confirmed"} onChange={e => setForm({ ...form, status: e.target.value })}>
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