import GameState from "../GameState"
import GameView, { getPlayers, isGameView } from "../GameView"
import PlayerColor from "../PlayerColor"
import { HuntPhase } from "../types/Phase"
import Move from "./Move"
import MoveType from "./MoveType"

type EndTurn = {
    type:MoveType.EndTurn
    playerId:PlayerColor
}

export default EndTurn

export function endTurn(state:GameState|GameView, move:EndTurn){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    player.huntPhase = HuntPhase.DrawCards
}

export function isEndTurn(move:Move):move is EndTurn{
    return move.type === MoveType.EndTurn
}