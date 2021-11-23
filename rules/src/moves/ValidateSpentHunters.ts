import GameState from '../GameState'
import GameView from '../GameView'
import Hunting from '../types/Hunting'
import {HuntPhase} from '../types/Phase'
import MoveType from './MoveType'
import {getHuntingPlayer} from "../types/HuntingPlayer";
import getPowerLevels from "../utils/powerLevels";

type ValidateSpentHunters = {
  type: MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state: GameState | GameView) {

  const player = getHuntingPlayer(state)!
  if (getPowerLevels(state.players.length, player.hunting.hunt!.zone)[1] > player.hunting.hunt!.huntersValue) {
    player.hunting.injuries++
  }
  delete player.hunting.hunt
  player.hunting!.huntPhase = HuntPhase.CheckObjectives

}
