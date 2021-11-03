import PlayerState from "../PlayerState"
import Face from "./Face"
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "./PlayerView"

type Goal = {
    face:Face,
    text:string,
    hint:string
    value:number,
    rule:(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => boolean
}

export default Goal