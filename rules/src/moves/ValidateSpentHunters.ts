import GameState from "../GameState";
import GameView from "../GameView";
import HuntingProps from "../types/HuntingProps";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer} from "../types/PlayerView";
import MoveType from "./MoveType";

type ValidateSpentHunters = {
    type:MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state:GameState|GameView){
   
    const player = getFirstOfSortedPlayer(state)
    setPlayerInjuries(player.huntingProps!)
    delete player.huntingProps!.huntSpotTakenLevels
    player.huntingProps!.huntPhase = HuntPhase.CheckPermanentObjectives

}

function setPlayerInjuries(playerHuntingProps:HuntingProps){
    if (playerHuntingProps.huntSpotTakenLevels![1] > 0){
        playerHuntingProps.injuries = (playerHuntingProps.injuries ?? 0)+1 
    }
}