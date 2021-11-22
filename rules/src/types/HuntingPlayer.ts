import PlayerState from "../PlayerState";
import Hunting from "./Hunting";
import GameState from "../GameState";
import GameView from "../GameView";
import {getPlayers, PlayerView, PlayerViewSelf} from "./PlayerView";

type HuntingPlayer = Pick<PlayerState, 'color' | 'cave' | 'totemTokens'> & { hunting: Hunting }

export default HuntingPlayer

export function isHuntingPlayer<P extends PlayerState | PlayerView | PlayerViewSelf>(player: P): player is P & HuntingPlayer {
  return player.hunting !== undefined
}

export function getHuntingPlayer(state: GameState): PlayerState & HuntingPlayer | undefined
export function getHuntingPlayer(state: GameView): (PlayerView | PlayerViewSelf) & HuntingPlayer | undefined
export function getHuntingPlayer(state: GameState | GameView): (PlayerState | PlayerView | PlayerViewSelf) & HuntingPlayer | undefined
export function getHuntingPlayer(game: GameState | GameView): (PlayerState | PlayerView | PlayerViewSelf) & HuntingPlayer | undefined {
  return getPlayers(game).find(isHuntingPlayer)
}