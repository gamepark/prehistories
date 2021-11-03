type Coordinates = {
  x: number,
  y: number
}

export default Coordinates

export function getAdjacentCoordinates({x, y}: Coordinates): Coordinates[] {
  return [{x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}]
}