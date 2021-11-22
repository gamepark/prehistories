import GameState from "../GameState"
import GameView from "../GameView"
import {HuntPhase} from "../types/Phase"
import Move from "./Move"
import MoveType from "./MoveType"
import {getHuntingPlayer} from "../types/HuntingPlayer";

type EndTurn = {
    type:MoveType.EndTurn
}

export default EndTurn

export function endTurn(state:GameState|GameView){
    getHuntingPlayer(state)!.hunting.huntPhase = HuntPhase.DrawCards
}

export function isEndTurn(move:Move):move is EndTurn{
    return move.type === MoveType.EndTurn
}