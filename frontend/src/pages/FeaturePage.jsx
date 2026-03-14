import { useState, useEffect } from "react";

const featureData = {
  "Fine Dining": {
    subtitle: "A Culinary Journey",
    description: "Experience world-class cuisine crafted by our Michelin-starred chefs. Our restaurant offers an extensive menu featuring local and international dishes, paired with a curated wine selection. Every dish is a masterpiece, prepared with the finest seasonal ingredients sourced from local farms and international markets.",
    longDesc: "Our dining experience is more than just a meal — it's an event. From the ambient lighting to the carefully curated playlist, every detail is designed to elevate your evening. Whether you're celebrating a special occasion or simply indulging in a night out, our team ensures an unforgettable experience.",
    hours: "Daily: 6:00 AM – 11:00 PM",
    location: "Ground Floor, Main Building",
    rates: [
      { label: "Breakfast Buffet", price: "₱850/person" },
      { label: "Lunch Set Menu", price: "₱1,200/person" },
      { label: "Dinner Set Menu", price: "₱1,800/person" },
      { label: "Private Dining (min. 10 pax)", price: "₱2,500/person" },
    ],
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&q=80",
    ],
  },
  "Spa & Wellness": {
    subtitle: "Restore. Renew. Rejuvenate.",
    description: "Unwind in our luxurious spa featuring aromatherapy, hot stone massages, and holistic treatments. Our certified therapists ensure a deeply relaxing and rejuvenating experience tailored to your needs.",
    longDesc: "Our spa draws inspiration from ancient wellness traditions blended with modern techniques. From full-body massages to facial treatments, our menu is extensive. Private couple suites and wellness packages are available for a complete retreat experience.",
    hours: "Daily: 8:00 AM – 10:00 PM",
    location: "3rd Floor, Wellness Wing",
    rates: [
      { label: "60-min Swedish Massage", price: "₱1,500" },
      { label: "90-min Deep Tissue", price: "₱2,200" },
      { label: "Hot Stone Therapy", price: "₱2,800" },
      { label: "Couple's Package (2hrs)", price: "₱5,500" },
    ],
    images: [
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=900&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=900&q=80",
      "https://images.unsplash.com/photo-1583416750470-965b2707b355?w=900&q=80",
    ],
  },
  "Infinity Pool": {
    subtitle: "Sky-High Serenity",
    description: "Take a dip in our stunning rooftop infinity pool overlooking the city skyline. Open daily from 6AM to 10PM, with poolside bar service available for all guests.",
    longDesc: "Perched atop our hotel, the infinity pool offers a breathtaking 360° view of the city. Whether you prefer a morning swim at sunrise or a relaxing dip under the stars, the pool experience at Grand Velour is truly unmatched. Poolside cabanas and bar service are available throughout the day.",
    hours: "Daily: 6:00 AM – 10:00 PM",
    location: "Rooftop, 15th Floor",
    rates: [
      { label: "Hotel Guests", price: "Complimentary" },
      { label: "Day Pass (Non-guest)", price: "₱1,200/person" },
      { label: "Cabana Rental (half day)", price: "₱2,500" },
      { label: "Cabana Rental (full day)", price: "₱4,000" },
    ],
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80",
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=900&q=80",
    ],
  },
  "Valet Parking": {
    subtitle: "Seamless Arrivals",
    description: "Enjoy hassle-free parking with our professional valet service. Complimentary for all hotel guests, available 24/7 at the main entrance.",
    longDesc: "Our trained valet team ensures your vehicle is handled with the utmost care. Whether you're arriving for a one-night stay or an extended visit, we provide secure, monitored parking in our private facility. Electric vehicle charging stations are also available upon request.",
    hours: "24 Hours / 7 Days",
    location: "Main Entrance, Ground Floor",
    rates: [
      { label: "Hotel Guests", price: "Complimentary" },
      { label: "Restaurant Guests (3hrs)", price: "Free with validation" },
      { label: "Day Visitor Parking", price: "₱150/hour" },
      { label: "Overnight Parking", price: "₱500/night" },
    ],
    images: [
      "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=900&q=80",
      "https://images.unsplash.com/photo-1621929747188-0b4dc28498d2?w=900&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80",
    ],
  },
  "Gym / Fitness Center": {
    subtitle: "Train. Strengthen. Thrive.",
    description: "Stay on top of your fitness routine with our fully equipped gym. Featuring state-of-the-art cardio machines, free weights, resistance equipment, and dedicated workout zones for all fitness levels.",
    longDesc: "Our fitness center is designed to inspire and motivate. Whether you're an early morning jogger or a late-night lifter, the gym is open 24 hours to accommodate your schedule. Personal training sessions are also available upon request.",
    hours: "Open 24 Hours",
    location: "2nd Floor, East Wing",
    rates: [
      { label: "Hotel Guests", price: "Complimentary" },
      { label: "Day Pass (Non-guest)", price: "₱500/day" },
      { label: "Personal Training (1hr)", price: "₱1,500" },
      { label: "Monthly Membership", price: "₱3,500/month" },
    ],
    images: [
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=80",
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=900&q=80",
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=900&q=80",
    ],
  },
  "Bar / Lounge": {
    subtitle: "Sip. Unwind. Connect.",
    description: "Our sophisticated bar and lounge offers a curated selection of premium spirits, craft cocktails, and fine wines. Whether you're meeting friends or unwinding after a long day, the ambiance is perfect for every occasion.",
    longDesc: "The Grand Velour Bar is more than a place to drink — it's a destination. With live music on weekends, a talented mixologist team, and an extensive menu of bar bites, every visit promises a memorable experience. Private booth reservations are available.",
    hours: "Daily: 4:00 PM – 2:00 AM",
    location: "Ground Floor, Lobby Level",
    rates: [
      { label: "Cocktails", price: "₱350 – ₱650" },
      { label: "Premium Spirits", price: "₱500 – ₱1,200" },
      { label: "Wine (per glass)", price: "₱450 – ₱900" },
      { label: "Private Booth (min. spend)", price: "₱3,000" },
    ],
    images: [
      "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=900&q=80",
      "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=900&q=80",
      "https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=900&q=80",
    ],
  },
  "Conference Room": {
    subtitle: "Meet. Collaborate. Succeed.",
    description: "Our modern conference rooms are fully equipped with high-speed internet, audio-visual systems, whiteboards, and ergonomic seating — ideal for corporate meetings, seminars, training sessions, and business presentations.",
    longDesc: "With flexible room configurations and dedicated technical support, our conference facilities can accommodate small boardroom meetings to large seminars. Catering services, secretarial support, and printing facilities are available upon request.",
    hours: "Daily: 7:00 AM – 10:00 PM",
    location: "4th Floor, Business Center",
    rates: [
      { label: "Half Day (4 hrs)", price: "₱5,000" },
      { label: "Full Day (8 hrs)", price: "₱8,500" },
      { label: "With Catering (per pax)", price: "₱1,200" },
      { label: "AV Equipment Package", price: "₱2,000" },
    ],
    images: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=900&q=80",
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=900&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=900&q=80",
    ],
  },
  "Function Hall": {
    subtitle: "Celebrate Every Moment.",
    description: "Our grand function hall is the perfect venue for weddings, debuts, birthdays, corporate events, and social gatherings. With elegant interiors, customizable layouts, and a dedicated events team, we make every occasion unforgettable.",
    longDesc: "The Grand Velour Function Hall can accommodate up to 500 guests and features a state-of-the-art sound system, professional lighting rig, a bridal suite, and full catering coordination. Our events team will work closely with you to bring your vision to life.",
    hours: "By Appointment",
    location: "5th Floor, Grand Ballroom",
    rates: [
      { label: "Half Day (up to 200 pax)", price: "₱25,000" },
      { label: "Full Day (up to 500 pax)", price: "₱45,000" },
      { label: "Wedding Package", price: "From ₱80,000" },
      { label: "Corporate Event Package", price: "From ₱35,000" },
    ],
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=900&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=900&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=900&q=80",
    ],
  },
};

export default function FeaturePage({ navigate, feature, onBack }) {
  const data = featureData[feature?.title] || featureData["Fine Dining"];
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const handleBack = () => {
    if (onBack) onBack();
    else navigate("landing");
  };

  return (
    <div style={styles.page}>
      <nav style={styles.nav}>
        <button style={styles.backBtn} onClick={handleBack}>← Back</button>
        <div style={styles.logo}>GRAND<span style={styles.logoAccent}>VELOUR</span></div>
        <button style={styles.bookNavBtn} onClick={() => navigate("book")}>Reserve a Room</button>
      </nav>

      <div style={styles.heroWrap}>
        <img src={data.images[activeImg]} alt={feature?.title} style={styles.heroImg} />
        <div style={styles.heroOverlay} />
        <div style={styles.heroText}>
          <span style={styles.heroIcon}>{feature?.icon}</span>
          <p style={styles.heroSub}>{data.subtitle}</p>
          <h1 style={styles.heroTitle}>{feature?.title}</h1>
        </div>
      </div>

      <div style={styles.thumbRow}>
        {data.images.map((img, i) => (
          <div
            key={i}
            style={{ ...styles.thumb, ...(activeImg === i ? styles.thumbActive : {}) }}
            onClick={() => setActiveImg(i)}
          >
            <img src={img} alt="" style={styles.thumbImg} />
          </div>
        ))}
      </div>

      <div style={styles.content}>
        <div style={styles.left}>
          <p style={styles.sectionLabel}>ABOUT</p>
          <p style={styles.desc}>{data.description}</p>
          <p style={styles.descLong}>{data.longDesc}</p>
          <div style={styles.infoRow}>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>HOURS</p>
              <p style={styles.infoValue}>{data.hours}</p>
            </div>
            <div style={styles.infoBox}>
              <p style={styles.infoLabel}>LOCATION</p>
              <p style={styles.infoValue}>{data.location}</p>
            </div>
          </div>
        </div>
        <div style={styles.right}>
          <p style={styles.sectionLabel}>RATES</p>
          <div style={styles.ratesBox}>
            {data.rates.map((r, i) => (
              <div key={i} style={styles.rateRow}>
                <span style={styles.rateLabel}>{r.label}</span>
                <span style={styles.ratePrice}>{r.price}</span>
              </div>
            ))}
          </div>
          <button style={styles.bookBtn} onClick={() => navigate("book")}>
            Reserve a Room
          </button>
        </div>
      </div>

      <footer style={styles.footer}>
        <p style={styles.footerText}>© 2024 Grand Velour Hotel. All rights reserved.</p>
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
  heroWrap: { position: "relative", height: "520px", overflow: "hidden" },
  heroImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  heroOverlay: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.3) 60%)" },
  heroText: { position: "absolute", bottom: "48px", left: "60px" },
  heroIcon: { fontSize: "36px", display: "block", marginBottom: "12px" },
  heroSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", margin: "0 0 10px" },
  heroTitle: { fontSize: "56px", fontWeight: 300, color: "#e8dcc8", margin: 0 },
  thumbRow: { display: "flex", gap: "4px", padding: "4px 0", background: "#0a0a0a" },
  thumb: { flex: 1, height: "80px", overflow: "hidden", cursor: "pointer", opacity: 0.5, transition: "opacity 0.2s", border: "2px solid transparent" },
  thumbActive: { opacity: 1, border: "2px solid #c9a96e" },
  thumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  content: { display: "grid", gridTemplateColumns: "1fr 380px", gap: "60px", padding: "60px" },
  left: {},
  sectionLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "4px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 20px" },
  desc: { fontSize: "18px", fontWeight: 300, lineHeight: 1.8, color: "#e8dcc8", margin: "0 0 20px" },
  descLong: { fontFamily: "'Jost', sans-serif", fontSize: "14px", lineHeight: 1.9, color: "#6a5f52", margin: "0 0 40px" },
  infoRow: { display: "flex", gap: "32px" },
  infoBox: { flex: 1, padding: "24px", border: "1px solid #1e1a16", background: "#111" },
  infoLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", margin: "0 0 8px", textTransform: "uppercase" },
  infoValue: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#e8dcc8", margin: 0, lineHeight: 1.6 },
  right: {},
  ratesBox: { border: "1px solid #1e1a16", background: "#111", marginBottom: "24px", overflow: "hidden" },
  rateRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 24px", borderBottom: "1px solid #1a1612" },
  rateLabel: { fontFamily: "'Jost', sans-serif", fontSize: "13px", color: "#8a7a68" },
  ratePrice: { fontSize: "18px", fontWeight: 300, color: "#c9a96e" },
  bookBtn: { width: "100%", background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "16px", fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", cursor: "pointer", fontWeight: 500 },
  footer: { padding: "40px 60px", textAlign: "center", borderTop: "1px solid #1e1a16" },
  footerText: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "2px" },
};