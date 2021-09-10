import Animal from "./Animal"
import Coordinates from "./Coordinates"

type Polyomino = [PolyominoSide, PolyominoSide]

type PolyominoSide = {
    animal : Animal,
    coordinates:Coordinates[]
}

export type PaintedSquare = {
    animal : Animal
} & Coordinates

export default Polyomino