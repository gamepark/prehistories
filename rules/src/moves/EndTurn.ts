import GameState from "../GameState"
import GameView from "../GameView"
import Move from "./Move"
import MoveType from "./MoveType"
import PlayerColor from "../PlayerColor";
import {getPlayerWithColor} from "../types/PlayerView";

type EndTurn = {
  type: MoveType.EndTurn
  player: PlayerColor
}

export default EndTurn

export function endTurnMove(player: PlayerColor): EndTurn {
  return {type: MoveType.EndTurn, player}
}

export function endTurn(state: GameState | GameView, move: EndTurn) {
  const player = getPlayerWithColor(state, move.player)
  player.isReady = true
}

export function isEndTurn(move: Move): move is EndTurn {
  return move.type === MoveType.EndTurn
}