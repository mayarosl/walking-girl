export function calculateTileCoordinate({
  tileNumber = 0,
  columns = 16,
  width = 64,
  height = 64
}) {
  const x = (tileNumber % columns) * width;
  const y = Math.floor(tileNumber / columns) * height;
  return { x, y }
}