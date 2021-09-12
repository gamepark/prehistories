import GameState from "../GameState";
import GameView from "../GameView";
import MoveType from "./MoveType";

type EndGame = {
    type:MoveType.EndGame
}

export default EndGame

export function endGame(state:GameState|GameView, move:EndGame){
    delete state.phase
}