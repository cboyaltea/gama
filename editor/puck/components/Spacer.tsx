export type SpacerProps = {
  size: "sm" | "md" | "lg";
};

export function Spacer({ size }: SpacerProps) {
  const heights: Record<SpacerProps["size"], string> = {
    sm: "1.5rem",
    md: "3rem",
    lg: "6rem",
  };
  return <div style={{ height: heights[size] }} aria-hidden="true" />;
}
