import PlayerState from "../PlayerState"
import Face from "./Face"
import { PlayerView, PlayerViewSelf } from "./PlayerView"

type Goal = {
    face:Face,
    text:string,
    hint:string
    value:number,
    rule:(player:PlayerState | PlayerView | PlayerViewSelf) => boolean
}

export default Goal