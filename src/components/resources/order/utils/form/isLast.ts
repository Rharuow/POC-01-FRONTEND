export function isLast({
  position,
  length,
}: {
  position: number;
  length: number;
}) {
  return position === length - 1;
}
