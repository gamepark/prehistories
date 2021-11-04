import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer, PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type ChangeActivePlayer = {
    type:MoveType.ChangeActivePlayer
}

export default ChangeActivePlayer

export function changeActivePlayer(state:GameState|GameView){
    cleanPlayerProperties(getFirstOfSortedPlayer(state))
    state.sortedPlayers!.shift()
    if (state.sortedPlayers!.length !== 0){
        getFirstOfSortedPlayer(state).hunting = {huntPhase : HuntPhase.Hunt,injuries:0,tilesHunted:0,huntSpotTakenLevels:undefined}
    } 
}

function cleanPlayerProperties(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView){
    delete player.hunting

}