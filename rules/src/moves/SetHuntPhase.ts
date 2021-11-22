import GameState from "../GameState";
import GameView from "../GameView";
import {HuntPhase} from "../types/Phase";
import MoveType from "./MoveType";
import {getHuntingPlayer} from "../types/HuntingPlayer";

type SetHuntPhase = {
    type:MoveType.SetHuntPhase
}

export default SetHuntPhase

export function setHuntPhase(state:GameState | GameView){
    getHuntingPlayer(state)!.hunting.huntPhase = HuntPhase.Hunt
}