import { getColoredDeck } from "../material/Hunters"
import PlayerColor from "../PlayerColor"

/**
 * @return the power of a group of hunters. Returns 0 if arg array is empty
 */
function teamPower(hunters:number[]):number{
    return hunters.length === 0 ? 0 : hunters.reduce((acc, hunter) => acc + getColoredDeck(PlayerColor.Yellow)[hunter].power,0)
}

export default teamPower