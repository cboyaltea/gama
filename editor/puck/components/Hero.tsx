export type HeroProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  background: "dark" | "light" | "accent";
};

const palette: Record<HeroProps["background"], { bg: string; fg: string; accent: string }> = {
  dark: { bg: "#0f1b2d", fg: "#ffffff", accent: "#b08a4a" },
  light: { bg: "#f6f4f0", fg: "#0f1b2d", accent: "#b08a4a" },
  accent: { bg: "#b08a4a", fg: "#ffffff", accent: "#0f1b2d" },
};

export function Hero({ eyebrow, title, subtitle, ctaLabel, ctaHref, background }: HeroProps) {
  const p = palette[background];
  return (
    <section
      style={{
        background: p.bg,
        color: p.fg,
        padding: "clamp(4rem, 10vw, 7rem) 1.5rem",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {eyebrow && (
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: p.accent,
              margin: 0,
            }}
          >
            {eyebrow}
          </p>
        )}
        <h1
          style={{
            fontFamily: '"Playfair Display", Georgia, serif',
            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
            lineHeight: 1.1,
            margin: "0.6em 0 0.4em",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p style={{ fontSize: "1.1rem", maxWidth: 640, opacity: 0.85 }}>{subtitle}</p>
        )}
        {ctaLabel && ctaHref && (
          <a
            href={ctaHref}
            style={{
              display: "inline-block",
              marginTop: "1.5rem",
              padding: "0.85rem 1.5rem",
              borderRadius: 999,
              background: p.accent,
              color: background === "accent" ? "#ffffff" : p.bg,
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {ctaLabel}
          </a>
        )}
      </div>
    </section>
  );
}
