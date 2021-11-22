import GameState from "../GameState";
import GameView from "../GameView";
import {HuntPhase} from "../types/Phase";
import {getPlayers} from "../types/PlayerView";
import MoveType from "./MoveType";
import {getNextPlayer} from "../utils/InitiativeRules";

type ChangeActivePlayer = {
    type:MoveType.ChangeActivePlayer
}

export default ChangeActivePlayer

export function changeActivePlayer(state:GameState|GameView){
    const previousPlayer = getPlayers(state).find(p => p.hunting)!
    delete previousPlayer.hunting
    const nextPlayer = getNextPlayer(state);
    if (nextPlayer) {
        nextPlayer.hunting = {huntPhase : HuntPhase.Hunt,injuries:0,tilesHunted:0,huntSpotTakenLevels:undefined}
    } 
}
