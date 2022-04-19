export function getTimestampPepper(): string {
  const d = new Date().toISOString().split(":");
  d.pop();
  return d.join(":");
}
