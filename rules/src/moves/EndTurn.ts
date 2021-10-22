import GameState from "../GameState"
import GameView, { getPlayers, isGameView } from "../GameView"
import { HuntPhase } from "../types/Phase"
import Move from "./Move"
import MoveType from "./MoveType"

type EndTurn = {
    type:MoveType.EndTurn
}

export default EndTurn

export function endTurn(state:GameState|GameView){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === state.sortedPlayers![0])! : state.players.find(p => p.color === state.sortedPlayers![0])!
    player.huntPhase = HuntPhase.DrawCards
}

export function isEndTurn(move:Move):move is EndTurn{
    return move.type === MoveType.EndTurn
}