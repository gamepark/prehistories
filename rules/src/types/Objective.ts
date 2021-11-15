import PlayerState from "../PlayerState"
import {PlayerView, PlayerViewSelf} from "./PlayerView"

type Objective = {
    text:string,
    hint:string
    value:number,
    rule:(player:PlayerState | PlayerView | PlayerViewSelf) => boolean
    squaresIfFulfilled?:(player:PlayerState | PlayerView | PlayerViewSelf) => boolean[][] | undefined
}

export default Objective