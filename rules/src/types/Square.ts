import Animal from "./Animal"
import Coordinates from "./Coordinates"

type Square = {
    animal:Animal | undefined
    coordinates:Coordinates
}

export default Square