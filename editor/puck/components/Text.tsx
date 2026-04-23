export type TextProps = {
  body: string;
  align: "left" | "center";
};

export function Text({ body, align }: TextProps) {
  return (
    <div style={{ padding: "0.5rem 1.5rem 1rem", maxWidth: 720, margin: "0 auto" }}>
      <p style={{ textAlign: align, lineHeight: 1.7, color: "#3a465a", fontSize: "1rem" }}>
        {body}
      </p>
    </div>
  );
}
