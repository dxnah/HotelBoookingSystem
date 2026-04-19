import { useState } from "react";

const PHOTOS = {
  lobby:   "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=70",
  recept:  "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?w=400&q=70",
  dining:  "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=70",
  bar:     "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400&q=70",
  spa:     "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=70",
  pool:    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=70",
  gym:     "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=70",
  conf:    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=70",
  biz:     "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=70",
  func:    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=400&q=70",
  pbar:    "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&q=70",
  relax:   "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=70",
  valet:   "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&q=70",
  gift:    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&q=70",
  room_avail: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=70",
  room_occ:   "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&q=70",
};

// ─── THEME COLORS ─────────────────────────────────────────────────────────────
const T = {
  available:  { fill:"#132010", stroke:"#7eb87e",  text:"#7eb87e",  wall:"#0d180a" },
  occupied:   { fill:"#201210", stroke:"#c97b6e",  text:"#c97b6e",  wall:"#180d0a" },
  special:    { fill:"#181408", stroke:"#c9a96e",  text:"#c9a96e",  wall:"#120f06" },
  service:    { fill:"#0c1318", stroke:"#6a9fb5",  text:"#6a9fb5",  wall:"#090f14" },
  utility:    { fill:"#0f0f0f", stroke:"#4a4545",  text:"#6a5f52",  wall:"#0a0a0a" },
  corridor:   { fill:"#141410", stroke:"#2a2520",  text:"#4a3f32",  wall:"#0f0e0c" },
  emergency:  { fill:"#1a0a08", stroke:"#c97b6e",  text:"#c97b6e",  wall:"#130808" },
  fire:       { fill:"#1a0606", stroke:"#ff5544",  text:"#ff5544",  wall:"#130505" },
  wall:       { fill:"#1e1c18", stroke:"#2a2820",  text:"#000",     wall:"#1e1c18" },
  stairs:     { fill:"#0f1018", stroke:"#6a9fb5",  text:"#6a9fb5",  wall:"#0a0b14" },
};

// ─── FLOOR PLANS ──────────────────────────────────────────────────────────────
// All coordinates in a 1000×620 viewport.
// Layout: thick outer wall, central horizontal corridor, rooms top & bottom.
// Stairwell + lift at far right, emergency exit far left.

const W = 1000, H = 620;
const WALL = 8;       // outer wall thickness
const COR_Y = 258;    // corridor top Y
const COR_H = 64;     // corridor height
const COR_BOT = COR_Y + COR_H; // 322

const floors = {
  G: {
    name: "Ground Floor",
    subtitle: "Lobby · Fine Dining · Reception · Services",
    rooms: [
      // ── OUTER WALL ──
      { id:"outer", type:"wall", x:0, y:0, w:W, h:H, fill:"#1e1c18", stroke:"#3a3520", strokeW:0, label:"", photo:null },

      // ── INNER FLOOR ──
      { id:"floor", type:"floor", x:WALL, y:WALL, w:W-WALL*2, h:H-WALL*2, fill:"#0c0b09", stroke:"none", strokeW:0, label:"", photo:null },

      // ── MAIN LOBBY (large, spans full height left side) ──
      { id:"lobby", label:"Main Lobby", icon:"🏛", theme:"special", photo:"lobby",
        x:WALL, y:WALL, w:280, h:H-WALL*2, desc:"Grand entrance lobby with concierge desk, seating & check-in" },

      // ── TOP ROW (above corridor) ──
      { id:"recept", label:"Reception", icon:"💁", theme:"special", photo:"recept",
        x:296, y:WALL, w:160, h:COR_Y-WALL, desc:"24-hour front desk and guest services" },
      { id:"conc", label:"Concierge", icon:"🗝", theme:"special", photo:null,
        x:464, y:WALL, w:120, h:COR_Y-WALL, desc:"Concierge services and tour bookings" },
      { id:"gift", label:"Gift Shop", icon:"🎁", theme:"utility", photo:"gift",
        x:592, y:WALL, w:120, h:COR_Y-WALL, desc:"Souvenirs and hotel merchandise" },
      { id:"valet", label:"Valet & Entrance", icon:"🚗", theme:"service", photo:"valet",
        x:720, y:WALL, w:164, h:COR_Y-WALL, desc:"Valet parking — complimentary for all guests" },

      // ── CORRIDOR ──
      { id:"corridor", label:"Main Corridor", icon:"", theme:"corridor", photo:null,
        x:296, y:COR_Y, w:592, h:COR_H, desc:"Central corridor connecting all ground floor areas" },

      // ── BOTTOM ROW (below corridor) ──
      { id:"dining", label:"Fine Dining", icon:"🍽", theme:"special", photo:"dining",
        x:296, y:COR_BOT, w:200, h:H-COR_BOT-WALL, desc:"Award-winning restaurant, open daily 6AM–11PM" },
      { id:"bar", label:"Bar & Lounge", icon:"🍸", theme:"special", photo:"bar",
        x:504, y:COR_BOT, w:160, h:H-COR_BOT-WALL, desc:"Craft cocktails, live music Fri–Sat from 8PM" },
      { id:"wcm", label:"WC ♂", icon:"", theme:"utility", photo:null,
        x:672, y:COR_BOT, w:80, h:(H-COR_BOT-WALL)/2, desc:"Men's restroom" },
      { id:"wcf", label:"WC ♀", icon:"", theme:"utility", photo:null,
        x:672, y:COR_BOT+(H-COR_BOT-WALL)/2, w:80, h:(H-COR_BOT-WALL)/2, desc:"Women's restroom" },
      { id:"storage", label:"Storage", icon:"📦", theme:"utility", photo:null,
        x:760, y:COR_BOT, w:124, h:H-COR_BOT-WALL, desc:"Staff storage & luggage holding" },

      // ── RIGHT CORE (lift + stairs) ──
      { id:"lift", label:"LIFT", icon:"🛗", theme:"service", photo:null,
        x:892, y:WALL, w:100, h:COR_Y-WALL, desc:"Elevator — serves all floors 24/7" },
      { id:"stairs", label:"STAIRS", icon:"🪜", theme:"stairs", photo:null,
        x:892, y:COR_Y, w:100, h:H-COR_Y-WALL, desc:"Main staircase — all floors" },

      // ── EXITS ──
      { id:"exitT", label:"EXIT", icon:"🚪", theme:"emergency", photo:null,
        x:WALL, y:0, w:60, h:WALL+2, desc:"Main hotel entrance / emergency exit" },
      { id:"fireR", label:"FIRE EXIT", icon:"🔥", theme:"fire", photo:null,
        x:W-WALL-40, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Fire exit — keep clear at all times" },
    ]
  },

  "2": {
    name: "2nd Floor",
    subtitle: "Rooms 201–210 & Housekeeping",
    rooms: [
      { id:"outer", type:"wall", x:0, y:0, w:W, h:H, fill:"#1e1c18", stroke:"#3a3520", strokeW:0, label:"", photo:null },
      { id:"floor", type:"floor", x:WALL, y:WALL, w:W-WALL*2, h:H-WALL*2, fill:"#0c0b09", stroke:"none", strokeW:0, label:"", photo:null },

      // TOP ROOMS 201–205 (above corridor)
      ...[201,202,203,204,205].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===203 ? "room_occ" : "room_avail",
        theme: n===203 ? "occupied" : "available",
        x: WALL + i*176, y: WALL, w: 168, h: COR_Y-WALL,
        desc: n===203 ? "Occupied — guest checks out Dec 23" : "Available for booking",
      })),

      // HOUSEKEEPING (top right, same height as rooms)
      { id:"hk", label:"Housekeeping", icon:"🧹", theme:"utility", photo:null,
        x: WALL+5*176, y: WALL, w: W-WALL*2-5*176, h: COR_Y-WALL,
        desc:"Housekeeping staff room and linen storage" },

      // CORRIDOR
      { id:"corridor", label:"", icon:"", theme:"corridor", photo:null,
        x:WALL, y:COR_Y, w:W-WALL*2-100, h:COR_H, desc:"2nd floor corridor" },

      // BOTTOM ROOMS 206–210 (below corridor)
      ...[206,207,208,209,210].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===208 ? "room_occ" : "room_avail",
        theme: n===208 ? "occupied" : "available",
        x: WALL + i*176, y: COR_BOT, w: 168, h: H-COR_BOT-WALL,
        desc: n===208 ? "Occupied — guest checks out Dec 26" : "Available for booking",
      })),
      { id:"hk2", label:"Linen Store", icon:"🧺", theme:"utility", photo:null,
        x: WALL+5*176, y: COR_BOT, w: W-WALL*2-5*176-100, h: H-COR_BOT-WALL,
        desc:"Linen and supplies storage" },

      // RIGHT CORE
      { id:"lift", label:"LIFT", icon:"🛗", theme:"service", photo:null,
        x:W-WALL-100, y:WALL, w:92, h:(H-WALL*2)/2-2, desc:"Elevator" },
      { id:"stairs", label:"STAIRS", icon:"🪜", theme:"stairs", photo:null,
        x:W-WALL-100, y:WALL+(H-WALL*2)/2+2, w:92, h:(H-WALL*2)/2-2, desc:"Main staircase" },

      { id:"exitL", label:"EXIT", icon:"🚪", theme:"emergency", photo:null,
        x:0, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Emergency exit" },
      { id:"fireR", label:"FIRE", icon:"🔥", theme:"fire", photo:null,
        x:W-WALL-2, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Fire exit" },
    ]
  },

  "3": {
    name: "3rd Floor",
    subtitle: "Rooms 301–308 · Spa & Wellness",
    rooms: [
      { id:"outer", type:"wall", x:0, y:0, w:W, h:H, fill:"#1e1c18", stroke:"#3a3520", strokeW:0, label:"", photo:null },
      { id:"floor", type:"floor", x:WALL, y:WALL, w:W-WALL*2, h:H-WALL*2, fill:"#0c0b09", stroke:"none", strokeW:0, label:"", photo:null },

      // TOP: Rooms 301–304 + Spa (large)
      ...[301,302,303,304].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===302 ? "room_occ" : "room_avail",
        theme: n===302 ? "occupied" : "available",
        x: WALL + i*150, y: WALL, w: 142, h: COR_Y-WALL,
        desc: n===302 ? "Occupied" : "Available for booking",
      })),
      { id:"spa", label:"Spa & Wellness", icon:"💆", theme:"service", photo:"spa",
        x: WALL+4*150, y: WALL, w: W-WALL*2-4*150-100, h: COR_Y-WALL,
        desc:"Full-service spa — massages, facials, hydrotherapy. Open 8AM–9PM" },

      // CORRIDOR
      { id:"corridor", label:"", icon:"", theme:"corridor", photo:null,
        x:WALL, y:COR_Y, w:W-WALL*2-100, h:COR_H, desc:"3rd floor corridor" },

      // BOTTOM: Rooms 305–308 + Relaxation Lounge
      ...[305,306,307,308].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===307 ? "room_occ" : "room_avail",
        theme: n===307 ? "occupied" : "available",
        x: WALL + i*150, y: COR_BOT, w: 142, h: H-COR_BOT-WALL,
        desc: n===307 ? "Occupied" : "Available for booking",
      })),
      { id:"relax", label:"Relaxation Lounge", icon:"🧘", theme:"service", photo:"relax",
        x: WALL+4*150, y: COR_BOT, w: W-WALL*2-4*150-100, h: H-COR_BOT-WALL,
        desc:"Quiet relaxation lounge — for spa guests only" },

      { id:"lift", label:"LIFT", icon:"🛗", theme:"service", photo:null,
        x:W-WALL-100, y:WALL, w:92, h:(H-WALL*2)/2-2, desc:"Elevator" },
      { id:"stairs", label:"STAIRS", icon:"🪜", theme:"stairs", photo:null,
        x:W-WALL-100, y:WALL+(H-WALL*2)/2+2, w:92, h:(H-WALL*2)/2-2, desc:"Main staircase" },
      { id:"exitL", label:"EXIT", icon:"🚪", theme:"emergency", photo:null,
        x:0, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Emergency exit" },
      { id:"fireR", label:"FIRE", icon:"🔥", theme:"fire", photo:null,
        x:W-WALL-2, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Fire exit" },
    ]
  },

  "4": {
    name: "4th Floor",
    subtitle: "Rooms 401–408 · Conference & Business Center",
    rooms: [
      { id:"outer", type:"wall", x:0, y:0, w:W, h:H, fill:"#1e1c18", stroke:"#3a3520", strokeW:0, label:"", photo:null },
      { id:"floor", type:"floor", x:WALL, y:WALL, w:W-WALL*2, h:H-WALL*2, fill:"#0c0b09", stroke:"none", strokeW:0, label:"", photo:null },

      ...[401,402,403,404].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===401 ? "room_occ" : "room_avail",
        theme: n===401 ? "occupied" : "available",
        x: WALL + i*150, y: WALL, w: 142, h: COR_Y-WALL,
        desc: n===401 ? "Occupied" : "Available",
      })),
      { id:"conf", label:"Conference Room", icon:"💼", theme:"service", photo:"conf",
        x: WALL+4*150, y: WALL, w: W-WALL*2-4*150-100, h: COR_Y-WALL,
        desc:"Conference room — seats 30. AV equipment. Book via concierge." },

      { id:"corridor", label:"", icon:"", theme:"corridor", photo:null,
        x:WALL, y:COR_Y, w:W-WALL*2-100, h:COR_H, desc:"4th floor corridor" },

      ...[405,406,407,408].map((n,i) => ({
        id:`r${n}`, label:`Room ${n}`, icon:"🛏", photo: n===408 ? "room_occ" : "room_avail",
        theme: n===408 ? "occupied" : "available",
        x: WALL + i*150, y: COR_BOT, w: 142, h: H-COR_BOT-WALL,
        desc: n===408 ? "Occupied" : "Available",
      })),
      { id:"biz", label:"Business Center", icon:"💻", theme:"service", photo:"biz",
        x: WALL+4*150, y: COR_BOT, w: W-WALL*2-4*150-100, h: H-COR_BOT-WALL,
        desc:"Workstations · Printer · High-speed WiFi · Open 24hrs" },

      { id:"lift", label:"LIFT", icon:"🛗", theme:"service", photo:null,
        x:W-WALL-100, y:WALL, w:92, h:(H-WALL*2)/2-2, desc:"Elevator" },
      { id:"stairs", label:"STAIRS", icon:"🪜", theme:"stairs", photo:null,
        x:W-WALL-100, y:WALL+(H-WALL*2)/2+2, w:92, h:(H-WALL*2)/2-2, desc:"Main staircase" },
      { id:"exitL", label:"EXIT", icon:"🚪", theme:"emergency", photo:null,
        x:0, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Emergency exit" },
      { id:"fireR", label:"FIRE", icon:"🔥", theme:"fire", photo:null,
        x:W-WALL-2, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Fire exit" },
    ]
  },

  "5": {
    name: "5th Floor",
    subtitle: "Function Hall · Gym · Rooftop Pool",
    rooms: [
      { id:"outer", type:"wall", x:0, y:0, w:W, h:H, fill:"#1e1c18", stroke:"#3a3520", strokeW:0, label:"", photo:null },
      { id:"floor", type:"floor", x:WALL, y:WALL, w:W-WALL*2, h:H-WALL*2, fill:"#0c0b09", stroke:"none", strokeW:0, label:"", photo:null },

      // Top half: Function Hall + Pool side by side
      { id:"func", label:"Function Hall", icon:"🎉", theme:"special", photo:"func",
        x:WALL, y:WALL, w:440, h:COR_Y-WALL,
        desc:"Grand function hall — capacity 200. Available for events & banquets." },
      { id:"pool", label:"Rooftop Infinity Pool", icon:"🏊", theme:"service", photo:"pool",
        x:452, y:WALL, w:W-452-WALL-100, h:COR_Y-WALL,
        desc:"Infinity pool — open 6AM to 10PM. Poolside bar service available." },

      // Narrow passage between function hall and corridor
      { id:"corridor", label:"", icon:"", theme:"corridor", photo:null,
        x:WALL, y:COR_Y, w:W-WALL*2-100, h:COR_H, desc:"5th floor corridor" },

      // Bottom half: Gym + Pool Bar + Changing + Storage + Staff
      { id:"gym", label:"Gym & Fitness Center", icon:"🏋", theme:"service", photo:"gym",
        x:WALL, y:COR_BOT, w:260, h:H-COR_BOT-WALL,
        desc:"Full gym — free weights, cardio, personal training available." },
      { id:"pbar", label:"Pool Bar", icon:"🍹", theme:"special", photo:"pbar",
        x:278, y:COR_BOT, w:160, h:H-COR_BOT-WALL,
        desc:"Poolside bar — cocktails, mocktails and light snacks" },
      { id:"chm", label:"♂", icon:"", theme:"utility", photo:null,
        x:446, y:COR_BOT, w:80, h:(H-COR_BOT-WALL)/2,
        desc:"Men's changing room" },
      { id:"chf", label:"♀", icon:"", theme:"utility", photo:null,
        x:446, y:COR_BOT+(H-COR_BOT-WALL)/2, w:80, h:(H-COR_BOT-WALL)/2,
        desc:"Women's changing room" },
      { id:"equip", label:"Equipment", icon:"📦", theme:"utility", photo:null,
        x:534, y:COR_BOT, w:140, h:H-COR_BOT-WALL,
        desc:"Pool and gym equipment storage" },
      { id:"staff", label:"Staff Room", icon:"👥", theme:"utility", photo:null,
        x:682, y:COR_BOT, w:W-682-WALL-100, h:H-COR_BOT-WALL,
        desc:"Staff break room and lockers" },

      { id:"lift", label:"LIFT", icon:"🛗", theme:"service", photo:null,
        x:W-WALL-100, y:WALL, w:92, h:(H-WALL*2)/2-2, desc:"Elevator" },
      { id:"stairs", label:"STAIRS", icon:"🪜", theme:"stairs", photo:null,
        x:W-WALL-100, y:WALL+(H-WALL*2)/2+2, w:92, h:(H-WALL*2)/2-2, desc:"Main staircase" },
      { id:"exitL", label:"EXIT", icon:"🚪", theme:"emergency", photo:null,
        x:0, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Emergency exit" },
      { id:"fireR", label:"FIRE", icon:"🔥", theme:"fire", photo:null,
        x:W-WALL-2, y:COR_Y+COR_H/2-20, w:WALL+2, h:40, desc:"Fire exit" },
    ]
  },
};

const FLOOR_KEYS = ["G","2","3","4","5"];
const FLOOR_LABELS = { G:"Ground", 2:"2nd", 3:"3rd", 4:"4th", 5:"5th" };
const LEGEND = [
  { theme:"available",  label:"Available room" },
  { theme:"occupied",   label:"Occupied room" },
  { theme:"special",    label:"Lobby / main area" },
  { theme:"service",    label:"Hotel services" },
  { theme:"utility",    label:"Utility / staff" },
  { theme:"stairs",     label:"Elevator / stairs" },
  { theme:"emergency",  label:"Emergency exit" },
  { theme:"fire",       label:"Fire exit" },
];

// ─── DOOR MARK (small arc indicating door swing) ─────────────────────────────
function DoorMark({ x, y, side = "bottom", size = 14 }) {
  const s = size;
  if (side === "bottom") return (
    <g opacity={0.5}>
      <line x1={x} y1={y} x2={x} y2={y - s} stroke="#c9a96e" strokeWidth={0.8}/>
      <path d={`M ${x} ${y} A ${s} ${s} 0 0 1 ${x + s} ${y}`} fill="none" stroke="#c9a96e" strokeWidth={0.6} strokeDasharray="2,2"/>
    </g>
  );
  if (side === "top") return (
    <g opacity={0.5}>
      <line x1={x} y1={y} x2={x} y2={y + s} stroke="#c9a96e" strokeWidth={0.8}/>
      <path d={`M ${x} ${y} A ${s} ${s} 0 0 0 ${x + s} ${y}`} fill="none" stroke="#c9a96e" strokeWidth={0.6} strokeDasharray="2,2"/>
    </g>
  );
  return null;
}

// ─── STAIR DETAIL ─────────────────────────────────────────────────────────────
function StairDetail({ x, y, w, h }) {
  const steps = 7;
  return (
    <g opacity={0.4}>
      {Array.from({length: steps}).map((_,i) => (
        <line key={i}
          x1={x + 4} y1={y + 4 + i * ((h - 8) / steps)}
          x2={x + w - 4} y2={y + 4 + i * ((h - 8) / steps)}
          stroke="#6a9fb5" strokeWidth={0.8}
        />
      ))}
      {/* Direction arrow */}
      <line x1={x + w/2} y1={y + h - 16} x2={x + w/2} y2={y + 8} stroke="#6a9fb5" strokeWidth={1} markerEnd="url(#stairArrow)"/>
    </g>
  );
}

// ─── ROOM COMPONENT ───────────────────────────────────────────────────────────
function Room({ room, isHovered, onClick }) {
  const { x, y, w, h, id, label, icon, theme, photo, type } = room;
  if (type === "wall") return <rect x={x} y={y} width={w} height={h} fill={room.fill} stroke={room.stroke}/>;
  if (type === "floor") return <rect x={x} y={y} width={w} height={h} fill={room.fill}/>;

  const th = T[theme] || T.utility;
  const clipId = `clip-${id}`;
  const photoSrc = photo ? PHOTOS[photo] : null;
  const isCorridor = theme === "corridor";
  const isSmall = w < 70 || h < 60;
  const isExit = theme === "emergency" || theme === "fire";
  const isStairs = theme === "stairs";

  return (
    <g onClick={onClick} style={{ cursor: "pointer" }}>
      {/* Clip path for photo */}
      {photoSrc && (
        <defs>
          <clipPath id={clipId}>
            <rect x={x} y={y} width={w} height={h}/>
          </clipPath>
        </defs>
      )}

      {/* Room base fill */}
      <rect x={x} y={y} width={w} height={h}
        fill={isCorridor ? th.fill : th.fill}
        rx={isExit ? 0 : 1}
      />

      {/* Photo texture */}
      {photoSrc && (
        <>
          <image href={photoSrc} x={x} y={y} width={w} height={h}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#${clipId})`}
            opacity={isHovered ? 0.5 : 0.28}
            style={{ transition:"opacity 0.2s" }}
          />
          {/* Dark overlay to keep luxury feel */}
          <rect x={x} y={y} width={w} height={h}
            fill={isHovered ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.45)"}
            style={{ transition:"fill 0.2s" }}
          />
        </>
      )}

      {/* Corridor hatching */}
      {isCorridor && (
        <line x1={x} y1={y + h/2} x2={x + w} y2={y + h/2}
          stroke="#2a2520" strokeWidth={0.5} strokeDasharray="6,6" opacity={0.4}/>
      )}

      {/* Stair lines */}
      {isStairs && !isSmall && <StairDetail x={x} y={y} w={w} h={h}/>}

      {/* Room stroke / border */}
      <rect x={x} y={y} width={w} height={h}
        fill="none"
        stroke={isHovered ? th.stroke : (isCorridor ? "#2a2520" : th.wall)}
        strokeWidth={isHovered ? 1.5 : (isCorridor ? 0.5 : 1)}
        rx={1}
      />

      {/* Hover gold border */}
      {isHovered && (
        <rect x={x+1} y={y+1} width={w-2} height={h-2}
          fill="none" stroke={th.stroke} strokeWidth={0.5} opacity={0.5} rx={1}/>
      )}

      {/* Availability dot (top-right corner) */}
      {(theme === "available" || theme === "occupied") && !isSmall && (
        <circle cx={x + w - 10} cy={y + 10} r={5}
          fill={theme === "available" ? "#7eb87e" : "#c97b6e"}
          opacity={0.9}
        />
      )}

      {/* Label */}
      {label && !isCorridor && (
        <>
          {icon && !isSmall && (
            <text x={x + w/2} y={y + h/2 - (isSmall ? 0 : 12)}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={isSmall ? 10 : w > 140 ? 16 : 12}
              style={{ userSelect:"none", pointerEvents:"none" }}>
              {icon}
            </text>
          )}
          <text x={x + w/2} y={y + h/2 + (icon && !isSmall ? 14 : 0)}
            textAnchor="middle" dominantBaseline="middle"
            fontFamily="Jost, sans-serif"
            fontSize={isSmall ? 8 : w > 160 ? 11 : 9}
            letterSpacing={0.8}
            fill={isHovered ? "#e8dcc8" : th.text}
            style={{ userSelect:"none", pointerEvents:"none" }}
          >
            {label.length > 16 ? label.slice(0,15)+"…" : label}
          </text>
        </>
      )}

      {/* Door marks on corridor-facing walls */}
      {!isCorridor && !isExit && !isStairs && !isSmall && theme !== "wall" && (
        <>
          {y < COR_Y && y + h >= COR_Y && (
            <DoorMark x={x + w/2 - 7} y={y + h} side="bottom" size={12}/>
          )}
          {y <= COR_BOT && y + h > COR_BOT && (
            <DoorMark x={x + w/2 - 7} y={y} side="top" size={12}/>
          )}
        </>
      )}
    </g>
  );
}

// ─── NORTH ARROW ──────────────────────────────────────────────────────────────
function NorthArrow({ cx, cy }) {
  return (
    <g opacity={0.6}>
      <circle cx={cx} cy={cy} r={18} fill="none" stroke="#c9a96e" strokeWidth={0.6}/>
      <polygon points={`${cx},${cy-14} ${cx-6},${cy+6} ${cx},${cy} `} fill="#c9a96e"/>
      <polygon points={`${cx},${cy-14} ${cx+6},${cy+6} ${cx},${cy}`} fill="#3a3020"/>
      <text x={cx} y={cy-20} textAnchor="middle" fontSize={9} fontFamily="Jost" fill="#c9a96e">N</text>
    </g>
  );
}

// ─── SCALE BAR ────────────────────────────────────────────────────────────────
function ScaleBar({ x, y }) {
  return (
    <g opacity={0.45}>
      {[0,1,2,3,4].map(i => (
        <rect key={i} x={x+i*16} y={y} width={16} height={5}
          fill={i%2===0 ? "#c9a96e" : "#2a2520"} stroke="#3a3020" strokeWidth={0.3}/>
      ))}
      <text x={x} y={y+14} fontSize={7} fontFamily="Jost" fill="#4a3f32">0</text>
      <text x={x+80} y={y+14} fontSize={7} fontFamily="Jost" fill="#4a3f32">10m</text>
    </g>
  );
}

// ─── FLOOR SVG ────────────────────────────────────────────────────────────────
function FloorSVG({ floorKey, hoveredId, onRoom }) {
  const floor = floors[floorKey];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      <defs>
        <marker id="stairArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M2 2L8 5L2 8" fill="none" stroke="#6a9fb5" strokeWidth={1.5}/>
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Rooms */}
      {floor.rooms.map(room => (
        <g key={room.id} filter={hoveredId === room.id ? "url(#glow)" : undefined}>
          <Room
            room={room}
            isHovered={hoveredId === room.id}
            onClick={() => room.type ? null : onRoom(hoveredId === room.id ? null : room)}
          />
        </g>
      ))}

      {/* Wall lines (inner border of outer wall = building outline) */}
      <rect x={WALL} y={WALL} width={W-WALL*2} height={H-WALL*2}
        fill="none" stroke="#c9a96e" strokeWidth={1} opacity={0.3}/>

      {/* North arrow + scale */}
      <NorthArrow cx={W-32} cy={H-32}/>
      <ScaleBar x={20} y={H-24}/>

      {/* Floor label watermark */}
      <text x={W/2} y={H-6} textAnchor="middle" fontSize={7}
        fontFamily="Jost" letterSpacing={3} fill="#2a2520">
        GRAND VELOUR · {floor.name.toUpperCase()} · NOT TO SCALE
      </text>
    </svg>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function FloorMapPage({ navigate }) {
  const [activeFloor, setActiveFloor] = useState("G");
  const [hoveredRoom, setHoveredRoom] = useState(null);

  return (
    <div style={S.page}>
      <nav style={S.nav}>
        <button style={S.backBtn} onClick={() => navigate("landing")}>← Back to Home</button>
        <div style={S.logo}>GRAND<span style={S.accent}>VELOUR</span></div>
        <button style={S.bookBtn} onClick={() => navigate("book")}>Reserve a Room</button>
      </nav>

      <div style={S.header}>
        <p style={S.eyebrow}>HOTEL DIRECTORY</p>
        <h1 style={S.title}>Floor Map</h1>
        <p style={S.subtitle}>Click any room or area to view details.</p>
      </div>

      <div style={S.body}>
        {/* Sidebar */}
        <div style={S.sidebar}>
          <p style={S.sideLabel}>SELECT FLOOR</p>
          {FLOOR_KEYS.map(k => (
            <button key={k}
              style={{ ...S.floorBtn, ...(activeFloor===k ? S.floorActive : {}) }}
              onClick={() => { setActiveFloor(k); setHoveredRoom(null); }}
            >
              <span style={S.floorNum}>{FLOOR_LABELS[k]}</span>
              <span style={S.floorSub}>{floors[k].subtitle}</span>
            </button>
          ))}

          {/* Info panel */}
          <div style={S.infoPanel}>
            {hoveredRoom ? (
              <>
                <p style={{ ...S.infoName, color: T[hoveredRoom.theme]?.stroke || "#c9a96e" }}>
                  {hoveredRoom.icon && <span style={{ marginRight:6 }}>{hoveredRoom.icon}</span>}
                  {hoveredRoom.label || "Area"}
                </p>
                <div style={{ ...S.pill, borderColor: T[hoveredRoom.theme]?.stroke, color: T[hoveredRoom.theme]?.stroke }}>
                  {hoveredRoom.theme?.toUpperCase()}
                </div>
                <p style={S.infoDesc}>{hoveredRoom.desc}</p>
                {hoveredRoom.theme === "available" && (
                  <button style={S.bookRoomBtn} onClick={() => navigate("book")}>
                    Book This Room →
                  </button>
                )}
              </>
            ) : (
              <p style={S.infoHint}>Click a room to see details</p>
            )}
          </div>

          {/* Legend */}
          <div style={S.legendWrap}>
            <p style={{ ...S.sideLabel, marginTop:16 }}>LEGEND</p>
            {LEGEND.map((l,i) => (
              <div key={i} style={S.legendRow}>
                <div style={{ width:14, height:14, background:T[l.theme]?.fill, border:`1px solid ${T[l.theme]?.stroke}`, flexShrink:0 }}/>
                <span style={S.legendLabel}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div style={S.mapArea}>
          <div style={S.floorTag}>
            <span style={{ color:"#c9a96e", textTransform:"uppercase", letterSpacing:2 }}>
              {floors[activeFloor].name}
            </span>
            <span style={{ color:"#4a3f32" }}> — {floors[activeFloor].subtitle}</span>
          </div>
          <div style={S.svgWrap}>
            <FloorSVG
              floorKey={activeFloor}
              hoveredId={hoveredRoom?.id}
              onRoom={setHoveredRoom}
            />
          </div>
        </div>
      </div>

      <footer style={S.footer}>
        <p style={S.footerTxt}>© 2024 Grand Velour Hotel. All rights reserved.</p>
      </footer>
    </div>
  );
}

const S = {
  page:     { background:"#0a0a08", minHeight:"100vh", color:"#e8dcc8", fontFamily:"'Cormorant Garamond',serif" },
  nav:      { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"18px 48px", borderBottom:"1px solid #1e1a14", position:"sticky", top:0, background:"rgba(10,10,8,0.92)", backdropFilter:"blur(8px)", zIndex:100 },
  backBtn:  { background:"rgba(201,169,110,0.07)", border:"1px solid rgba(201,169,110,0.2)", color:"#a09080", cursor:"pointer", fontFamily:"'Jost',sans-serif", fontSize:"12px", letterSpacing:"1px", padding:"8px 16px" },
  logo:     { fontSize:"20px", fontWeight:600, letterSpacing:"6px" },
  accent:   { color:"#c9a96e" },
  bookBtn:  { background:"#c9a96e", border:"none", color:"#0a0a08", padding:"10px 24px", fontFamily:"'Jost',sans-serif", fontSize:"11px", letterSpacing:"2px", cursor:"pointer", fontWeight:500, textTransform:"uppercase" },
  header:   { textAlign:"center", padding:"44px 48px 20px" },
  eyebrow:  { fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"5px", color:"#c9a96e", margin:"0 0 10px" },
  title:    { fontSize:"48px", fontWeight:300, margin:"0 0 10px" },
  subtitle: { fontFamily:"'Jost',sans-serif", fontSize:"13px", color:"#4a3f32", margin:0 },
  body:     { display:"grid", gridTemplateColumns:"240px 1fr", gap:"24px", padding:"0 48px 48px" },
  sidebar:  { display:"flex", flexDirection:"column", gap:"6px" },
  sideLabel:{ fontFamily:"'Jost',sans-serif", fontSize:"9px", letterSpacing:"3px", color:"#4a3f32", textTransform:"uppercase", margin:"0 0 6px" },
  floorBtn: { background:"#111", border:"1px solid #1e1a14", padding:"12px 14px", cursor:"pointer", textAlign:"left" },
  floorActive:{ border:"1px solid #c9a96e", background:"rgba(201,169,110,0.07)" },
  floorNum: { display:"block", fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", color:"#e8dcc8", marginBottom:2 },
  floorSub: { display:"block", fontFamily:"'Jost',sans-serif", fontSize:"9px", color:"#4a3f32", letterSpacing:"0.5px" },
  infoPanel:{ marginTop:"12px", padding:"16px", border:"1px solid #1e1a14", background:"#111", minHeight:"100px" },
  infoName: { fontFamily:"'Cormorant Garamond',serif", fontSize:"18px", margin:"0 0 8px" },
  pill:     { display:"inline-block", border:"1px solid", fontFamily:"'Jost',sans-serif", fontSize:"8px", letterSpacing:"2px", padding:"2px 8px", marginBottom:"8px" },
  infoDesc: { fontFamily:"'Jost',sans-serif", fontSize:"11px", color:"#6a5f52", lineHeight:1.7, margin:0 },
  infoHint: { fontFamily:"'Jost',sans-serif", fontSize:"11px", color:"#2a2520", margin:0, fontStyle:"italic" },
  bookRoomBtn:{ marginTop:10, background:"none", border:"1px solid #c9a96e", color:"#c9a96e", fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"2px", padding:"6px 12px", cursor:"pointer", textTransform:"uppercase" },
  legendWrap:{ display:"flex", flexDirection:"column", gap:"6px" },
  legendRow: { display:"flex", alignItems:"center", gap:"8px" },
  legendLabel:{ fontFamily:"'Jost',sans-serif", fontSize:"10px", color:"#6a5f52" },
  mapArea:  { display:"flex", flexDirection:"column", gap:"8px" },
  floorTag: { fontFamily:"'Jost',sans-serif", fontSize:"11px", letterSpacing:"2px" },
  svgWrap:  { border:"1px solid #1e1a14", background:"#0a0a08", overflow:"hidden" },
  footer:   { padding:"32px 48px", textAlign:"center", borderTop:"1px solid #1e1a14" },
  footerTxt:{ fontFamily:"'Jost',sans-serif", fontSize:"11px", color:"#2a2520", letterSpacing:"2px" },
};