import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import {getPlayers, getPlayerWithColor, isPlayerView, isPlayerViewSelf, PlayerViewSelf} from "../types/PlayerView";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type PlayHuntCard = {
  type: MoveType.PlayHuntCard
  card: number
  playerId: PlayerColor
}

export default PlayHuntCard

export type PlayHuntCardView = {
  type: MoveType.PlayHuntCard
  playerId: PlayerColor
}

export function playHuntCard(state: GameState, move: PlayHuntCard) {
  const player = getPlayerWithColor(state, move.playerId) as PlayerState
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