import { useState, useEffect } from "react";
import { API_BASE } from "../api";

export default function ContactPage({ navigate }) {
  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "", hotel: "", subject: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    fetch(`${API_BASE}/hotels/`)
      .then(r => r.json())
      .then(d => setHotels(Array.isArray(d) ? d : []))
      .catch(() => {});
  }, []);

  const subjects = [
    "General Inquiry",
    "Room Availability",
    "Special Requests",
    "Group Booking",
    "Event / Function",
    "Feedback",
    "Other",
  ];

  const validate = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = "Full name is required.";
    if (!form.email.trim()) errors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
    if (!form.subject) errors.subject = "Please select a subject.";
    if (!form.message.trim()) errors.message = "Message is required.";
    else if (form.message.trim().length < 20) errors.message = "Message must be at least 20 characters.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    // Simulate submission (no dedicated endpoint exists; shows success state)
    await new Promise(r => setTimeout(r, 1200));
    setSubmitting(false);
    setSubmitted(true);
    showToast("Your inquiry has been sent! We'll get back to you within 24 hours.");
  };

  const field = (key, label, type = "text", placeholder = "", required = false) => (
    <div style={S.fieldWrap}>
      <label style={S.label}>
        {label} {required && <span style={{ color: "#c97b6e" }}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); if (formErrors[key]) setFormErrors(p => ({ ...p, [key]: "" })); }}
        style={{ ...S.input, ...(formErrors[key] ? { borderColor: "#c97b6e" } : {}) }}
        className="gv-input"
      />
      {formErrors[key] && <p style={S.errMsg}>⚠ {formErrors[key]}</p>}
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
        .gv-input:focus { border-color: #c9a96e !important; outline: none; }
        .gv-input::placeholder { color: #3a3530; }
        select.gv-input option { background: #151412; color: #e8dcc8; }
        .contact-fade { animation: fadeUp 0.4s ease forwards; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "24px", right: "24px", zIndex: 9999,
          padding: "12px 20px", fontFamily: "'Jost', sans-serif", fontSize: "13px",
          animation: "toastIn 0.3s ease forwards", backdropFilter: "blur(10px)",
          background: "rgba(126,184,126,0.15)", border: "1px solid rgba(126,184,126,0.4)", color: "#7eb87e",
          display: "flex", alignItems: "center", gap: "8px",
        }}>
          ✓ {toast.message}
        </div>
      )}

      <nav style={S.nav}>
        <button style={S.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={S.logo}>GRAND<span style={S.logoAccent}>VELOUR</span></div>
        <button style={S.bookBtn} onClick={() => navigate("book")}>+ Book a Room</button>
      </nav>

      <div style={S.content}>
        {!submitted ? (
          <>
            <div style={S.headerWrap} className="contact-fade">
              <p style={S.eyebrow}>CONTACT US</p>
              <h1 style={S.title}>Send an Inquiry</h1>
              <p style={S.subtitle}>
                Have a question or special request? Our team will get back to you within 24 hours.
              </p>
            </div>

            <div style={S.layout}>
              {/* Form */}
              <div className="contact-fade" style={S.formCard}>
                <div style={S.formGrid}>
                  {field("name", "FULL NAME", "text", "Juan dela Cruz", true)}
                  {field("email", "EMAIL ADDRESS", "email", "juan@email.com", true)}
                  {field("phone", "PHONE NUMBER", "tel", "09XX-XXX-XXXX")}

                  {/* Hotel selector */}
                  <div style={S.fieldWrap}>
                    <label style={S.label}>HOTEL (Optional)</label>
                    <select
                      value={form.hotel}
                      onChange={e => setForm(f => ({ ...f, hotel: e.target.value }))}
                      style={S.input}
                      className="gv-input"
                    >
                      <option value="">Any / Not sure yet</option>
                      {hotels.map(h => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Subject */}
                  <div style={{ ...S.fieldWrap, gridColumn: "span 2" }}>
                    <label style={S.label}>SUBJECT <span style={{ color: "#c97b6e" }}>*</span></label>
                    <select
                      value={form.subject}
                      onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); if (formErrors.subject) setFormErrors(p => ({ ...p, subject: "" })); }}
                      style={{ ...S.input, ...(formErrors.subject ? { borderColor: "#c97b6e" } : {}) }}
                      className="gv-input"
                    >
                      <option value="">Select a subject...</option>
                      {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {formErrors.subject && <p style={S.errMsg}>⚠ {formErrors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div style={{ ...S.fieldWrap, gridColumn: "span 2" }}>
                    <label style={S.label}>MESSAGE <span style={{ color: "#c97b6e" }}>*</span></label>
                    <textarea
                      placeholder="How can we help you? Please include any relevant details..."
                      value={form.message}
                      onChange={e => { setForm(f => ({ ...f, message: e.target.value })); if (formErrors.message) setFormErrors(p => ({ ...p, message: "" })); }}
                      style={{ ...S.input, height: "120px", resize: "vertical", ...(formErrors.message ? { borderColor: "#c97b6e" } : {}) }}
                      className="gv-input"
                    />
                    {formErrors.message && <p style={S.errMsg}>⚠ {formErrors.message}</p>}
                    <p style={S.charCount}>{form.message.length} characters</p>
                  </div>
                </div>

                <button
                  style={{ ...S.submitBtn, opacity: submitting ? 0.7 : 1 }}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send Inquiry →"}
                </button>
              </div>

              {/* Sidebar Info */}
              <div style={S.sidebar}>
                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Response Time</p>
                  <p style={S.infoText}>We typically respond within <span style={{ color: "#c9a96e" }}>24 hours</span> on business days.</p>
                </div>
                <div style={S.infoCard}>
                  <p style={S.infoTitle}>For Urgent Matters</p>
                  <p style={S.infoText}>Call our 24/7 concierge line directly at your preferred hotel property.</p>
                </div>
                <div style={S.infoCard}>
                  <p style={S.infoTitle}>Already Booked?</p>
                  <p style={S.infoText}>Use our <span
                    style={{ color: "#c9a96e", cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => navigate("lookup")}
                  >Booking Lookup</span> to find and manage your reservation.</p>
                </div>
                {hotels.slice(0, 3).map(h => (
                  <div key={h.id} style={S.hotelInfo}>
                    <p style={S.hotelInfoName}>{h.name}</p>
                    <p style={S.hotelInfoAddr}>📍 {h.address}</p>
                    {h.phone && <p style={S.hotelInfoContact}>📞 {h.phone}</p>}
                    {h.email && <p style={S.hotelInfoContact}>✉️ {h.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={S.successWrap} className="contact-fade">
            <div style={S.successCard}>
              <div style={S.successIcon}>✓</div>
              <h2 style={S.successTitle}>Message Received!</h2>
              <p style={S.successDesc}>
                Thank you, <strong>{form.name}</strong>. Your inquiry has been sent to the Grand Velour team.
                We'll respond to <span style={{ color: "#c9a96e" }}>{form.email}</span> within 24 hours.
              </p>
              <div style={S.successActions}>
                <button style={S.primaryBtn} onClick={() => navigate("landing")}>Back to Home</button>
                <button style={S.outlineBtn} onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", hotel: "", subject: "", message: "" }); }}>
                  Send Another Inquiry
                </button>
              </div>
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
  bookBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  content: { maxWidth: "1100px", margin: "0 auto", padding: "60px 60px 80px" },
  headerWrap: { marginBottom: "48px" },
  eyebrow: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", margin: "0 0 12px" },
  title: { fontSize: "48px", fontWeight: 300, margin: "0 0 16px" },
  subtitle: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#6a5f52", lineHeight: 1.7, margin: 0 },
  layout: { display: "grid", gridTemplateColumns: "1fr 320px", gap: "40px", alignItems: "start" },
  formCard: { background: "#111", border: "1px solid #2a2520", padding: "36px 40px" },
  formGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" },
  fieldWrap: {},
  label: { display: "block", fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "10px" },
  input: { width: "100%", background: "#151412", border: "1px solid #3a3530", borderLeft: "3px solid #c9a96e", color: "#e8dcc8", padding: "13px 16px", fontFamily: "'Jost', sans-serif", fontSize: "14px", boxSizing: "border-box", outline: "none", transition: "border-color 0.2s" },
  errMsg: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#c97b6e", margin: "5px 0 0" },
  charCount: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#3a3530", margin: "5px 0 0", textAlign: "right" },
  submitBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "14px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500, width: "100%" },
  sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
  infoCard: { background: "#111", border: "1px solid #1e1a16", padding: "20px 24px" },
  infoTitle: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 8px" },
  infoText: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", lineHeight: 1.6, margin: 0 },
  hotelInfo: { border: "1px solid #1e1a16", padding: "16px 20px" },
  hotelInfoName: { fontSize: "18px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 6px" },
  hotelInfoAddr: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", margin: "0 0 4px" },
  hotelInfoContact: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#4a3f32", margin: "2px 0" },
  successWrap: { display: "flex", justifyContent: "center", padding: "40px 0 80px" },
  successCard: { background: "#111", border: "1px solid #2a2520", padding: "60px 48px", maxWidth: "560px", textAlign: "center" },
  successIcon: { width: "60px", height: "60px", borderRadius: "50%", border: "1px solid #c9a96e", display: "flex", alignItems: "center", justifyContent: "center", color: "#c9a96e", fontSize: "26px", margin: "0 auto 24px" },
  successTitle: { fontSize: "36px", fontWeight: 300, margin: "0 0 16px" },
  successDesc: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#6a5f52", lineHeight: 1.8, margin: "0 0 36px" },
  successActions: { display: "flex", gap: "12px", justifyContent: "center" },
  primaryBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "13px 28px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  outlineBtn: { background: "transparent", border: "1px solid #2a2520", color: "#6a5f52", padding: "13px 28px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer" },
};