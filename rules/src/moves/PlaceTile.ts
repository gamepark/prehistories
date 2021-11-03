import GameState from '../GameState'
import GameView from '../GameView'
import Coordinates from '../types/Coordinates'
import {HuntPhase} from '../types/Phase'
import {getFirstOfSortedPlayer} from '../types/PlayerView'
import getPowerLevels from '../utils/powerLevels'
import Move from './Move'
import MoveType from './MoveType'

type PlaceTile = {
  type: MoveType.PlaceTile
  huntSpot: number
  side: 0 | 1
  coordinates: Coordinates
}

export default PlaceTile

export function placeTileMove(huntSpot: number, side: 0 | 1, coordinates: Coordinates): PlaceTile {
  return {type: MoveType.PlaceTile, huntSpot, side, coordinates}
}

export function placeTile(state: GameState | GameView, move: PlaceTile) {
  const player = getFirstOfSortedPlayer(state)
  const polyomino: number | null = state.huntingBoard[move.huntSpot]
  if (polyomino === null) {
    throw('error : trying to paint a null polyomino !')
  } else {
    player.cave.push({tile: polyomino, side: move.side, ...move.coordinates})
    player.hunting = {
      huntPhase: HuntPhase.Pay,
      huntSpotTakenLevels: getPowerLevels(state.players.length, move.huntSpot),
      injuries: player.hunting!.injuries,
      tilesHunted: (player.hunting!.tilesHunted ?? 0) + 1
    }
  }
  state.huntingBoard[move.huntSpot] = null
}

export function isPlaceTile(move: Move): move is PlaceTile {
  return move.type === MoveType.PlaceTile
}