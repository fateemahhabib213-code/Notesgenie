export default function GlassCard({ children, className = "", glow = false, ...props }) {
  return (
    <div
      className={`relative rounded-2xl border border-white/[0.12] bg-white/[0.06] backdrop-blur-xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.5)] ${
        glow ? "shadow-[0_0_40px_-8px_rgba(139,92,246,0.4),0_8px_32px_-8px_rgba(0,0,0,0.5)]" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
