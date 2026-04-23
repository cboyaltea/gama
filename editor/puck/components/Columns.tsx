export type ColumnsProps = {
  columns: { title: string; body: string }[];
};

export function Columns({ columns }: ColumnsProps) {
  return (
    <section style={{ padding: "3rem 1.5rem", maxWidth: 1120, margin: "0 auto" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(1, columns.length)}, 1fr)`,
          gap: "1.5rem",
        }}
      >
        {columns.map((col, i) => (
          <div
            key={i}
            style={{
              padding: "1.5rem",
              background: "#f6f4f0",
              borderRadius: 12,
              border: "1px solid #e5e2db",
            }}
          >
            <h3
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                margin: "0 0 0.5rem",
                fontSize: "1.15rem",
                color: "#0f1b2d",
              }}
            >
              {col.title}
            </h3>
            <p style={{ margin: 0, color: "#3a465a", fontSize: "0.95rem", lineHeight: 1.6 }}>
              {col.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
