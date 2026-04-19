import { useState } from "react";

export default function UserLogin({ navigate, onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "", password: "", confirmPassword: "",
    first_name: "", last_name: "", email: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 600);
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) {
      setError("Please enter both username and password.");
      triggerShake(); return;
    }
    setLoading(true); setError("");
    try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/user/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.username, password: form.password }),
    });
    const data = await res.json();
    if (res.ok && data.access) {
      sessionStorage.setItem("userToken", data.access);
      sessionStorage.setItem("userData", JSON.stringify(data.user));
      showToast("Welcome back! Signing you in...");
      setTimeout(() => { onLoginSuccess(); navigate("userprofile"); }, 800);
    } else {
      setError(data.error || "Invalid credentials. Please try again.");
      triggerShake();
    }
    } catch {
      setError("Cannot connect to server. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!form.username || !form.password || !form.email) {
      setError("Username, email, and password are required."); triggerShake(); return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match."); triggerShake(); return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters."); triggerShake(); return;
    }
    setLoading(true); setError("");
    try {
    const res = await fetch("http://127.0.0.1:8000/api/v1/user/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        password: form.password,
        first_name: form.first_name,
        last_name: form.last_name,
      }),
    });
    const data = await res.json();
    if (res.ok && data.access) {
      sessionStorage.setItem("userToken", data.access);
      sessionStorage.setItem("userData", JSON.stringify(data.user));

      const fullName = [form.first_name, form.last_name].filter(Boolean).join(" ") || "Guest";
      await fetch("http://127.0.0.1:8000/api/v1/clients/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName,
          email: form.email,
          phone: "",
        }),
      });

      showToast("Account created! Redirecting...");
      setTimeout(() => { onLoginSuccess(); navigate("userprofile"); }, 800);
    } else {
      const msgs = Object.values(data).flat();
      setError(msgs[0] || "Registration failed.");
      triggerShake();
    }
    } catch {
      setError("Cannot connect to server. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = "text", placeholder = "") => (
    <div style={S.fieldWrap}>
      <label style={S.label}>{label}</label>
      <input
        type={type}
        value={form[key]}
        placeholder={placeholder}
        onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setError(""); }}
        onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleRegister())}
        style={S.input}
        className="gv-input"
        autoComplete={type === "password" ? "current-password" : key}
      />
    </div>
  );

  return (
    <div style={S.page}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 15%{transform:translateX(-8px)} 30%{transform:translateX(8px)}
          45%{transform:translateX(-6px)} 60%{transform:translateX(6px)} 75%{transform:translateX(-3px)} 90%{transform:translateX(3px)}
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .user-card { animation: fadeSlideIn 0.5s ease forwards; }
        .shake { animation: shake 0.55s ease; }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 100px #111 inset !important;
          -webkit-text-fill-color: #e8dcc8 !important;
        }
        .gv-input:focus { border-color: #c9a96e !important; outline: none; }
        .mode-tab { transition: all 0.2s; }
        .mode-tab:hover { color: #e8dcc8 !important; }
        .gv-toast { animation: toastIn 0.3s ease forwards; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div className="gv-toast" style={{
          ...S.toast,
          background: toast.type === "success" ? "rgba(126,184,126,0.15)" : "rgba(201,123,110,0.15)",
          border: `1px solid ${toast.type === "success" ? "rgba(126,184,126,0.4)" : "rgba(201,123,110,0.4)"}`,
          color: toast.type === "success" ? "#7eb87e" : "#c97b6e",
        }}>
          <span style={{ marginRight: "8px" }}>{toast.type === "success" ? "✓" : "⚠"}</span>
          {toast.message}
        </div>
      )}

      <div style={S.glow} />

      <button style={S.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>

      <div className={`user-card ${shake ? "shake" : ""}`} style={S.card}>
        <div style={S.logoWrap}>
          <div style={S.logoLine} />
          <div style={S.logo}>GRAND<span style={S.logoGold}>VELOUR</span></div>
          <p style={S.logoSub}>Guest Portal</p>
          <div style={S.logoLine} />
        </div>

        <div style={S.tabs}>
          <button
            className="mode-tab"
            style={{ ...S.tab, ...(mode === "login" ? S.tabActive : S.tabInactive) }}
            onClick={() => { setMode("login"); setError(""); }}
          >Sign In</button>
          <button
            className="mode-tab"
            style={{ ...S.tab, ...(mode === "register" ? S.tabActive : S.tabInactive) }}
            onClick={() => { setMode("register"); setError(""); }}
          >Create Account</button>
        </div>

        {error && (
          <div style={S.errorBox}>
            <span style={{ marginRight: "8px" }}>⚠</span>{error}
          </div>
        )}

        {mode === "login" ? (
          <>
            {field("username", "USERNAME", "text", "your_username")}
            {field("password", "PASSWORD", "password", "••••••••")}
            <button
              style={{ ...S.primaryBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In →"}
            </button>
            <p style={S.hint}>Don't have an account?{" "}
              <span style={S.switchLink} onClick={() => { setMode("register"); setError(""); }}>
                Create one
              </span>
            </p>
          </>
        ) : (
          <>
            <div style={S.twoCol}>
              <div>
                <label style={S.label}>FIRST NAME</label>
                <input type="text" value={form.first_name} placeholder="Juan"
                  onChange={e => { setForm(f => ({ ...f, first_name: e.target.value })); setError(""); }}
                  style={S.input} className="gv-input" />
              </div>
              <div>
                <label style={S.label}>LAST NAME</label>
                <input type="text" value={form.last_name} placeholder="dela Cruz"
                  onChange={e => { setForm(f => ({ ...f, last_name: e.target.value })); setError(""); }}
                  style={S.input} className="gv-input" />
              </div>
            </div>
            {field("username", "USERNAME *", "text", "your_username")}
            {field("email", "EMAIL ADDRESS *", "email", "juan@email.com")}
            {field("password", "PASSWORD *", "password", "Min. 8 characters")}
            {field("confirmPassword", "CONFIRM PASSWORD *", "password", "Repeat password")}
            <button
              style={{ ...S.primaryBtn, opacity: loading ? 0.7 : 1 }}
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account →"}
            </button>
            <p style={S.hint}>Already have an account?{" "}
              <span style={S.switchLink} onClick={() => { setMode("login"); setError(""); }}>
                Sign in
              </span>
            </p>
          </>
        )}
      </div>

      <p style={S.footer}>© 2024 Grand Velour Hotels & Resorts</p>
    </div>
  );
}

const S = {
  page: {
    background: "#0d0d0d", minHeight: "100vh", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif",
    position: "relative", overflow: "hidden", padding: "40px 20px",
  },
  glow: {
    position: "absolute", top: "30%", left: "50%", transform: "translate(-50%,-50%)",
    width: "600px", height: "400px",
    background: "radial-gradient(ellipse, rgba(201,169,110,0.07) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  toast: {
    position: "fixed", top: "24px", right: "24px", zIndex: 9999,
    padding: "12px 20px", fontFamily: "'Jost', sans-serif", fontSize: "13px",
    letterSpacing: "0.5px", display: "flex", alignItems: "center",
    backdropFilter: "blur(10px)", minWidth: "260px",
  },
  backBtn: {
    position: "absolute", top: "24px", left: "32px",
    background: "rgba(201,169,110,0.07)", border: "1px solid rgba(201,169,110,0.2)",
    color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif",
    fontSize: "12px", letterSpacing: "1px", padding: "8px 16px",
  },
  card: {
    background: "#111", border: "1px solid #2a2520", width: "100%", maxWidth: "460px",
    padding: "44px 44px 36px", position: "relative", zIndex: 1,
  },
  logoWrap: { textAlign: "center", marginBottom: "28px" },
  logoLine: { height: "1px", background: "linear-gradient(90deg, transparent, #c9a96e, transparent)", margin: "10px 0" },
  logo: { fontSize: "22px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8", marginBottom: "4px" },
  logoGold: { color: "#c9a96e" },
  logoSub: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#4a3f32", textTransform: "uppercase", margin: "4px 0" },
  tabs: { display: "flex", marginBottom: "24px", borderBottom: "1px solid #2a2520" },
  tab: { flex: 1, background: "none", border: "none", cursor: "pointer", padding: "10px 0", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase" },
  tabActive: { color: "#c9a96e", borderBottom: "2px solid #c9a96e", marginBottom: "-1px" },
  tabInactive: { color: "#4a3f32" },
  errorBox: {
    background: "rgba(201,123,110,0.1)", border: "1px solid rgba(201,123,110,0.3)",
    color: "#c97b6e", fontFamily: "'Jost', sans-serif", fontSize: "12px",
    padding: "10px 14px", marginBottom: "20px", display: "flex", alignItems: "center",
  },
  fieldWrap: { marginBottom: "18px" },
  label: { display: "block", fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#6a5f52", textTransform: "uppercase", marginBottom: "8px" },
  input: {
    width: "100%", background: "#151412", border: "1px solid #2a2520", color: "#e8dcc8",
    padding: "12px 16px", fontFamily: "'Jost', sans-serif", fontSize: "14px",
    boxSizing: "border-box", outline: "none", transition: "border-color 0.2s",
  },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "18px" },
  primaryBtn: {
    width: "100%", background: "#c9a96e", border: "none", color: "#0d0d0d",
    padding: "14px", fontFamily: "'Jost', sans-serif", fontSize: "12px",
    letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500,
    marginTop: "8px", marginBottom: "20px",
  },
  hint: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", textAlign: "center", letterSpacing: "0.5px" },
  switchLink: { color: "#c9a96e", cursor: "pointer", textDecoration: "underline" },
  footer: { position: "absolute", bottom: "24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#2a2520", letterSpacing: "2px" },
};