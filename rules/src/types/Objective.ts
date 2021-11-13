import PlayerState from "../PlayerState"
import {PlayerView, PlayerViewSelf} from "./PlayerView"

type Objective = {
    text:string,
    hint:string
    value:number,
    rule:(player:PlayerState | PlayerView | PlayerViewSelf) => boolean
}

export default Objective