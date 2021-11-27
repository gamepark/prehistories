import GameState from "../GameState"
import GameView from "../GameView"
import PlayerColor from "../PlayerColor"
import {isPlayerViewSelf} from "../types/PlayerView"
import Move from "./Move"
import MoveType from "./MoveType"
import MoveView from "./MoveView"
import {compareInitiative, getNextPlayer} from "../utils/InitiativeRules"

type RevealHuntCards = {
  type: MoveType.RevealHuntCards
}

export default RevealHuntCards

type CardsPlayedObject = { color: PlayerColor, cards: number[] }

export type RevealHuntCardsView = RevealHuntCards & {
  cardsPlayed: CardsPlayedObject[]
}

export function revealHuntCards(state: GameState | GameView) {
  const players = [...state.players]
  players.sort(compareInitiative)
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    player.order = i
    delete player.isReady
  }
  const firstPlayer = getNextPlayer(state)
  if (firstPlayer) {
    firstPlayer.hunting = {injuries: 0, tilesHunted: 0}
  }
}

export function revealHuntCardsInView(state: GameView, move: RevealHuntCardsView) {
  for (const player of state.players) {
    player.played = move.cardsPlayed.find(obj => obj.color === player.color)!.cards
    if (!isPlayerViewSelf(player)) {
      player.hand -= player.played.length
    }
  }
  revealHuntCards(state)
}

export function isRevealHuntCards(move: Move | MoveView): move is RevealHuntCards {
  return move.type === MoveType.RevealHuntCards
}
