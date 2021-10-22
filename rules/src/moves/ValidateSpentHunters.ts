import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { HuntPhase } from "../types/Phase";
import MoveType from "./MoveType";

type ValidateSpentHunters = {
    type:MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state:GameState|GameView){
   
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === state.sortedPlayers![0])! : state.players.find(p => p.color === state.sortedPlayers![0])!
    if (player.huntSpotTakenLevels![1] > 0){
        if (player.injuries === undefined || player.injuries === 0){
            player.injuries = 1
        } else {
            player.injuries++
        }
    }
    delete player.huntSpotTakenLevels
    player.huntPhase = HuntPhase.CheckPermanentObjectives

}