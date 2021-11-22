import GameState from "../GameState";
import GameView from "../GameView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";
import PlayerColor from "../PlayerColor";

type ShuffleDiscardPile = {
  type: MoveType.ShuffleDiscardPile
  player: PlayerColor
  shuffledCards: number[]
}

export type ShuffleDiscardPileView = Omit<ShuffleDiscardPile, 'shuffledCards'>

export default ShuffleDiscardPile

export const shuffleDiscardPileMove = (player: PlayerColor, shuffledCards: number[]): ShuffleDiscardPile => (
  {type: MoveType.ShuffleDiscardPile, player, shuffledCards}
)

export function shuffleDiscardPile(state: GameState, move: ShuffleDiscardPile) {
  const player = state.players.find(p => p.color === move.player)!
  player.deck.push(...move.shuffledCards)
  player.discard = []
}

export function shuffleDiscardPileInView(state: GameView, move: ShuffleDiscardPileView) {
  const player = state.players.find(p => p.color === move.player)!
  player.deck += player.discard.length
  player.discard = []
}

export function isShuffleDiscardPile(move: Move | MoveView): move is ShuffleDiscardPile {
  return move.type === MoveType.ShuffleDiscardPile
}