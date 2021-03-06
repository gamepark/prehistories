import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import {getPlayerWithColor, isPlayerViewSelf, PlayerViewSelf} from "../types/PlayerView";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type PlayHuntCard = {
  type: MoveType.PlayHuntCard
  player: PlayerColor
  card: number
}

export default PlayHuntCard

export type PlayHuntCardView = Omit<PlayHuntCard, 'card'>

export function playHuntCardMove(player: PlayerColor, card: number): PlayHuntCard {
  return {type: MoveType.PlayHuntCard, player, card}
}

export function playHuntCard(state: GameState, move: PlayHuntCard) {
  const player = getPlayerWithColor(state, move.player) as PlayerState
  playerPlayHuntCard(player, move)
}

function playerPlayHuntCard(player: PlayerState | PlayerViewSelf, move: PlayHuntCard) {
  player.hand.splice(player.hand.findIndex(card => move.card === card), 1)
  player.played.push(move.card)
}

export function playHuntCardInView(state: GameView, move: PlayHuntCardView) {
  if (isPlayHuntCard(move)) {
    playerPlayHuntCard(state.players.find(isPlayerViewSelf)!, move)
  }
}

export function isPlayHuntCard(move: MoveView): move is PlayHuntCard {
  return isPlayHuntCardView(move) && (move as PlayHuntCard).card !== undefined
}

export function isPlayHuntCardView(move: MoveView): move is PlayHuntCardView {
  return move.type === MoveType.PlayHuntCard
}