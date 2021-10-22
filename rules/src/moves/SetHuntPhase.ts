import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { HuntPhase } from "../types/Phase";
import MoveType from "./MoveType";

type SetHuntPhase = {
    type:MoveType.SetHuntPhase
}

export default SetHuntPhase

export function setHuntPhase(state:GameState | GameView){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === state.sortedPlayers![0])! : state.players.find(p => p.color === state.sortedPlayers![0])!
    if (player.huntPhase === HuntPhase.CheckPermanentObjectives){
        player.huntPhase = HuntPhase.CheckVariableObjectives
    } else if (player.huntPhase === HuntPhase.CheckVariableObjectives){
        player.huntPhase = HuntPhase.Hunt
    }
}