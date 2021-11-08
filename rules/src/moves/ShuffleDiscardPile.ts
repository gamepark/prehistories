import GameState from "../GameState";
import GameView from "../GameView";
import {getFirstOfSortedPlayer, getPlayers, isNotPlayerState} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type ShuffleDiscardPile = {
  type: MoveType.ShuffleDiscardPile
  shuffledCards: number[]
}

export type ShuffleDiscardPileView = {
  type: MoveType.ShuffleDiscardPile
}

export default ShuffleDiscardPile

export function shuffleDiscardPile(state: GameState, move: ShuffleDiscardPile) {
  const player = getFirstOfSortedPlayer(state)
  player.deck.push(...move.shuffledCards)
  player.discard = []
}

export function shuffleDiscardPileInView(state: GameView) {
  const player = getPlayers(state).filter(isNotPlayerState).find(p => p.color === state.sortedPlayers![0])!
  player.deck += player.discard.length
  player.discard = []
}

export function isShuffleDiscardPile(move: Move | MoveView): move is ShuffleDiscardPile {
  return move.type === MoveType.ShuffleDiscardPile
}