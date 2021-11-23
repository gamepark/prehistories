import PlayerState from './PlayerState'
import Tile from "./material/Tile";
import Objective from "./material/Objective";

type GameState = {
  players: PlayerState[],
  tilesDeck: Tile[][],
  huntingBoard: (Tile | null)[],
  objectives: Objective[],
}

export default GameState