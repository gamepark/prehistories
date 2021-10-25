import GameState from "../GameState";
import GameView from "../GameView";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer } from "../types/PlayerView";
import MoveType from "./MoveType";

type SetHuntPhase = {
    type:MoveType.SetHuntPhase
}

export default SetHuntPhase

export function setHuntPhase(state:GameState | GameView){
    const player = getFirstOfSortedPlayer(state)
    if (player.huntPhase === HuntPhase.CheckPermanentObjectives){
        player.huntPhase = HuntPhase.CheckVariableObjectives
    } else if (player.huntPhase === HuntPhase.CheckVariableObjectives){
        player.huntPhase = HuntPhase.Hunt
    }
}