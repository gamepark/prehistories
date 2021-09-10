import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import PlayerColor from "../PlayerColor";
import { HuntPhase } from "../types/Phase";
import MoveType from "./MoveType";

type ValidateSpendedHunters = {
    type:MoveType.ValidateSpendedHunters
    playerId:PlayerColor
}

export default ValidateSpendedHunters

export function validateSpendedHunters(state:GameState|GameView, move:ValidateSpendedHunters){
   
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    if (player.huntSpotTakenLevels![1] > 0){
        player.injuries = player.injuries === undefined ? 1 : player.injuries ++
    }
    delete player.huntSpotTakenLevels
    player.huntPhase = HuntPhase.PermanentObjectives

}