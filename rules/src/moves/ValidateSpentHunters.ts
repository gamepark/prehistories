import GameState from '../GameState'
import GameView from '../GameView'
import MoveType from './MoveType'
import {getHuntingPlayer} from "../types/HuntingPlayer";
import getBoardZones from "../material/BoardZones";

type ValidateSpentHunters = {
  type: MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state: GameState | GameView) {
  const player = getHuntingPlayer(state)!
  if (getBoardZones(state.players.length)[player.hunting.hunt!.zone].safe > player.hunting.hunt!.huntersValue) {
    player.hunting.injuries++
  }
  delete player.hunting.hunt
}
