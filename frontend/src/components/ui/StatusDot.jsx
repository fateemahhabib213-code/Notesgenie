export default function StatusDot({ color = "success" }) {
  const colors = {
    success: "bg-success",
    danger: "bg-danger",
    idle: "bg-text-faint",
  };

  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`animate-pulse-soft absolute inline-flex h-full w-full rounded-full ${colors[color]} opacity-75`}
      />
      <span className={`relative inline-flex rounded-full h-2 w-2 ${colors[color]}`} />
    </span>
  );
}
