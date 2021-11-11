import GameState from '../GameState'
import GameView from '../GameView'
import Hunting from '../types/Hunting'
import {HuntPhase} from '../types/Phase'
import {getFirstOfSortedPlayer} from '../types/PlayerView'
import MoveType from './MoveType'

type ValidateSpentHunters = {
  type: MoveType.ValidateSpentHunters
}

export default ValidateSpentHunters

export function validateSpentHunters(state: GameState | GameView) {

  const player = getFirstOfSortedPlayer(state)
  setPlayerInjuries(player.hunting!)
  delete player.hunting!.huntSpotTakenLevels
  player.hunting!.huntPhase = HuntPhase.CheckPermanentGoals

}

function setPlayerInjuries(hunting: Hunting) {
  if (hunting.huntSpotTakenLevels![1] > 0) {
    hunting.injuries +=1
  }
}