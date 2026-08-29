import { useMemo } from "react";
import {
  FileText,
  BookOpen,
  Code2,
  BarChart3,
  Brain,
  Network,
  GraduationCap,
  FlaskConical,
  Binary,
  Sigma,
  ScrollText,
  Database,
  Cpu,
  Layers,
} from "lucide-react";

const ICONS = [
  FileText,
  BookOpen,
  Code2,
  BarChart3,
  Brain,
  Network,
  GraduationCap,
  FlaskConical,
  Binary,
  Sigma,
  ScrollText,
  Database,
  Cpu,
  Layers,
];

// Deep navy / violet / brown tones only — kept within the app's palette
// so the collage reads as atmosphere, not as competing UI.
const PALETTES = [
  { from: "#2c2140", to: "#160f22", accent: "#a78bfa" }, // violet
  { from: "#3a2a18", to: "#1c1309", accent: "#d59a5c" }, // brown / copper
  { from: "#191b30", to: "#0c0d19", accent: "#8ba4d9" }, // navy
  { from: "#332040", to: "#180f22", accent: "#c084fc" }, // plum
  { from: "#2a2438", to: "#141220", accent: "#a89bc7" }, // slate-violet
  { from: "#3a2e1c", to: "#1c1610", accent: "#e0b57e" }, // warm caramel
];

function buildDeck(seedOffset) {
  return Array.from({ length: 14 }, (_, i) => {
    const idx = (i + seedOffset) % ICONS.length;
    return {
      Icon: ICONS[idx],
      palette: PALETTES[(i + seedOffset) % PALETTES.length],
      wide: i % 5 === 0,
    };
  });
}

function DocumentCard({ card }) {
  const { Icon, palette, wide } = card;
  return (
    <div
      className={`relative shrink-0 rounded-xl overflow-hidden border border-white/[0.06] ${
        wide ? "w-[148px] h-[128px]" : "w-[128px] h-[178px]"
      }`}
      style={{
        background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-1"
        style={{ background: palette.accent, opacity: 0.55 }}
      />
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.16]">
        <Icon size={wide ? 46 : 60} color={palette.accent} strokeWidth={1.4} />
      </div>
      <div className="absolute bottom-3.5 left-3.5 right-3.5 flex flex-col gap-1.5">
        <div
          className="h-[3px] rounded-full"
          style={{ width: "72%", background: "rgba(255,255,255,0.09)" }}
        />
        <div
          className="h-[3px] rounded-full"
          style={{ width: "46%", background: "rgba(255,255,255,0.07)" }}
        />
      </div>
    </div>
  );
}

function CardColumn({ seedOffset, duration, direction }) {
  const deck = useMemo(() => buildDeck(seedOffset), [seedOffset]);
  const loopDeck = [...deck, ...deck];

  return (
    <div className="relative h-full overflow-hidden">
      <div
        className={`flex flex-col gap-4 ${
          direction === "down" ? "animate-drift-down" : "animate-drift-up"
        }`}
        style={{ animationDuration: `${duration}s` }}
      >
        {loopDeck.map((card, i) => (
          <DocumentCard card={card} key={i} />
        ))}
      </div>
    </div>
  );
}

const COLUMNS = [
  { seedOffset: 0, duration: 46, direction: "up", start: "-mt-10" },
  { seedOffset: 2, duration: 58, direction: "down", start: "mt-6" },
  { seedOffset: 4, duration: 39, direction: "up", start: "-mt-4" },
  { seedOffset: 6, duration: 52, direction: "down", start: "mt-10" },
  { seedOffset: 8, duration: 44, direction: "up", start: "-mt-8" },
  { seedOffset: 10, duration: 60, direction: "down", start: "mt-2" },
  { seedOffset: 12, duration: 41, direction: "up", start: "-mt-6" },
];

export default function AnimatedBackground() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10 overflow-hidden bg-bg">
      {/* Layer 1 + 2: document card collage, blurred and dimmed */}
      <div className="hidden md:flex absolute inset-0 gap-4 px-6 opacity-[0.32] blur-[1.5px]">
        {COLUMNS.map((col, i) => (
          <div key={i} className={`flex-1 ${col.start}`} style={{ height: "140%" }}>
            <CardColumn
              seedOffset={col.seedOffset}
              duration={col.duration}
              direction={col.direction}
            />
          </div>
        ))}
      </div>

      {/* Layer 3: dark navy/purple gradient overlay for readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(13,11,20,0.55) 0%, rgba(11,9,16,0.88) 55%, rgba(9,8,13,0.97) 100%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,9,15,0.75) 0%, rgba(10,9,15,0.4) 20%, rgba(10,9,15,0.55) 70%, rgba(10,9,15,0.9) 100%)",
        }}
      />

      {/* Layer 4: soft ambient glow, same palette as the rest of the app */}
      <div
        className="absolute -top-40 -left-20 w-[520px] h-[520px] rounded-full opacity-30 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/4 -right-32 w-[480px] h-[480px] rounded-full opacity-25 blur-3xl animate-float-slow-delayed"
        style={{ background: "radial-gradient(circle, #b8763f 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl animate-float-slow"
        style={{ background: "radial-gradient(circle, #6b4a7a 0%, transparent 70%)" }}
      />
    </div>
  );
}
