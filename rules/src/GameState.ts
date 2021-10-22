import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import Phase from './types/Phase'

type GameState = {
  players: PlayerState[],
  tilesDeck : number[][],
  huntingBoard : (number|null)[],
  goals : number[],
  phase? : Phase, 
  sortedPlayers?: PlayerColor[]
}

export default GameState