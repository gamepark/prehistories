import GameState from './GameState'
import {PlayerView, PlayerViewSelf} from './types/PlayerView'

type GameView = Omit<GameState, 'players' | 'tilesDecks'> & {
  players: (PlayerView | PlayerViewSelf)[]
  tilesDecks: number[]
  huntersSelected?: number[]
}

export default GameView

export function isGameView(state: GameState | GameView): state is GameView {
  return typeof state.players[0].deck === 'number'
}