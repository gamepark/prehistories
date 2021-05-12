import Animal from "./Animal"
import Coordinates from "./Coordinates"

type Polyomino = [PolyominoSide, PolyominoSide]

type PolyominoSide = {
    animal : Animal,
    coordinates:Coordinates[]
}

export default Polyomino