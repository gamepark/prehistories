import GameState from './GameState'
import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import { PlayerHuntView, PlayerView, PlayerViewSelf } from './types/PlayerView'

type GameView = Omit<GameState, 'players' | 'tilesDeck'> & {
  players: (PlayerView | PlayerViewSelf |PlayerHuntView)[]
  tilesDeck: number[]
  caveDisplayed:PlayerColor
  huntersSelected?:number[]
}

export default GameView

export function isGameView(state:GameState | GameView):state is GameView {
  return typeof state.players[0].deck === 'number'
}