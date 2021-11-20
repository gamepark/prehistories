import PlayerColor from "@gamepark/prehistories/PlayerColor";
import GameLocalView from "../GameLocalView";

export const SET_CAVE_DISPLAYED = 'SetCaveDisplayed'

export default interface SetCaveDisplayed {
  type: typeof SET_CAVE_DISPLAYED
  color: PlayerColor
}

export const setCaveDisplayedMove = (color: PlayerColor): SetCaveDisplayed => ({
  type: SET_CAVE_DISPLAYED, color
})

export function setCaveDisplayed(state: GameLocalView, move: SetCaveDisplayed) {
  state.caveDisplayed = move.color
}

export function getCaveDisplayed(game: GameLocalView, playerId?: PlayerColor): PlayerColor {
  return game.caveDisplayed ?? playerId ?? game.players[0].color
}