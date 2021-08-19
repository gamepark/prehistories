import GameState from './GameState'
import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import { isPlayerState, isPlayerView, isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf } from './types/PlayerView'

type GameView = Omit<GameState, 'players'> & {
  players: (PlayerView | PlayerViewSelf |PlayerHuntView)[]
  caveDisplayed:PlayerColor
}

export default GameView

export function getPlayers(state:GameState | GameView){
  return (state.players as (PlayerState | PlayerView | PlayerViewSelf |PlayerHuntView)[]) 
}

export function isGameView(state:GameState | GameView):state is GameView {
  return typeof state.players[0].deck === 'number'
}