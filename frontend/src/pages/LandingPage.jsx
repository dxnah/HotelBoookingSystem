import { useEffect, useRef } from "react";

const features = [
  { icon: "🍽️", title: "Fine Dining", desc: "Award-winning restaurant on-site", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" },
  { icon: "💆", title: "Spa & Wellness", desc: "Rejuvenate your mind and body", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80" },
  { icon: "🏊", title: "Infinity Pool", desc: "Rooftop pool with panoramic views", image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80" },
  { icon: "🚗", title: "Valet Parking", desc: "Complimentary for all guests", image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80" },
  { icon: "🏋️", title: "Gym / Fitness Center", desc: "State-of-the-art exercise facilities", image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80" },
  { icon: "🍸", title: "Bar / Lounge", desc: "Premium drinks and social area", image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80" },
  { icon: "💼", title: "Conference Room", desc: "For meetings and seminars", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
  { icon: "🎉", title: "Function Hall", desc: "For weddings, birthdays, and events", image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80" },
];

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let particles = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.pulse += 0.02;
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -5) p.y = canvas.height + 5;
        if (p.x < -5) p.x = canvas.width + 5;
        if (p.x > canvas.width + 5) p.x = -5;
        const op = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${op})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201, 169, 110, ${0.07 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 2 }} />
  );
}

export default function LandingPage({ navigate, onAdminClick, scrollToFeatures, isUserAuthenticated }) {

  useEffect(() => {
    if (scrollToFeatures) {
      setTimeout(() => {
        const el = document.getElementById("features");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [scrollToFeatures]);

  return (
    <div style={styles.page}>
      <style>{`
        .feature-card-hover:hover .feature-img-inner { transform: scale(1.06); }
        .feature-card-hover:hover .feature-link-inner { color: #e8dcc8; }
      `}</style>

      {/* NAVBAR */}
      <nav style={styles.nav}>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <div style={styles.navLinks}>
          {isUserAuthenticated ? (
            <>
              <button style={styles.navLink} onClick={() => navigate("about")}>About Us</button>
              <button style={styles.navLink} onClick={() => navigate("floormap")}>Floor Map</button>
              <button style={styles.navLink} onClick={() => navigate("bookings")}>My Bookings</button>
              <button style={styles.navBtn} onClick={() => navigate("userprofile")}>👤 My Account</button>
            </>
          ) : (
            // Before login: empty nav — logo lang ang makita
            null
          )}
        </div>
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroFade} />
        <ParticleCanvas />

        <div style={styles.heroContent}>
          <p style={styles.hotelName}>GRAND VELOUR</p>
          <p style={styles.heroSub}>WHERE LUXURY MEETS COMFORT</p>
          <h1 style={styles.heroTitle}>Your Perfect<br /><em>Stay Awaits</em></h1>
          <p style={styles.heroDesc}>
            Experience world-class hospitality in the heart of the city.
            Book your room today and indulge in unparalleled comfort.
          </p>

          {isUserAuthenticated ? (
            <>
              <div style={styles.heroBtns}>
                <button style={styles.heroBtn} onClick={() => navigate("book")}>Reserve a Room</button>
                <button style={styles.heroBtnOutline} onClick={() => navigate("rooms")}>Our Accommodations</button>
              </div>
              {/* Discover Our Story — after login lang */}
              <div style={styles.heroAboutWrap}>
                <button style={styles.heroAboutBtn} onClick={() => navigate("about")}>✦ Discover Our Story ✦</button>
              </div>
            </>
          ) : (
            <div style={styles.heroBtns}>
              <button style={styles.heroBtn} onClick={() => navigate("userlogin")}>Sign In</button>
            </div>
          )}
        </div>
      </section>

      {/* FEATURES */}
      <section style={styles.featuresSection} id="features">
        {features.map((f, i) => (
          <div
            key={i}
            className={isUserAuthenticated ? "feature-card-hover" : ""}
            style={{
              ...styles.featureCard,
              cursor: isUserAuthenticated ? "pointer" : "default",
              opacity: isUserAuthenticated ? 1 : 0.55,
            }}
            onClick={isUserAuthenticated ? () => navigate("feature", f) : undefined}
          >
            <div style={styles.featureImgWrap}>
              <img className="feature-img-inner" src={f.image} alt={f.title} style={styles.featureImg} />
              <div style={styles.featureImgOverlay} />
              {!isUserAuthenticated && (
                <div style={styles.lockedOverlay}>
                  <span style={{ fontSize: "26px" }}>🔒</span>
                </div>
              )}
            </div>
            <div style={styles.featureBody}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h4 style={styles.featureTitle}>{f.title}</h4>
              <p style={styles.featureDesc}>{f.desc}</p>
              {isUserAuthenticated ? (
                <span className="feature-link-inner" style={styles.featureLink}>Learn more →</span>
              ) : (
                <span style={{ fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#3a3530", letterSpacing: "2px", textTransform: "uppercase" }}>Sign in to explore</span>
              )}
            </div>
          </div>
        ))}
      </section>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Grand Velour Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: "#0d0d0d", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 60px", borderBottom: "1px solid rgba(201,169,110,0.2)", position: "sticky", top: 0, background: "rgba(13,13,13,0.85)", backdropFilter: "blur(10px)", zIndex: 100 },
  logo: { fontSize: "22px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoAccent: { color: "#c9a96e", marginLeft: "4px" },
  navLinks: { display: "flex", gap: "20px", alignItems: "center" },
  navLink: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" },
  navBtn: { background: "none", border: "1px solid #c9a96e", color: "#c9a96e", cursor: "pointer", padding: "8px 20px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" },
  hero: { position: "relative", minHeight: "calc(100vh - 73px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", overflow: "hidden", paddingBottom: "80px" },
  heroBg: {
    position: "absolute", inset: 0, zIndex: 0,
    backgroundImage: "url('https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80')",
    backgroundSize: "cover", backgroundPosition: "center",
    transform: "scale(1.03)", filter: "brightness(0.5)",
  },
  heroOverlay: { position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(13,13,13,0.65) 60%, rgba(13,13,13,0.95) 100%)" },
  heroFade: { position: "absolute", bottom: 0, left: 0, right: 0, height: "120px", zIndex: 1, background: "linear-gradient(to bottom, transparent, #0d0d0d)" },
  heroContent: { maxWidth: "700px", position: "relative", zIndex: 3, textAlign: "center", padding: "0 20px" },
  hotelName: { fontFamily: "'Cormorant Garamond', serif", fontSize: "64px", fontWeight: 300, letterSpacing: "20px", color: "#c9a96e", margin: "0 0 12px", lineHeight: 1, textTransform: "uppercase", textShadow: "0 2px 30px rgba(0,0,0,0.5)" },
  heroSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#a09070", marginBottom: "16px", textTransform: "uppercase" },
  heroTitle: { fontSize: "64px", fontWeight: 300, lineHeight: 1.1, margin: "0 0 24px", color: "#f0e8d8", textShadow: "0 2px 40px rgba(0,0,0,0.6)" },
  heroDesc: { fontFamily: "'Jost', sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#9a8a78", marginBottom: "40px" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center" },
  heroBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  heroBtnOutline: { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,169,110,0.7)", color: "#c9a96e", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", backdropFilter: "blur(4px)" },
  heroAboutWrap: { marginTop: "28px", display: "flex", justifyContent: "center" },
  heroAboutBtn: { background: "none", border: "none", color: "#7a6f62", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", padding: "8px 0", borderBottom: "1px solid #3a3530" },
  featuresSection: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #1e1a16" },
  featureCard: { overflow: "hidden", borderRight: "1px solid #1e1a16", borderBottom: "1px solid #1e1a16" },
  featureImgWrap: { position: "relative", height: "200px", overflow: "hidden" },
  featureImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s ease" },
  featureImgOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.45)" },
  lockedOverlay: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,13,13,0.5)", zIndex: 2 },
  featureBody: { padding: "28px 32px", background: "#0d0d0d" },
  featureIcon: { fontSize: "24px", display: "block", marginBottom: "12px" },
  featureTitle: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 8px" },
  featureDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: "0 0 16px", lineHeight: 1.6 },
  featureLink: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#c9a96e", letterSpacing: "2px", textTransform: "uppercase", transition: "color 0.3s" },
  footer: { padding: "40px 60px", textAlign: "center", borderTop: "1px solid #1e1a16" },
  footerText: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "2px" },
};