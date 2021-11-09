import GameState from "../GameState";
import GameView from "../GameView";
import {HuntPhase} from "../types/Phase";
import {getFirstOfSortedPlayer} from "../types/PlayerView";
import MoveType from "./MoveType";

type ChangeActivePlayer = {
    type:MoveType.ChangeActivePlayer
}

export default ChangeActivePlayer

export function changeActivePlayer(state:GameState|GameView){
    const previousPlayer = getFirstOfSortedPlayer(state)
    delete previousPlayer.hunting
    state.sortedPlayers!.shift()
    if (state.sortedPlayers!.length !== 0){
        getFirstOfSortedPlayer(state).hunting = {huntPhase : HuntPhase.Hunt,injuries:0,tilesHunted:0,huntSpotTakenLevels:undefined}
    } 
}
