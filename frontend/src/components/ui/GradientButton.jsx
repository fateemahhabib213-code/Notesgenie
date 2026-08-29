export default function GradientButton({
  children,
  className = "",
  variant = "solid",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium text-sm transition-all active:translate-y-px disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none";

  const variants = {
    solid:
      "px-5 py-2.5 text-white bg-gradient-to-r from-violet to-brown shadow-[0_4px_20px_-4px_rgba(139,92,246,0.6)] hover:shadow-[0_6px_28px_-4px_rgba(139,92,246,0.75)]",
    icon:
      "w-10 h-10 text-white bg-gradient-to-r from-violet to-brown shadow-[0_4px_20px_-4px_rgba(139,92,246,0.6)] hover:shadow-[0_6px_28px_-4px_rgba(139,92,246,0.75)]",
    ghost:
      "px-4 py-2 text-text-soft border border-white/10 hover:border-white/20 hover:text-text bg-white/[0.03] hover:bg-white/[0.06]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
