export type ImageBlockProps = {
  src: string;
  alt: string;
  caption?: string;
};

export function ImageBlock({ src, alt, caption }: ImageBlockProps) {
  return (
    <figure style={{ margin: "2rem auto", maxWidth: 1120, padding: "0 1.5rem" }}>
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
      />
      {caption && (
        <figcaption
          style={{
            marginTop: "0.75rem",
            fontSize: "0.9rem",
            color: "#6b7280",
            textAlign: "center",
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
