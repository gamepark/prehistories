import GameState from "../GameState";
import GameView from "../GameView";
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
        nextPlayer.hunting = {injuries: 0, tilesHunted: 0}
    } 
}
