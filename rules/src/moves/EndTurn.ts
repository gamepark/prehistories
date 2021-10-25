import GameState from "../GameState"
import GameView from "../GameView"
import { HuntPhase } from "../types/Phase"
import { getFirstOfSortedPlayer } from "../types/PlayerView"
import Move from "./Move"
import MoveType from "./MoveType"

type EndTurn = {
    type:MoveType.EndTurn
}

export default EndTurn

export function endTurn(state:GameState|GameView){
    getFirstOfSortedPlayer(state).huntPhase = HuntPhase.DrawCards
}

export function isEndTurn(move:Move):move is EndTurn{
    return move.type === MoveType.EndTurn
}