import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer, PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type ValidateSpentHunters = {
    type:MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state:GameState|GameView){
   
    const player = getFirstOfSortedPlayer(state)
    setPlayerInjuries(player)
    delete player.huntSpotTakenLevels
    player.huntPhase = HuntPhase.CheckPermanentObjectives

}

function setPlayerInjuries(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView){
    if (player.huntSpotTakenLevels![1] > 0){
        player.injuries = (player.injuries ?? 0)+1 
    }
}