import { useState } from "react";

const branches = [
  { city: "Manila", location: "Ayala Ave, Makati", phone: "02-8123-4567", email: "manila@grandvelour.com", tag: "Flagship" },
  { city: "Cebu", location: "Colon St, Cebu City", phone: "032-234-5678", email: "cebu@grandvelour.com", tag: "Heritage Wing" },
  { city: "BGC", location: "9th Ave, Bonifacio Global City", phone: "02-8765-4321", email: "bgc@grandvelour.com", tag: "Urban Luxe" },
  { city: "Iloilo", location: "Iznart St, Iloilo City", phone: "033-321-9876", email: "iloilo@grandvelour.com", tag: "Cultural Hub" },
  { city: "Cagayan de Oro", location: "Corrales Ave, CDO", phone: "088-857-4321", email: "cdo@grandvelour.com", tag: "Nature Retreat" },
  { city: "Davao", location: "JP Laurel Ave, Davao City", phone: "082-224-5678", email: "davao@grandvelour.com", tag: "Garden Estate" },
];

const services = [
  { icon: "🍽️", title: "Fine Dining", desc: "Three signature restaurants helmed by award-winning chefs, offering a journey through Filipino and international gastronomy." },
  { icon: "💆", title: "Spa & Wellness", desc: "A sanctuary of calm featuring holistic treatments, private suites, and tailored therapy programs for body and mind." },
  { icon: "🏊", title: "Rooftop Pool", desc: "Infinity pools at each property, open sunrise to midnight, with poolside cocktails and panoramic skyline views." },
  { icon: "🎭", title: "Events & Banquets", desc: "Grand ballrooms and intimate event spaces for weddings, galas, conferences, and bespoke private gatherings." },
  { icon: "🚘", title: "Concierge & Valet", desc: "A dedicated concierge team available 24/7 — from city tours to private transfers, we handle every detail." },
  { icon: "🌐", title: "Business Lounge", desc: "State-of-the-art business centers and private lounges equipped for executive meetings and corporate retreats." },
];

const gallery = [
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", label: "Signature Suite" },
  { src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80", label: "Spa Retreat" },
  { src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", label: "Infinity Pool" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80", label: "Fine Dining" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", label: "Presidential Suite" },
  { src: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80", label: "Junior Suite" },
];

const milestones = [
  { year: "1998", event: "Grand Velour founded in Manila — a single boutique hotel with 42 rooms." },
  { year: "2004", event: "Cebu branch opens, marking the brand's first expansion outside the capital." },
  { year: "2011", event: "Awarded Best Luxury Hotel by the Philippine Tourism Authority for three consecutive years." },
  { year: "2017", event: "BGC flagship opens, redefining urban luxury in the city's most dynamic district." },
  { year: "2021", event: "Iloilo and Cagayan de Oro branches launch simultaneously, bringing the brand to the Visayas and Mindanao." },
  { year: "2024", event: "Davao branch opens. Grand Velour now operates 6 properties across the Philippines." },
];

export default function AboutPage({ navigate }) {
  const [activeTab, setActiveTab] = useState("story");

  return (
    <div style={styles.page}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet" />

      {/* Nav */}
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <button style={styles.bookNavBtn} onClick={() => navigate("book")}>Reserve a Room</button>
      </nav>

      {/* Hero Banner */}
      <div style={styles.heroBanner}>
        <div style={styles.heroOverlay} />
        <img
          src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=1400&q=80"
          alt="Grand Velour"
          style={styles.heroImg}
        />
        <div style={styles.heroText}>
          <p style={styles.heroEyebrow}>ESTABLISHED 1998 · PHILIPPINES</p>
          <h1 style={styles.heroTitle}>About<br /><em>Grand Velour</em></h1>
          <p style={styles.heroTagline}>Where every stay becomes a memory worth keeping.</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabBar}>
        {[
          { key: "story", label: "Our Story" },
          { key: "vision", label: "Vision & Mission" },
          { key: "services", label: "Services" },
          { key: "branches", label: "Our Branches" },
          { key: "gallery", label: "Gallery" },
        ].map(t => (
          <button
            key={t.key}
            style={{ ...styles.tabBtn, ...(activeTab === t.key ? styles.tabActive : {}) }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={styles.content}>

        {/* OUR STORY */}
        {activeTab === "story" && (
          <div style={styles.section}>
            <div style={styles.storyGrid}>
              <div style={styles.storyText}>
                <p style={styles.eyebrow}>OUR STORY</p>
                <h2 style={styles.sectionTitle}>Born from a passion<br /><em>for genuine hospitality</em></h2>
                <p style={styles.bodyText}>
                  Grand Velour was born in 1998 in the heart of Makati — a small, meticulously designed boutique hotel 
                  that dared to reimagine what Philippine hospitality could look like. Our founders believed that true 
                  luxury isn't measured by the number of chandeliers, but by the warmth of a greeting, the 
                  thoughtfulness of a turn-down, the perfect cup of coffee at sunrise.
                </p>
                <p style={styles.bodyText}>
                  Over two and a half decades, Grand Velour grew from a 42-room property into a six-branch 
                  collection spanning Luzon, Visayas, and Mindanao. Yet at every step, we've held on to what 
                  makes us different: an obsessive attention to detail, a deep respect for Filipino heritage, 
                  and an unwavering commitment to making every guest feel at home.
                </p>
                <p style={styles.bodyText}>
                  Today, Grand Velour stands as one of the Philippines' most distinguished homegrown hotel 
                  brands — and we're just getting started.
                </p>
              </div>
              <div style={styles.timelineWrap}>
                <p style={styles.eyebrow}>MILESTONES</p>
                {milestones.map((m, i) => (
                  <div key={i} style={styles.milestone}>
                    <div style={styles.milestoneYear}>{m.year}</div>
                    <div style={styles.milestoneLine} />
                    <div style={styles.milestoneText}>{m.event}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISION & MISSION */}
        {activeTab === "vision" && (
          <div style={styles.section}>
            <div style={styles.vmGrid}>
              <div style={styles.vmCard}>
                <div style={styles.vmIcon}>◈</div>
                <p style={styles.vmEyebrow}>OUR VISION</p>
                <h3 style={styles.vmTitle}>To be the most beloved luxury hotel brand in Southeast Asia</h3>
                <p style={styles.vmBody}>
                  We envision a future where Grand Velour is synonymous with refined Filipino hospitality — 
                  a brand celebrated across the region for its cultural authenticity, design excellence, 
                  and the deeply personal connections we create with every guest who walks through our doors.
                </p>
              </div>
              <div style={styles.vmCard}>
                <div style={styles.vmIcon}>✦</div>
                <p style={styles.vmEyebrow}>OUR MISSION</p>
                <h3 style={styles.vmTitle}>To craft stays that guests carry with them long after checkout</h3>
                <p style={styles.vmBody}>
                  Our mission is to deliver hospitality experiences that combine world-class standards with 
                  genuine human warmth. We strive to hire, train, and empower the best people in the 
                  industry — because behind every perfect stay is a team that genuinely cares.
                </p>
              </div>
            </div>

            {/* Core Values */}
            <div style={styles.valuesSection}>
              <p style={{ ...styles.eyebrow, textAlign: "center" }}>CORE VALUES</p>
              <h2 style={{ ...styles.sectionTitle, textAlign: "center" }}>What we stand for</h2>
              <div style={styles.valuesGrid}>
                {[
                  { icon: "🤝", title: "Genuine Warmth", desc: "Hospitality isn't a script — it's a feeling. We train our team to lead with sincerity, always." },
                  { icon: "🏛️", title: "Cultural Pride", desc: "We celebrate Filipino heritage through our design, cuisine, and the way we welcome our guests." },
                  { icon: "⭐", title: "Excellence", desc: "We hold ourselves to the highest standards in every detail, from room cleanliness to a bedside flower." },
                  { icon: "🌿", title: "Sustainability", desc: "We reduce our environmental footprint through responsible sourcing, energy efficiency, and community programs." },
                  { icon: "🔒", title: "Trust & Integrity", desc: "Our guests trust us with their comfort and safety. We honor that trust with transparency and consistency." },
                  { icon: "💡", title: "Innovation", desc: "We continuously evolve — embracing new ideas, technologies, and approaches to serve guests better." },
                ].map((v, i) => (
                  <div key={i} style={styles.valueCard}>
                    <span style={styles.valueIcon}>{v.icon}</span>
                    <h4 style={styles.valueTitle}>{v.title}</h4>
                    <p style={styles.valueDesc}>{v.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SERVICES */}
        {activeTab === "services" && (
          <div style={styles.section}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={styles.eyebrow}>WHAT WE OFFER</p>
              <h2 style={styles.sectionTitle}>Crafted for <em>extraordinary stays</em></h2>
              <p style={{ ...styles.bodyText, maxWidth: "560px", margin: "0 auto", textAlign: "center" }}>
                Every Grand Velour property is equipped with a suite of world-class services — 
                because a hotel should be more than a place to sleep.
              </p>
            </div>
            <div style={styles.servicesGrid}>
              {services.map((s, i) => (
                <div key={i} style={styles.serviceCard}>
                  <span style={styles.serviceIcon}>{s.icon}</span>
                  <h3 style={styles.serviceTitle}>{s.title}</h3>
                  <p style={styles.serviceDesc}>{s.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={styles.servicesCTA}>
              <p style={styles.eyebrow}>READY TO EXPERIENCE IT?</p>
              <h3 style={{ fontSize: "32px", fontWeight: 300, color: "#e8dcc8", margin: "0 0 24px" }}>Your perfect stay is one click away</h3>
              <button style={styles.bookBtn} onClick={() => navigate("book")}>Reserve a Room →</button>
            </div>
          </div>
        )}

        {/* BRANCHES */}
        {activeTab === "branches" && (
          <div style={styles.section}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={styles.eyebrow}>WHERE TO FIND US</p>
              <h2 style={styles.sectionTitle}>Six cities. <em>One standard of excellence.</em></h2>
              <p style={{ ...styles.bodyText, maxWidth: "520px", margin: "0 auto", textAlign: "center" }}>
                From the bustle of Makati to the shores of Davao — Grand Velour is waiting for you across the Philippines.
              </p>
            </div>
            <div style={styles.branchesGrid}>
              {branches.map((b, i) => (
                <div key={i} style={styles.branchCard}>
                  <div style={styles.branchTag}>{b.tag}</div>
                  <h3 style={styles.branchCity}>Grand Velour {b.city}</h3>
                  <p style={styles.branchDetail}>📍 {b.location}</p>
                  <p style={styles.branchDetail}>📞 {b.phone}</p>
                  <p style={styles.branchDetail}>✉️ {b.email}</p>
                  <button style={styles.branchBtn} onClick={() => navigate("book")}>Book This Branch →</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === "gallery" && (
          <div style={styles.section}>
            <div style={{ textAlign: "center", marginBottom: "56px" }}>
              <p style={styles.eyebrow}>THROUGH OUR LENS</p>
              <h2 style={styles.sectionTitle}>A glimpse into <em>Grand Velour</em></h2>
            </div>
            <div style={styles.galleryGrid}>
              {gallery.map((g, i) => (
                <div key={i} style={styles.galleryItem}>
                  <img src={g.src} alt={g.label} style={styles.galleryImg} />
                  <div style={styles.galleryOverlay}>
                    <span style={styles.galleryLabel}>{g.label}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "64px" }}>
              <button style={styles.bookBtn} onClick={() => navigate("book")}>Reserve Your Stay →</button>
            </div>
          </div>
        )}

      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>GRAND<span style={{ color: "#c9a96e" }}>VELOUR</span></div>
        <p style={styles.footerText}>© 2024 Grand Velour Hotel Group · All Rights Reserved</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 100 },
  backBtn: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px" },
  logoAccent: { color: "#c9a96e" },
  bookNavBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },

  heroBanner: { position: "relative", height: "480px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(13,13,13,0.92) 40%, rgba(13,13,13,0.3) 100%)", zIndex: 1 },
  heroText: { position: "absolute", top: "50%", left: "60px", transform: "translateY(-50%)", zIndex: 2, maxWidth: "540px" },
  heroEyebrow: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", margin: "0 0 16px", textTransform: "uppercase" },
  heroTitle: { fontSize: "64px", fontWeight: 300, lineHeight: 1.1, margin: "0 0 16px", color: "#e8dcc8" },
  heroTagline: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68", lineHeight: 1.7 },

  tabBar: { display: "flex", borderBottom: "1px solid #1e1a16", padding: "0 60px", background: "#0d0d0d", position: "sticky", top: "73px", zIndex: 90 },
  tabBtn: { background: "none", border: "none", color: "#4a3f32", cursor: "pointer", padding: "20px 24px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", borderBottom: "2px solid transparent", marginBottom: "-1px" },
  tabActive: { color: "#c9a96e", borderBottom: "2px solid #c9a96e" },

  content: { padding: "0 60px" },
  section: { padding: "72px 0" },
  eyebrow: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 16px" },
  sectionTitle: { fontSize: "48px", fontWeight: 300, margin: "0 0 28px", lineHeight: 1.2 },
  bodyText: { fontFamily: "'Jost', sans-serif", fontSize: "15px", color: "#8a7a68", lineHeight: 1.85, margin: "0 0 20px" },

  // Story
  storyGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" },
  storyText: {},
  timelineWrap: {},
  milestone: { display: "grid", gridTemplateColumns: "56px 24px 1fr", alignItems: "start", gap: "0 0", marginBottom: "24px" },
  milestoneYear: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#c9a96e", letterSpacing: "1px", paddingTop: "2px" },
  milestoneLine: { width: "1px", background: "#2a2520", marginLeft: "12px", alignSelf: "stretch", minHeight: "40px" },
  milestoneText: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68", lineHeight: 1.7, paddingLeft: "16px" },

  // Vision/Mission
  vmGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginBottom: "80px" },
  vmCard: { padding: "56px 48px", border: "1px solid #1e1a16", background: "#111" },
  vmIcon: { fontSize: "28px", color: "#c9a96e", marginBottom: "24px", display: "block" },
  vmEyebrow: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 12px" },
  vmTitle: { fontSize: "26px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 20px", lineHeight: 1.3 },
  vmBody: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#8a7a68", lineHeight: 1.8, margin: 0 },

  valuesSection: { paddingTop: "16px" },
  valuesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", marginTop: "40px" },
  valueCard: { padding: "40px 36px", border: "1px solid #1e1a16", background: "#0d0d0d" },
  valueIcon: { fontSize: "28px", display: "block", marginBottom: "16px" },
  valueTitle: { fontSize: "20px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 12px" },
  valueDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", lineHeight: 1.7, margin: 0 },

  // Services
  servicesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", marginBottom: "72px" },
  serviceCard: { padding: "40px 36px", border: "1px solid #1e1a16", background: "#111" },
  serviceIcon: { fontSize: "32px", display: "block", marginBottom: "16px" },
  serviceTitle: { fontSize: "22px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 12px" },
  serviceDesc: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#6a5f52", lineHeight: 1.75, margin: 0 },
  servicesCTA: { textAlign: "center", padding: "56px 0", borderTop: "1px solid #1e1a16" },

  // Branches
  branchesGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  branchCard: { padding: "36px", border: "1px solid #1e1a16", background: "#111" },
  branchTag: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "2px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 12px" },
  branchCity: { fontSize: "22px", fontWeight: 400, color: "#e8dcc8", margin: "0 0 16px" },
  branchDetail: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", margin: "0 0 6px" },
  branchBtn: { background: "none", border: "none", color: "#c9a96e", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", cursor: "pointer", padding: "0", marginTop: "20px", display: "block" },

  // Gallery
  galleryGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px" },
  galleryItem: { position: "relative", height: "260px", overflow: "hidden", cursor: "pointer" },
  galleryImg: { width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.5s" },
  galleryOverlay: { position: "absolute", inset: 0, background: "rgba(13,13,13,0.4)", display: "flex", alignItems: "flex-end", padding: "20px" },
  galleryLabel: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", color: "#e8dcc8", textTransform: "uppercase" },

  bookBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px 40px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },

  footer: { padding: "48px 60px", textAlign: "center", borderTop: "1px solid #1e1a16" },
  footerLogo: { fontSize: "18px", fontWeight: 600, letterSpacing: "6px", marginBottom: "12px" },
  footerText: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "2px" },
};