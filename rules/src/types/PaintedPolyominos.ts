import Coordinates from "./Coordinates"

type PaintedPolyominos = {
    polyomino:number,
    side: 0 | 1
} & Coordinates

export default PaintedPolyominos