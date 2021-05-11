import Animal from "./Animal"
import Shape from "./Shape"
import Square from "./Square"

type Polyomino = [PolyominoSide, PolyominoSide]

type PolyominoSide = {
    animal : Animal,
    size : number,
    shape : Shape,
    squares : Square[]
}

export default Polyomino