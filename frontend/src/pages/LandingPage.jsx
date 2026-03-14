import { useEffect } from "react";

const features = [
  {
    icon: "🍽️",
    title: "Fine Dining",
    desc: "Award-winning restaurant on-site",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
  },
  {
    icon: "💆",
    title: "Spa & Wellness",
    desc: "Rejuvenate your mind and body",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
  },
  {
    icon: "🏊",
    title: "Infinity Pool",
    desc: "Rooftop pool with panoramic views",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
  },
  {
    icon: "🚗",
    title: "Valet Parking",
    desc: "Complimentary for all guests",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
  },
  {
    icon: "🏋️",
    title: "Gym / Fitness Center",
    desc: "State-of-the-art exercise facilities",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
  },
  {
    icon: "🍸",
    title: "Bar / Lounge",
    desc: "Premium drinks and social area",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80",
  },
  {
    icon: "💼",
    title: "Conference Room",
    desc: "For meetings and seminars",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
  },
  {
    icon: "🎉",
    title: "Function Hall",
    desc: "For weddings, birthdays, and events",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
  },
];

export default function LandingPage({ navigate, onAdminClick, scrollToFeatures }) {

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
      <nav style={styles.nav}>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("about")}>About Us</button>
          <button style={styles.navLink} onClick={() => navigate("floormap")}>Floor Map</button>
          <button style={styles.navLink} onClick={() => navigate("bookings")}>My Bookings</button>
          <button style={styles.navBtn} onClick={onAdminClick || (() => navigate("admin"))}>Admin</button>
        </div>
      </nav>

      <section style={styles.hero}>
        <div style={styles.heroOverlay} />
        <div style={styles.heroContent}>
          <p style={styles.heroSub}>WHERE LUXURY MEETS COMFORT</p>
          <h1 style={styles.heroTitle}>Your Perfect<br /><em>Stay Awaits</em></h1>
          <p style={styles.heroDesc}>
            Experience world-class hospitality in the heart of the city.
            Book your room today and indulge in unparalleled comfort.
          </p>
          <div style={styles.heroBtns}>
            <button style={styles.heroBtn} onClick={() => navigate("book")}>
              Reserve a Room
            </button>
            <button style={styles.heroBtnOutline} onClick={() => navigate("rooms")}>
              Our Accommodations
            </button>
          </div>
          <div style={styles.heroAboutWrap}>
            <button style={styles.heroAboutBtn} onClick={() => navigate("about")}>
              ✦ Discover Our Story ✦
            </button>
          </div>
        </div>
      </section>

      <section style={styles.featuresSection} id="features">
        {features.map((f, i) => (
          <div key={i} style={styles.featureCard} onClick={() => navigate("feature", f)}>
            <div style={styles.featureImgWrap}>
              <img src={f.image} alt={f.title} style={styles.featureImg} />
              <div style={styles.featureImgOverlay} />
            </div>
            <div style={styles.featureBody}>
              <span style={styles.featureIcon}>{f.icon}</span>
              <h4 style={styles.featureTitle}>{f.title}</h4>
              <p style={styles.featureDesc}>{f.desc}</p>
              <span style={styles.featureLink}>Learn more →</span>
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
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 60px", borderBottom: "1px solid #2a2520", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 100 },
  logo: { fontSize: "22px", fontWeight: 600, letterSpacing: "6px", color: "#e8dcc8" },
  logoAccent: { color: "#c9a96e", marginLeft: "4px" },
  navLinks: { display: "flex", gap: "20px", alignItems: "center" },
  navLink: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px", letterSpacing: "2px", textTransform: "uppercase" },
  navBtn: { background: "none", border: "1px solid #c9a96e", color: "#c9a96e", cursor: "pointer", padding: "8px 20px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" },
  hero: { position: "relative", minHeight: "calc(100vh - 73px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0d0d0d 0%, #1a1510 50%, #0d0d0d 100%)", overflow: "hidden", paddingBottom: "80px" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.08) 0%, transparent 60%)", pointerEvents: "none" },
  heroContent: { maxWidth: "620px", position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" },
  heroSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", marginBottom: "20px" },
  heroTitle: { fontSize: "72px", fontWeight: 300, lineHeight: 1.1, margin: "0 0 24px", color: "#e8dcc8" },
  heroDesc: { fontFamily: "'Jost', sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#8a7a68", marginBottom: "40px" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center" },
  heroBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  heroBtnOutline: { background: "transparent", border: "1px solid #c9a96e", color: "#c9a96e", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer" },
  heroAboutWrap: { marginTop: "28px", display: "flex", justifyContent: "center" },
  heroAboutBtn: { background: "none", border: "none", color: "#6a5f52", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", padding: "8px 0", borderBottom: "1px solid #2a2520" },
  featuresSection: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #1e1a16", marginTop: "80px" },
  featureCard: { cursor: "pointer", overflow: "hidden", borderRight: "1px solid #1e1a16", borderBottom: "1px solid #1e1a16" },
  featureImgWrap: { position: "relative", height: "200px", overflow: "hidden" },
  featureImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.4s" },
  featureImgOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.45)" },
  featureBody: { padding: "28px 32px", background: "#0d0d0d" },
  featureIcon: { fontSize: "24px", display: "block", marginBottom: "12px" },
  featureTitle: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 8px" },
  featureDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", margin: "0 0 16px", lineHeight: 1.6 },
  featureLink: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#c9a96e", letterSpacing: "2px", textTransform: "uppercase" },
  footer: { padding: "40px 60px", textAlign: "center", borderTop: "1px solid #1e1a16" },
  footerText: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "2px" },
};