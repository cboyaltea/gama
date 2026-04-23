export type HeadingProps = {
  text: string;
  level: "h1" | "h2" | "h3";
  align: "left" | "center";
};

export function Heading({ text, level, align }: HeadingProps) {
  const Tag = level;
  const sizes: Record<HeadingProps["level"], string> = {
    h1: "clamp(2rem, 4vw, 3rem)",
    h2: "clamp(1.5rem, 3vw, 2.2rem)",
    h3: "1.25rem",
  };
  return (
    <div style={{ padding: "1rem 1.5rem", maxWidth: 960, margin: "0 auto" }}>
      <Tag
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontSize: sizes[level],
          textAlign: align,
          margin: 0,
          color: "#0f1b2d",
        }}
      >
        {text}
      </Tag>
    </div>
  );
}
