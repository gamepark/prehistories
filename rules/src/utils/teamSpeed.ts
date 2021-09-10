import { getColoredDeck } from "../material/Hunters"
import PlayerColor from "../PlayerColor"

/**
 * @return the best speed of a group of hunters. Returns 0 if arg array is empty
 */
function teamSpeed(hunters:number[]):number{
    const deck = []
    for (const elem of hunters){
        deck.push(getColoredDeck(PlayerColor.Yellow)[elem].speed)
    }
    return hunters.length === 0 ? 0 : Math.max(...deck)
}

export default teamSpeed