import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import Phase from './types/Phase'
import Tile from "./material/Tile";

type GameState = {
  players: PlayerState[],
  tilesDeck: Tile[][],
  huntingBoard: (Tile | null)[],
  objectives: number[],
  phase?: Phase,
  sortedPlayers?: PlayerColor[]
}

export default GameState