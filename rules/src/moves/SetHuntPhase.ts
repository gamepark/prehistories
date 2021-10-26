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
    const playerHuntingProperties = getFirstOfSortedPlayer(state).huntingProps!
    if (playerHuntingProperties.huntPhase === HuntPhase.CheckPermanentObjectives){
        playerHuntingProperties.huntPhase = HuntPhase.CheckVariableObjectives
    } else if (playerHuntingProperties.huntPhase === HuntPhase.CheckVariableObjectives){
        playerHuntingProperties.huntPhase = HuntPhase.Hunt
    }
}