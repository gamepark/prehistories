import GameState from "../GameState"
import GameView from "../GameView"
import {playerWillDraw} from "../Prehistories"
import {isPlayerViewSelf} from "../types/PlayerView"
import Move from "./Move"
import MoveType from "./MoveType"
import MoveView from "./MoveView"
import PlayerColor from "../PlayerColor";
import {getNextPlayer} from "../utils/InitiativeRules";
import PlayerState from "../PlayerState";

type DrawCards = {
  type: MoveType.DrawCards
  player: PlayerColor
}

export default DrawCards

export type DrawCardsView = DrawCards & {
  cards: number[]
}

export function drawCardsMove(player: PlayerColor): DrawCards {
  return {type: MoveType.DrawCards, player}
}

export function drawCards(state: GameState, move: DrawCards) {
  const player = state.players.find(p => p.color === move.player)!
  player.hand.push(...player.deck.splice(0, playerWillDraw(player)))
  changeHuntingPlayer(state, player)
}

function changeHuntingPlayer(state: GameState | GameView, player: Pick<PlayerState, 'isReady' | 'hunting'>) {
  if (player.hunting) {
    delete player.isReady
    delete player.hunting
    const nextPlayer = getNextPlayer(state);
    if (nextPlayer) {
      nextPlayer.hunting = {injuries: 0, tilesHunted: 0}
    }
  }
}

export function drawCardsInView(state: GameView, move: DrawCards | DrawCardsView) {
  const player = state.players.find(p => p.color === move.player)!
  if (isPlayerViewSelf(player)) {
    if (!isDrawCardsView(move)) throw 'Error: I should receive the information about the cards that I draw'
    player.deck -= move.cards.length
    player.hand.push(...move.cards)
  } else {
    const numberOfCards = playerWillDraw(player);
    player.deck -= numberOfCards
    player.hand += numberOfCards
  }
  changeHuntingPlayer(state, player)
}

export function isDrawCards(move: Move | MoveView): move is DrawCards {
  return move.type === MoveType.DrawCards
}

export function isDrawCardsView(move: DrawCards | DrawCardsView): move is DrawCardsView {
  return move.hasOwnProperty('cards')
}