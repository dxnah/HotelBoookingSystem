import { useState } from "react";

const floors = {
  "Ground": {
    label: "Ground Floor — Lobby & Services",
    width: 800,
    height: 500,
    rooms: [
      // Outer walls
      { type: "wall", x: 20, y: 20, w: 760, h: 460, fill: "none", stroke: "#c9a96e", strokeW: 2 },
      // Main Lobby
      { type: "room", x: 30, y: 30, w: 280, h: 180, fill: "#1a1a12", stroke: "#c9a96e", strokeW: 1.5, label: "Main Lobby", icon: "🏛️", color: "#c9a96e" },
      // Reception
      { type: "room", x: 320, y: 30, w: 160, h: 100, fill: "#1a1a12", stroke: "#c9a96e", strokeW: 1, label: "Reception", icon: "💁", color: "#c9a96e" },
      // Concierge
      { type: "room", x: 490, y: 30, w: 140, h: 100, fill: "#1a1a12", stroke: "#8a7a68", strokeW: 1, label: "Concierge", icon: "🗝️", color: "#8a7a68" },
      // Fine Dining
      { type: "room", x: 30, y: 220, w: 220, h: 150, fill: "#1a1210", stroke: "#c9a96e", strokeW: 1.5, label: "Fine Dining", icon: "🍽️", color: "#c9a96e" },
      // Bar / Lounge
      { type: "room", x: 260, y: 220, w: 160, h: 150, fill: "#1a1210", stroke: "#6a9fb5", strokeW: 1, label: "Bar / Lounge", icon: "🍸", color: "#6a9fb5" },
      // Restrooms
      { type: "room", x: 430, y: 220, w: 80, h: 70, fill: "#111", stroke: "#4a4a4a", strokeW: 1, label: "WC ♂", icon: "", color: "#6a5f52" },
      { type: "room", x: 430, y: 300, w: 80, h: 70, fill: "#111", stroke: "#4a4a4a", strokeW: 1, label: "WC ♀", icon: "", color: "#6a5f52" },
      // Valet / Entrance
      { type: "room", x: 520, y: 220, w: 120, h: 150, fill: "#101510", stroke: "#7eb87e", strokeW: 1, label: "Valet / Entrance", icon: "🚗", color: "#7eb87e" },
      // Gift Shop
      { type: "room", x: 650, y: 30, w: 120, h: 100, fill: "#111", stroke: "#8a7a68", strokeW: 1, label: "Gift Shop", icon: "🎁", color: "#8a7a68" },
      // Storage
      { type: "room", x: 650, y: 220, w: 120, h: 150, fill: "#0f0f0f", stroke: "#3a3a3a", strokeW: 1, label: "Storage", icon: "📦", color: "#4a4a4a" },
      // Lobby corridor
      { type: "room", x: 320, y: 140, w: 310, h: 70, fill: "#161610", stroke: "#2a2520", strokeW: 1, label: "Corridor", icon: "", color: "#4a3f32" },
      // Bottom corridor
      { type: "room", x: 30, y: 380, w: 740, h: 80, fill: "#161610", stroke: "#2a2520", strokeW: 1, label: "Main Corridor", icon: "", color: "#4a3f32" },
      // Elevator
      { type: "special", x: 740, y: 140, w: 40, h: 70, fill: "#1a1520", stroke: "#c9a96e", strokeW: 2, label: "LIFT", icon: "🛗", color: "#c9a96e", special: "elevator" },
      // Stairs
      { type: "special", x: 690, y: 380, w: 80, h: 80, fill: "#101520", stroke: "#6a9fb5", strokeW: 2, label: "STAIRS", icon: "🪜", color: "#6a9fb5", special: "stairs" },
      // Emergency Exit
      { type: "special", x: 20, y: 380, w: 30, h: 80, fill: "#200f0f", stroke: "#c97b6e", strokeW: 2, label: "EXIT", icon: "🚪", color: "#c97b6e", special: "emergency" },
      // Fire Exit
      { type: "special", x: 750, y: 250, w: 30, h: 70, fill: "#200f0f", stroke: "#ff4444", strokeW: 2, label: "FIRE", icon: "🔥", color: "#ff4444", special: "fire" },
    ]
  },
  "2nd": {
    label: "2nd Floor — Rooms 201–230",
    width: 800,
    height: 500,
    rooms: [
      { type: "wall", x: 20, y: 20, w: 760, h: 460, fill: "none", stroke: "#c9a96e", strokeW: 2 },
      // Central corridor
      { type: "room", x: 20, y: 220, w: 760, h: 60, fill: "#161610", stroke: "#2a2520", strokeW: 1, label: "Main Corridor", icon: "", color: "#4a3f32" },
      // Left rooms (201-210) top
      ...[201,202,203,204,205].map((n, i) => ({ type: "room", x: 30 + i*140, y: 30, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Right rooms (206-215) bottom
      ...[206,207,208,209,210].map((n, i) => ({ type: "room", x: 30 + i*140, y: 290, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Elevator
      { type: "special", x: 740, y: 220, w: 40, h: 60, fill: "#1a1520", stroke: "#c9a96e", strokeW: 2, label: "LIFT", icon: "🛗", color: "#c9a96e", special: "elevator" },
      // Stairs
      { type: "special", x: 690, y: 380, w: 80, h: 90, fill: "#101520", stroke: "#6a9fb5", strokeW: 2, label: "STAIRS", icon: "🪜", color: "#6a9fb5", special: "stairs" },
      // Emergency Exit
      { type: "special", x: 20, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#c97b6e", strokeW: 2, label: "EXIT", icon: "🚪", color: "#c97b6e", special: "emergency" },
      // Fire Exit
      { type: "special", x: 750, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#ff4444", strokeW: 2, label: "FIRE", icon: "🔥", color: "#ff4444", special: "fire" },
      // Housekeeping
      { type: "room", x: 690, y: 30, w: 90, h: 90, fill: "#111", stroke: "#4a4a4a", strokeW: 1, label: "Housekeeping", icon: "🧹", color: "#6a5f52" },
    ]
  },
  "3rd": {
    label: "3rd Floor — Rooms 301–330 & Spa",
    width: 800,
    height: 500,
    rooms: [
      { type: "wall", x: 20, y: 20, w: 760, h: 460, fill: "none", stroke: "#c9a96e", strokeW: 2 },
      { type: "room", x: 20, y: 220, w: 760, h: 60, fill: "#161610", stroke: "#2a2520", strokeW: 1, label: "Main Corridor", icon: "", color: "#4a3f32" },
      // Rooms top (301-306)
      ...[301,302,303,304].map((n, i) => ({ type: "room", x: 30 + i*140, y: 30, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Spa & Wellness (large room top right)
      { type: "room", x: 590, y: 30, w: 190, h: 180, fill: "#101a15", stroke: "#7eb87e", strokeW: 1.5, label: "Spa & Wellness", icon: "💆", color: "#7eb87e" },
      // Rooms bottom (307-312)
      ...[307,308,309,310].map((n, i) => ({ type: "room", x: 30 + i*140, y: 290, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Relaxation lounge
      { type: "room", x: 590, y: 290, w: 190, h: 180, fill: "#101a15", stroke: "#7eb87e", strokeW: 1, label: "Relaxation Lounge", icon: "🧘", color: "#7eb87e" },
      { type: "special", x: 740, y: 220, w: 40, h: 60, fill: "#1a1520", stroke: "#c9a96e", strokeW: 2, label: "LIFT", icon: "🛗", color: "#c9a96e", special: "elevator" },
      { type: "special", x: 540, y: 290, w: 40, h: 90, fill: "#101520", stroke: "#6a9fb5", strokeW: 2, label: "STAIRS", icon: "🪜", color: "#6a9fb5", special: "stairs" },
      { type: "special", x: 20, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#c97b6e", strokeW: 2, label: "EXIT", icon: "🚪", color: "#c97b6e", special: "emergency" },
      { type: "special", x: 750, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#ff4444", strokeW: 2, label: "FIRE", icon: "🔥", color: "#ff4444", special: "fire" },
    ]
  },
  "4th": {
    label: "4th Floor — Rooms 401–420 & Conference",
    width: 800,
    height: 500,
    rooms: [
      { type: "wall", x: 20, y: 20, w: 760, h: 460, fill: "none", stroke: "#c9a96e", strokeW: 2 },
      { type: "room", x: 20, y: 220, w: 760, h: 60, fill: "#161610", stroke: "#2a2520", strokeW: 1, label: "Main Corridor", icon: "", color: "#4a3f32" },
      ...[401,402,403,404].map((n, i) => ({ type: "room", x: 30 + i*140, y: 30, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Conference Room (large, top right)
      { type: "room", x: 590, y: 30, w: 190, h: 180, fill: "#101018", stroke: "#6a9fb5", strokeW: 1.5, label: "Conference Room", icon: "💼", color: "#6a9fb5" },
      ...[407,408,409,410].map((n, i) => ({ type: "room", x: 30 + i*140, y: 290, w: 130, h: 180, fill: "#1a1510", stroke: "#c9a96e", strokeW: 1, label: `Room ${n}`, icon: "🛏️", color: "#c9a96e" })),
      // Business Center
      { type: "room", x: 590, y: 290, w: 190, h: 180, fill: "#101018", stroke: "#6a9fb5", strokeW: 1, label: "Business Center", icon: "💻", color: "#6a9fb5" },
      { type: "special", x: 740, y: 220, w: 40, h: 60, fill: "#1a1520", stroke: "#c9a96e", strokeW: 2, label: "LIFT", icon: "🛗", color: "#c9a96e", special: "elevator" },
      { type: "special", x: 540, y: 290, w: 40, h: 90, fill: "#101520", stroke: "#6a9fb5", strokeW: 2, label: "STAIRS", icon: "🪜", color: "#6a9fb5", special: "stairs" },
      { type: "special", x: 20, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#c97b6e", strokeW: 2, label: "EXIT", icon: "🚪", color: "#c97b6e", special: "emergency" },
      { type: "special", x: 750, y: 290, w: 30, h: 90, fill: "#200f0f", stroke: "#ff4444", strokeW: 2, label: "FIRE", icon: "🔥", color: "#ff4444", special: "fire" },
    ]
  },
  "5th": {
    label: "5th Floor — Function Hall, Gym & Rooftop Pool",
    width: 800,
    height: 500,
    rooms: [
      { type: "wall", x: 20, y: 20, w: 760, h: 460, fill: "none", stroke: "#c9a96e", strokeW: 2 },
      // Function Hall (big)
      { type: "room", x: 30, y: 30, w: 350, h: 200, fill: "#1a1210", stroke: "#c9a96e", strokeW: 2, label: "Function Hall", icon: "🎉", color: "#c9a96e" },
      // Rooftop Pool
      { type: "room", x: 390, y: 30, w: 380, h: 200, fill: "#0a1520", stroke: "#6a9fb5", strokeW: 2, label: "Rooftop Infinity Pool", icon: "🏊", color: "#6a9fb5" },
      // Gym
      { type: "room", x: 30, y: 240, w: 250, h: 220, fill: "#101510", stroke: "#7eb87e", strokeW: 1.5, label: "Gym / Fitness Center", icon: "🏋️", color: "#7eb87e" },
      // Pool Bar
      { type: "room", x: 290, y: 240, w: 180, h: 100, fill: "#1a1210", stroke: "#c97b6e", strokeW: 1, label: "Pool Bar", icon: "🍹", color: "#c97b6e" },
      // Changing Rooms
      { type: "room", x: 290, y: 350, w: 80, h: 110, fill: "#111", stroke: "#4a4a4a", strokeW: 1, label: "Change ♂", icon: "", color: "#6a5f52" },
      { type: "room", x: 380, y: 350, w: 80, h: 110, fill: "#111", stroke: "#4a4a4a", strokeW: 1, label: "Change ♀", icon: "", color: "#6a5f52" },
      // Storage / Equipment
      { type: "room", x: 470, y: 240, w: 120, h: 220, fill: "#0f0f0f", stroke: "#3a3a3a", strokeW: 1, label: "Equipment Storage", icon: "📦", color: "#4a4a4a" },
      // Staff Room
      { type: "room", x: 600, y: 240, w: 170, h: 220, fill: "#0f1010", stroke: "#4a4a4a", strokeW: 1, label: "Staff Room", icon: "👥", color: "#4a4a4a" },
      { type: "special", x: 740, y: 130, w: 40, h: 60, fill: "#1a1520", stroke: "#c9a96e", strokeW: 2, label: "LIFT", icon: "🛗", color: "#c9a96e", special: "elevator" },
      { type: "special", x: 690, y: 380, w: 80, h: 80, fill: "#101520", stroke: "#6a9fb5", strokeW: 2, label: "STAIRS", icon: "🪜", color: "#6a9fb5", special: "stairs" },
      { type: "special", x: 20, y: 380, w: 30, h: 80, fill: "#200f0f", stroke: "#c97b6e", strokeW: 2, label: "EXIT", icon: "🚪", color: "#c97b6e", special: "emergency" },
      { type: "special", x: 750, y: 380, w: 30, h: 80, fill: "#200f0f", stroke: "#ff4444", strokeW: 2, label: "FIRE", icon: "🔥", color: "#ff4444", special: "fire" },
    ]
  }
};

const legend = [
  { color: "#c9a96e", label: "Guest Rooms / Main Areas" },
  { color: "#7eb87e", label: "Wellness / Recreation" },
  { color: "#6a9fb5", label: "Business / Pool" },
  { color: "#c97b6e", label: "Emergency Exit" },
  { color: "#ff4444", label: "Fire Exit" },
  { color: "#6a9fb5", label: "Elevator / Stairs" },
  { color: "#6a5f52", label: "Restrooms / Utility" },
];

function FloorSVG({ floor, onHover, hovered }) {
  const data = floors[floor];
  return (
    <svg viewBox={`0 0 ${data.width} ${data.height}`} style={{ width: "100%", height: "auto", display: "block" }}>
      <rect width={data.width} height={data.height} fill="#0d0d0d" />
      {data.rooms.map((room, i) => {
        const isHovered = hovered === i;
        return (
          <g key={i}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={() => onHover(null)}
            style={{ cursor: room.label ? "pointer" : "default" }}
          >
            <rect
              x={room.x} y={room.y} width={room.w} height={room.h}
              fill={isHovered ? room.fill.replace("1a", "2a") : room.fill}
              stroke={room.stroke}
              strokeWidth={room.strokeW || 1}
              rx={2}
              opacity={isHovered ? 1 : 0.95}
            />
            {isHovered && room.label && (
              <rect x={room.x} y={room.y} width={room.w} height={room.h}
                fill={room.color} opacity={0.08} rx={2} />
            )}
            {room.label && (
              <>
                {room.icon && (
                  <text x={room.x + room.w / 2} y={room.y + room.h / 2 - 10}
                    textAnchor="middle" fontSize={room.w > 80 ? 18 : 14} fill={room.color}>
                    {room.icon}
                  </text>
                )}
                <text x={room.x + room.w / 2} y={room.y + room.h / 2 + (room.icon ? 14 : 6)}
                  textAnchor="middle" fontSize={room.w > 120 ? 11 : 9}
                  fill={room.color} fontFamily="Jost, sans-serif"
                  letterSpacing="1">
                  {room.label.length > 14 ? room.label.slice(0, 13) + "…" : room.label}
                </text>
              </>
            )}
            {/* Special badges */}
            {room.special === "elevator" && (
              <rect x={room.x + 2} y={room.y + 2} width={room.w - 4} height={10}
                fill="#c9a96e" opacity={0.3} />
            )}
            {room.special === "fire" && (
              <rect x={room.x} y={room.y} width={room.w} height={room.h}
                fill="#ff0000" opacity={0.1} rx={2} />
            )}
            {room.special === "emergency" && (
              <rect x={room.x} y={room.y} width={room.w} height={room.h}
                fill="#ff6600" opacity={0.1} rx={2} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export default function FloorMapPage({ navigate }) {
  const [activeFloor, setActiveFloor] = useState("Ground");
  const [hovered, setHovered] = useState(null);

  const floorKeys = ["Ground", "2nd", "3rd", "4th", "5th"];
  const hoveredRoom = hovered !== null ? floors[activeFloor].rooms[hovered] : null;

  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <button style={s.backBtn} onClick={() => navigate("landing")}>← Back</button>
        <div style={s.logo}>GRAND<span style={s.accent}>VELOUR</span></div>
        <button style={s.bookBtn} onClick={() => navigate("book")}>Reserve a Room</button>
      </nav>

      <div style={s.header}>
        <p style={s.headerSub}>HOTEL DIRECTORY</p>
        <h1 style={s.headerTitle}>Floor Map</h1>
        <p style={s.headerDesc}>Hover over any room or area to see details. Click a floor to explore.</p>
      </div>

      <div style={s.layout}>
        {/* Floor Selector */}
        <div style={s.sidebar}>
          <p style={s.sideLabel}>SELECT FLOOR</p>
          {floorKeys.map(f => (
            <button
              key={f}
              style={{ ...s.floorBtn, ...(activeFloor === f ? s.floorActive : {}) }}
              onClick={() => { setActiveFloor(f); setHovered(null); }}
            >
              <span style={s.floorNum}>{f}</span>
              <span style={s.floorSub}>
                {f === "Ground" ? "Lobby" : f === "2nd" ? "Rooms 201–210" : f === "3rd" ? "Rooms 301–310 + Spa" : f === "4th" ? "Rooms 401–410 + Conf." : "Facilities"}
              </span>
            </button>
          ))}

          {/* Tooltip / Hovered info */}
          <div style={s.tooltip}>
            {hoveredRoom && hoveredRoom.label ? (
              <>
                <p style={{ ...s.tooltipTitle, color: hoveredRoom.color }}>{hoveredRoom.icon} {hoveredRoom.label}</p>
                <p style={s.tooltipType}>
                  {hoveredRoom.special === "elevator" ? "🛗 Elevator — available all floors" :
                   hoveredRoom.special === "stairs" ? "🪜 Staircase — all floors" :
                   hoveredRoom.special === "emergency" ? "🚪 Emergency Exit" :
                   hoveredRoom.special === "fire" ? "🔥 Fire Exit — keep clear" :
                   hoveredRoom.type === "room" ? "📍 " + floors[activeFloor].label.split("—")[0] :
                   "📍 Common Area"}
                </p>
              </>
            ) : (
              <p style={s.tooltipHint}>Hover over a room to see details</p>
            )}
          </div>
        </div>

        {/* SVG Map */}
        <div style={s.mapWrap}>
          <p style={s.floorLabel}>{floors[activeFloor].label}</p>
          <div style={s.svgWrap}>
            <FloorSVG floor={activeFloor} onHover={setHovered} hovered={hovered} />
          </div>

          {/* Legend */}
          <div style={s.legend}>
            <p style={s.legendTitle}>LEGEND</p>
            <div style={s.legendGrid}>
              {legend.map((l, i) => (
                <div key={i} style={s.legendItem}>
                  <div style={{ ...s.legendDot, background: l.color }} />
                  <span style={s.legendLabel}>{l.label}</span>
                </div>
              ))}
              <div style={s.legendItem}>
                <div style={{ ...s.legendDot, background: "#c97b6e", border: "2px solid #ff6600" }} />
                <span style={s.legendLabel}>Emergency Exit</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2024 Grand Velour Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}

const s = {
  page: { background: "#0d0d0d", minHeight: "100vh", color: "#e8dcc8", fontFamily: "'Cormorant Garamond', serif" },
  nav: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 60px", borderBottom: "1px solid #2a2520", position: "sticky", top: 0, background: "#0d0d0d", zIndex: 100 },
  backBtn: { background: "none", border: "none", color: "#a09080", cursor: "pointer", fontFamily: "'Jost', sans-serif", fontSize: "13px" },
  logo: { fontSize: "20px", fontWeight: 600, letterSpacing: "6px" },
  accent: { color: "#c9a96e" },
  bookBtn: { background: "#c9a96e", border: "none", color: "#0d0d0d", padding: "10px 24px", fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "2px", cursor: "pointer", fontWeight: 500, textTransform: "uppercase" },
  header: { textAlign: "center", padding: "60px 60px 30px" },
  headerSub: { fontFamily: "'Jost', sans-serif", fontSize: "11px", letterSpacing: "5px", color: "#c9a96e", margin: "0 0 12px" },
  headerTitle: { fontSize: "52px", fontWeight: 300, margin: "0 0 16px" },
  headerDesc: { fontFamily: "'Jost', sans-serif", fontSize: "14px", color: "#6a5f52", margin: 0 },
  layout: { display: "grid", gridTemplateColumns: "220px 1fr", gap: "32px", padding: "0 60px 60px" },
  sidebar: { display: "flex", flexDirection: "column", gap: "8px" },
  sideLabel: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#4a3f32", textTransform: "uppercase", margin: "0 0 8px" },
  floorBtn: { background: "#111", border: "1px solid #1e1a16", padding: "14px 16px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" },
  floorActive: { border: "1px solid #c9a96e", background: "rgba(201,169,110,0.08)" },
  floorNum: { display: "block", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#e8dcc8", marginBottom: "4px" },
  floorSub: { display: "block", fontFamily: "'Jost', sans-serif", fontSize: "10px", color: "#6a5f52", letterSpacing: "1px" },
  tooltip: { marginTop: "24px", padding: "20px", border: "1px solid #1e1a16", background: "#111", minHeight: "80px" },
  tooltipTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 400, margin: "0 0 8px" },
  tooltipType: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#6a5f52", margin: 0 },
  tooltipHint: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#3a3530", margin: 0, fontStyle: "italic" },
  mapWrap: { display: "flex", flexDirection: "column", gap: "16px" },
  floorLabel: { fontFamily: "'Jost', sans-serif", fontSize: "12px", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", margin: 0 },
  svgWrap: { border: "1px solid #1e1a16", background: "#0d0d0d", overflow: "hidden" },
  legend: { border: "1px solid #1e1a16", padding: "20px 24px", background: "#111" },
  legendTitle: { fontFamily: "'Jost', sans-serif", fontSize: "10px", letterSpacing: "3px", color: "#c9a96e", textTransform: "uppercase", margin: "0 0 14px" },
  legendGrid: { display: "flex", flexWrap: "wrap", gap: "12px 24px" },
  legendItem: { display: "flex", alignItems: "center", gap: "8px" },
  legendDot: { width: "12px", height: "12px", borderRadius: "2px", flexShrink: 0 },
  legendLabel: { fontFamily: "'Jost', sans-serif", fontSize: "11px", color: "#8a7a68" },
  footer: { padding: "40px 60px", textAlign: "center", borderTop: "1px solid #1e1a16" },
  footerText: { fontFamily: "'Jost', sans-serif", fontSize: "12px", color: "#4a3f32", letterSpacing: "2px" },
};