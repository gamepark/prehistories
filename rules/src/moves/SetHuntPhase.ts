import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import PlayerColor from "../PlayerColor";
import { HuntPhase } from "../types/Phase";
import MoveType from "./MoveType";

type SetHuntPhase = {
    type:MoveType.SetHuntPhase
    playerId:PlayerColor
}

export default SetHuntPhase

export function setHuntPhase(state:GameState | GameView, move:SetHuntPhase){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    if (player.huntPhase === HuntPhase.CheckPermanentObjectives){
        player.huntPhase = HuntPhase.CheckVariableObjectives
    } else if (player.huntPhase === HuntPhase.CheckVariableObjectives){
        player.huntPhase = HuntPhase.Hunt
    }
}