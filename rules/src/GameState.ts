import PlayerColor from './PlayerColor'
import PlayerState from './PlayerState'
import Phase from './types/Phase'
import Tile from "./material/Tile";
import Objective from "./material/Objective";

type GameState = {
  players: PlayerState[],
  tilesDeck: Tile[][],
  huntingBoard: (Tile | null)[],
  objectives: Objective[],
  phase?: Phase,
  sortedPlayers?: PlayerColor[]
}

export default GameState