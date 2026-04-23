export type ButtonProps = {
  label: string;
  href: string;
  variant: "solid" | "outline";
};

export function Button({ label, href, variant }: ButtonProps) {
  const isSolid = variant === "solid";
  return (
    <div style={{ padding: "1rem 1.5rem", textAlign: "center" }}>
      <a
        href={href}
        style={{
          display: "inline-block",
          padding: "0.85rem 1.6rem",
          borderRadius: 999,
          fontWeight: 600,
          textDecoration: "none",
          background: isSolid ? "#b08a4a" : "transparent",
          color: isSolid ? "#ffffff" : "#0f1b2d",
          border: isSolid ? "1px solid transparent" : "1px solid #0f1b2d",
        }}
      >
        {label}
      </a>
    </div>
  );
}
