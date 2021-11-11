import GameState from "../GameState"
import GameView from "../GameView"
import {playerCouldDraw} from "../Prehistories"
import {HuntPhase} from "../types/Phase"
import {getFirstOfSortedPlayer, isPlayerViewSelf} from "../types/PlayerView"
import Move from "./Move"
import MoveType from "./MoveType"
import MoveView from "./MoveView"

type DrawCards = {
  type: MoveType.DrawCards
}

export default DrawCards

export type DrawCardsView = {
  type: MoveType.DrawCards
  cards: number[]
}

export function drawCards(state: GameState) {
  const player = getFirstOfSortedPlayer(state)
  player.hand.push(...player.deck.splice(0, Math.min(playerCouldDraw(player), player.deck.length)))
  player.hunting!.huntPhase = HuntPhase.ChangeActivePlayer
}

export function drawCardsInView(state: GameView, move: DrawCards | DrawCardsView) {
  const player = state.players.find(player => player.color === state.sortedPlayers![0])!
  player.deck = Math.max(player.deck - playerCouldDraw(player), 0)
  if (isPlayerViewSelf(player)) {
    if (!isDrawCardsView(move)) throw 'Error: I should receive the information about the cards that I draw'
    player.hand.push(...move.cards)
  } else {
    player.hand = Math.min(player.hand + playerCouldDraw(player), player.hand + player.deck)
  }
  player.hunting!.huntPhase = HuntPhase.ChangeActivePlayer
}

export function isDrawCards(move: Move | MoveView): move is DrawCards {
  return move.type === MoveType.DrawCards
}

export function isDrawCardsView(move: DrawCards | DrawCardsView): move is DrawCardsView {
  return move.hasOwnProperty('cards')
}