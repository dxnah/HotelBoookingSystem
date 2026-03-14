import { useState } from "react";

const features = [
  {
    icon: "🍽️",
    title: "Fine Dining",
    desc: "Award-winning restaurant on-site",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80",
    details: "Experience world-class cuisine crafted by our Michelin-starred chefs. Our restaurant offers an extensive menu featuring local and international dishes, paired with a curated wine selection.",
  },
  {
    icon: "💆",
    title: "Spa & Wellness",
    desc: "Rejuvenate your mind and body",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80",
    details: "Unwind in our luxurious spa featuring aromatherapy, hot stone massages, and holistic treatments. Our certified therapists ensure a relaxing and rejuvenating experience.",
  },
  {
    icon: "🏊",
    title: "Infinity Pool",
    desc: "Rooftop pool with panoramic views",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    details: "Take a dip in our stunning rooftop infinity pool overlooking the city skyline. Open daily from 6AM to 10PM, with poolside bar service available.",
  },
  {
    icon: "🚗",
    title: "Valet Parking",
    desc: "Complimentary for all guests",
    image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&q=80",
    details: "Enjoy hassle-free parking with our professional valet service. Complimentary for all hotel guests, available 24/7 at the main entrance.",
  },
];

export default function LandingPage({ navigate }) {
  const [selectedFeature, setSelectedFeature] = useState(null);

  return (
    <div style={styles.page}>
      {/* Nav */}
      <nav style={styles.nav}>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <div style={styles.navLinks}>
          <button style={styles.navLink} onClick={() => navigate("bookings")}>My Bookings</button>
          <button style={styles.navBtn} onClick={() => navigate("admin")}>Admin</button>
        </div>
      </nav>

      {/* Hero */}
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
        </div>
      </section>

      {/* Features */}
      <section style={styles.featuresSection}>
        {features.map((f, i) => (
          <div key={i} style={styles.featureCard} onClick={() => setSelectedFeature(f)}>
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

      {/* Footer */}
      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Grand Velour Hotel. All rights reserved.</p>
      </footer>

      {/* Modal */}
      {selectedFeature && (
        <div style={styles.modalOverlay} onClick={() => setSelectedFeature(null)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalImgWrap}>
              <img src={selectedFeature.image} alt={selectedFeature.title} style={styles.modalImg} />
              <div style={styles.modalImgOverlay} />
              <button style={styles.closeBtn} onClick={() => setSelectedFeature(null)}>✕</button>
              <div style={styles.modalImgText}>
                <span style={styles.modalIcon}>{selectedFeature.icon}</span>
                <h2 style={styles.modalTitle}>{selectedFeature.title}</h2>
              </div>
            </div>
            <div style={styles.modalBody}>
              <p style={styles.modalDesc}>{selectedFeature.details}</p>
              <button style={styles.modalBtn} onClick={() => navigate("book")}>Book Now</button>
            </div>
          </div>
        </div>
      )}
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
  hero: { position: "relative", height: "calc(100vh - 73px)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", background: "linear-gradient(135deg, #0d0d0d 0%, #1a1510 50%, #0d0d0d 100%)", overflow: "hidden", paddingBottom: "80px" },
  heroOverlay: { position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, rgba(201,169,110,0.08) 0%, transparent 60%)", pointerEvents: "none" },
  heroContent: { maxWidth: "620px", position: "relative", zIndex: 2, textAlign: "center", padding: "0 20px" },
  heroSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", marginBottom: "20px" },
  heroTitle: { fontSize: "72px", fontWeight: 300, lineHeight: 1.1, margin: "0 0 24px", color: "#e8dcc8" },
  heroDesc: { fontFamily: "'Jost', sans-serif", fontSize: "15px", lineHeight: 1.8, color: "#8a7a68", marginBottom: "40px" },
  heroBtns: { display: "flex", gap: "16px", justifyContent: "center" },
  heroBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  heroBtnOutline: { background: "transparent", border: "1px solid #c9a96e", color: "#c9a96e", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer" },
  featuresSection: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", borderTop: "1px solid #1e1a16", marginTop: "80px" },
  featureCard: { cursor: "pointer", overflow: "hidden", borderRight: "1px solid #1e1a16" },
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
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999 },
  modal: { background: "#111", border: "1px solid #2a2520", width: "520px", overflow: "hidden" },
  modalImgWrap: { position: "relative", height: "260px" },
  modalImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  modalImgOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.9) 0%, rgba(13,13,13,0.2) 100%)" },
  closeBtn: { position: "absolute", top: "16px", right: "16px", background: "rgba(0,0,0,0.5)", border: "1px solid #2a2520", color: "#e8dcc8", cursor: "pointer", width: "32px", height: "32px", fontSize: "14px" },
  modalImgText: { position: "absolute", bottom: "20px", left: "32px" },
  modalIcon: { fontSize: "28px", display: "block", marginBottom: "8px" },
  modalTitle: { fontSize: "32px", fontWeight: 300, color: "#e8dcc8", margin: 0 },
  modalBody: { padding: "28px 32px" },
  modalDesc: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68", lineHeight: 1.8, margin: "0 0 24px" },
  modalBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "12px 32px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
};