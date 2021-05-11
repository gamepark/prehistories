import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import Phase from './types/Phase'
import Polyomino from './types/Polyomino'

/**
 * In here, you describe what a GameState will look like at any time during a game.
 */
type GameState = {
  players: PlayerState[],
  tilesDeck : Polyomino[][],
  huntingBoard : Polyomino[],
  phase : Phase | undefined, 
  activePlayer : PlayerColor | undefined,
  playerOrder : PlayerColor[] | undefined,
  goals : number[]
}

export default GameState