import { useState, useEffect } from "react";
import { API_BASE } from "../api";

function SkeletonBlock({ width = "100%", height = "20px", style = {} }) {
  return (
    <div style={{
      width, height, background: "linear-gradient(90deg, #1a1a1a 25%, #252520 50%, #1a1a1a 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite", borderRadius: "2px", ...style,
    }} />
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  return (
    <div style={{
      position: "fixed", top: "24px", right: "24px", zIndex: 9999,
      padding: "12px 20px", fontFamily: "'Jost', sans-serif", fontSize: "13px",
      letterSpacing: "0.5px", display: "flex", alignItems: "center",
      animation: "toastIn 0.3s ease forwards", backdropFilter: "blur(10px)",
      minWidth: "260px",
      background: toast.type === "success" ? "rgba(126,184,126,0.15)" : "rgba(201,123,110,0.15)",
      border: `1px solid ${toast.type === "success" ? "rgba(126,184,126,0.4)" : "rgba(201,123,110,0.4)"}`,
      color: toast.type === "success" ? "#7eb87e" : "#c97b6e",
    }}>
      <span style={{ marginRight: "8px" }}>{toast.type === "success" ? "✓" : "⚠"}</span>
      {toast.message}
    </div>
  );
}

export default function UserProfile({ navigate, onLogout }) {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const token = sessionStorage.getItem("userToken");
    if (!token) { navigate("userlogin"); return; }

    const loadUser = async () => {
      setLoading(true);
      try {
        const cached = sessionStorage.getItem("userData");
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser(parsed);
          setEditForm({
            first_name: parsed.first_name || "",
            last_name: parsed.last_name || "",
            email: parsed.email || "",
          });
        }
        const res = await fetch("http://127.0.0.1:8000/api/v1/user/profile/", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (res.ok) {
          const me = await res.json();
          sessionStorage.setItem("userData", JSON.stringify(me));
          setUser(me);
          setEditForm({ first_name: me.first_name || "", last_name: me.last_name || "", email: me.email || "" });
        }
        const bRes = await fetch(`${API_BASE}/bookings/`);
        if (bRes.ok) {
          const allBookings = await bRes.json();
          const cached = sessionStorage.getItem("userData");
          if (cached) {
            const u = JSON.parse(cached);
            const userEmail = (u.email || "").toLowerCase();
            const userName = `${u.first_name || ""} ${u.last_name || ""}`.trim().toLowerCase();
            const myBookings = allBookings.filter(b =>
              (b.client_name || "").toLowerCase() === userName ||
              (b.client_email || "").toLowerCase() === userEmail
            );
            setBookings(myBookings);
          } else {
            setBookings(Array.isArray(allBookings) ? allBookings : []);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [navigate]);

  const handleSave = async () => {
    const token = sessionStorage.getItem("userToken");
    setSaving(true);
    try {
        const res = await fetch("http://127.0.0.1:8000/api/v1/user/profile/", {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(editForm),
        });
      if (res.ok) {
        const updated = await res.json();
        setUser(updated);
        sessionStorage.setItem("userData", JSON.stringify(updated));
        setEditMode(false);
        showToast("Profile updated successfully.");
      } else {
        showToast("Failed to update. Please try again.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("userUsername");
    if (onLogout) onLogout();
    navigate("landing");
  };

  const initials = user
    ? ((user.first_name?.[0] || "") + (user.last_name?.[0] || "") || user.username?.[0] || "G").toUpperCase()
    : "G";

  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ") || user.username
    : "Guest";

  if (loading) return (
    <div style={S.page}>
      <style>{`
        @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
      <nav style={S.nav}>
        <div style={{ width: "100px" }} />
        <div style={S.logo}>GRAND<span style={S.logoGold}>VELOUR</span></div>
        <div style={{ width: "100px" }} />
      </nav>
      <div style={{ display: "flex", minHeight: "calc(100vh - 65px)" }}>
        <aside style={{ ...S.sidebar, gap: "20px" }}>
          <SkeletonBlock width="80px" height="80px" style={{ borderRadius: "50%", alignSelf: "center" }} />
          <SkeletonBlock width="140px" height="22px" style={{ alignSelf: "center" }} />
          <SkeletonBlock width="100px" height="14px" style={{ alignSelf: "center" }} />
          <SkeletonBlock width="100%" height="1px" />
          <SkeletonBlock width="100%" height="40px" />
          <SkeletonBlock width="100%" height="40px" />
          <SkeletonBlock width="100%" height="40px" />
        </aside>
        <main style={{ flex: 1, padding: "40px 48px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <SkeletonBlock width="200px" height="32px" />
          <SkeletonBlock width="100%" height="80px" />
          <SkeletonBlock width="100%" height="80px" />
          <SkeletonBlock width="100%" height="80px" />
        </main>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .profile-fade { animation: fadeIn 0.4s ease forwards; }
        .tab-btn:hover { color: #c9a96e !important; }
        .edit-input:focus { border-color: #c9a96e !important; outline: none; }
        .booking-row:hover { background: rgba(201,169,110,0.04) !important; }
      `}</style>

      <Toast toast={toast} />

      <nav style={S.nav}>
        <button style={S.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={S.logo}>GRAND<span style={S.logoGold}>VELOUR</span></div>
        <button style={S.logoutBtn} onClick={handleLogout}>Sign Out</button>
      </nav>

      <div className="profile-fade" style={S.content}>
        <aside style={S.sidebar}>
          <div style={S.avatarWrap}>
            <div style={S.avatar}>{initials}</div>
            <div style={S.avatarRing} />
          </div>
          <h2 style={S.sidebarName}>{fullName}</h2>
          <p style={S.sidebarUsername}>{user?.email}</p>
          <div style={S.sidebarDivider} />
          <p style={S.memberSince}>
            MEMBER SINCE<br />
            <span style={{ color: "#c9a96e", fontFamily: "'Cormorant Garamond', serif", fontSize: "16px", fontWeight: 400 }}>
              {user?.date_joined ? new Date(user.date_joined).toLocaleDateString("en-PH", { year: "numeric", month: "long" }) : "2024"}
            </span>
          </p>
          <div style={S.sidebarDivider} />
          <nav style={S.sideNav}>
            {[
              { id: "profile", icon: "👤", label: "Profile Details" },
              { id: "bookings", icon: "📋", label: "My Bookings" },
            ].map(t => (
              <button key={t.id} className="tab-btn"
                style={{ ...S.sideNavBtn, ...(activeTab === t.id ? S.sideNavActive : {}) }}
                onClick={() => setActiveTab(t.id)}>
                <span style={{ marginRight: "10px" }}>{t.icon}</span>{t.label}
              </button>
            ))}
          </nav>
          <div style={{ marginTop: "auto", paddingTop: "24px" }}>
            <button style={S.reserveBtn} onClick={() => navigate("book")}>Reserve a Room →</button>
          </div>
        </aside>

        <main style={S.main}>
          {activeTab === "profile" && (
            <div>
              <div style={S.panelHeader}>
                <div>
                  <h3 style={S.panelTitle}>Profile Details</h3>
                  <p style={S.panelSub}>Manage your personal information</p>
                </div>
                {!editMode ? (
                  <button style={S.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
                ) : (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button style={S.cancelBtn} onClick={() => { setEditMode(false); setEditForm({ first_name: user?.first_name || "", last_name: user?.last_name || "", email: user?.email || "" }); }}>Cancel</button>
                    <button style={{ ...S.saveBtn, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
                  </div>
                )}
              </div>

              <div style={S.profileGrid}>
                <div style={S.infoBlock}>
                  <span style={S.infoLabel}>EMAIL ADDRESS</span>
                  {editMode ? (
                    <input type="email" value={editForm.email} className="edit-input"
                      onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                      style={S.editInput} />
                  ) : (
                    <span style={S.infoValue}>{user?.email || <span style={{ color: "#4a3f32" }}>—</span>}</span>
                  )}
                </div>
                <div style={S.infoBlock}>
                  <span style={S.infoLabel}>FIRST NAME</span>
                  {editMode ? (
                    <input type="text" value={editForm.first_name} className="edit-input"
                      onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
                      style={S.editInput} />
                  ) : (
                    <span style={S.infoValue}>{user?.first_name || <span style={{ color: "#4a3f32" }}>—</span>}</span>
                  )}
                </div>
                <div style={S.infoBlock}>
                  <span style={S.infoLabel}>LAST NAME</span>
                  {editMode ? (
                    <input type="text" value={editForm.last_name} className="edit-input"
                      onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
                      style={S.editInput} />
                  ) : (
                    <span style={S.infoValue}>{user?.last_name || <span style={{ color: "#4a3f32" }}>—</span>}</span>
                  )}
                </div>
                <div style={S.infoBlock}>
                  <span style={S.infoLabel}>GUEST ID</span>
                  <span style={S.infoValue}>
                    <span style={{ fontFamily: "'Jost', sans-serif", color: "#c9a96e", fontSize: "13px", letterSpacing: "1px" }}>
                      GV-{String(user?.id || "0000").padStart(6, "0")}
                    </span>
                  </span>
                </div>
                <div style={S.infoBlock}>
                  <span style={S.infoLabel}>ACCOUNT STATUS</span>
                  <span style={S.infoValue}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", color: "#7eb87e" }}>
                      ● Active Guest
                    </span>
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "32px" }}>
                <h4 style={S.sectionTitle}>Security</h4>
                <div style={S.securityCard}>
                  <div>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#e8dcc8", margin: "0 0 4px" }}>Password</p>
                    <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", margin: 0 }}>Last updated: unknown</p>
                  </div>
                  <button style={S.securityBtn} onClick={() => navigate("landing")}>Change Password</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookings" && (
            <div>
              <div style={S.panelHeader}>
                <div>
                  <h3 style={S.panelTitle}>My Bookings</h3>
                  <p style={S.panelSub}>{bookings.length} reservation{bookings.length !== 1 ? "s" : ""} found</p>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div style={S.emptyState}>
                  <div style={{ fontSize: "40px", marginBottom: "16px" }}>🏨</div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", color: "#e8dcc8", margin: "0 0 8px" }}>No reservations yet</p>
                  <p style={{ fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#4a3f32", margin: "0 0 24px" }}>Your booking history will appear here.</p>
                  <button style={S.reserveBtn} onClick={() => navigate("book")}>Reserve a Room →</button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", border: "1px solid #1e1a16" }}>
                  <div style={{ ...S.tableRow, background: "#0f0e0c", borderBottom: "1px solid #2a2520" }}>
                    {["BOOKING REF", "ROOM", "CHECK-IN", "CHECK-OUT", "STATUS"].map(h => (
                      <span key={h} style={S.tableHead}>{h}</span>
                    ))}
                  </div>
                  {bookings.map((b, i) => (
                    <div key={b.id} className="booking-row"
                      style={{ ...S.tableRow, background: i % 2 === 0 ? "#0d0c0a" : "#111", transition: "background 0.2s" }}>
                      <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#c9a96e", letterSpacing: "1px" }}>
                        GV-{String(b.id).padStart(6, "0")}
                      </span>
                      <span style={S.tableCell}>Room {b.room}</span>
                      <span style={S.tableCell}>{b.check_in}</span>
                      <span style={S.tableCell}>{b.check_out}</span>
                      <span style={{
                        fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",
                        color: b.status === "confirmed" ? "#7eb87e" : b.status === "cancelled" ? "#c97b6e" : "#c9a96e",
                        border: `1px solid ${b.status === "confirmed" ? "#7eb87e" : b.status === "cancelled" ? "#c97b6e" : "#c9a96e"}`,
                        padding: "3px 8px",
                      }}>
                        {b.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const S = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #1e1a16" },
  backBtn: { background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "8px 16px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoGold: { color: "#c9a96e" },
  logoutBtn: { background: "transparent", border: "1px solid #2a2520", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", padding: "8px 16px", textTransform: "uppercase", transition: "all 0.2s" },
  content: { display: "flex", gap: "0", minHeight: "calc(100vh - 65px)" },
  sidebar: { width: "280px", flexShrink: 0, borderRight: "1px solid #1e1a16", padding: "40px 32px", display: "flex", flexDirection: "column", alignItems: "center" },
  avatarWrap: { position: "relative", marginBottom: "20px" },
  avatar: { width: "80px", height: "80px", borderRadius: "50%", background: "linear-gradient(135deg, #c9a96e, #8a6d3a)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: 600, color: "#0d0d0d", letterSpacing: "1px", position: "relative", zIndex: 1 },
  avatarRing: { position: "absolute", inset: "-4px", borderRadius: "50%", border: "1px solid rgba(201,169,110,0.3)", top: "-4px", left: "-4px", right: "-4px", bottom: "-4px" },
  sidebarName: { fontSize: "22px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 4px", textAlign: "center" },
  sidebarUsername: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "1px", margin: "0 0 20px", textAlign: "center" },
  sidebarDivider: { width: "100%", height: "1px", background: "#1e1a16", margin: "8px 0 16px" },
  memberSince: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textAlign: "center", textTransform: "uppercase", lineHeight: 2, marginBottom: "8px" },
  sideNav: { width: "100%", display: "flex", flexDirection: "column", gap: "4px" },
  sideNavBtn: { width: "100%", background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "1px", padding: "10px 12px", textAlign: "left", transition: "all 0.2s" },
  sideNavActive: { background: "rgba(201,169,110,0.08)", color: "#c9a96e", borderLeft: "2px solid #c9a96e", paddingLeft: "10px" },
  reserveBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 20px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500, width: "100%" },
  main: { flex: 1, padding: "40px 48px" },
  panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px" },
  panelTitle: { fontSize: "28px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 4px" },
  panelSub: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", margin: 0 },
  editBtn: { background: "transparent", border: "1px solid rgba(201,169,110,0.4)", color: "#c9a96e", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", padding: "8px 20px", textTransform: "uppercase" },
  cancelBtn: { background: "transparent", border: "1px solid #2a2520", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", padding: "8px 16px" },
  saveBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", padding: "8px 20px", textTransform: "uppercase", fontWeight: 500 },
  profileGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0", border: "1px solid #1e1a16" },
  infoBlock: { padding: "20px 24px", borderRight: "1px solid #1e1a16", borderBottom: "1px solid #1e1a16", display: "flex", flexDirection: "column", gap: "8px" },
  infoLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  infoValue: { fontSize: "18px", fontWeight: 300, color: "#e8dcc8" },
  editInput: { background: "#151412", border: "1px solid #3a3530", color: "#e8dcc8", padding: "10px 12px", fontFamily: "'Jost', sans-serif", fontSize: "14px", width: "100%", boxSizing: "border-box", transition: "border-color 0.2s", outline: "none" },
  sectionTitle: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", color: "#4a3f32", textTransform: "uppercase", margin: "0 0 16px" },
  securityCard: { border: "1px solid #1e1a16", padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  securityBtn: { background: "transparent", border: "1px solid #2a2520", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "1px", padding: "8px 16px" },
  emptyState: { padding: "60px 40px", textAlign: "center", border: "1px solid #1e1a16" },
  tableRow: { display: "grid", gridTemplateColumns: "1.2fr 0.8fr 1fr 1fr 0.8fr", gap: "16px", padding: "14px 20px", alignItems: "center" },
  tableHead: { fontFamily: "'Jost', sans-serif", fontSize: "9px", letterSpacing: "2px", color: "#4a3f32", textTransform: "uppercase" },
  tableCell: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#8a7a68" },
};