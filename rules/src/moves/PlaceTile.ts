import GameState from '../GameState'
import GameView from '../GameView'
import Coordinates from '../types/Coordinates'
import {HuntPhase} from '../types/Phase'
import Move from './Move'
import MoveType from './MoveType'
import {Side} from "../material/Tile";
import {getHuntingPlayer} from "../types/HuntingPlayer";

type PlaceTile = {
  type: MoveType.PlaceTile
  huntZone: number
  side: Side
  coordinates: Coordinates
}

export default PlaceTile

export function placeTileMove(huntZone: number, side: Side, coordinates: Coordinates): PlaceTile {
  return {type: MoveType.PlaceTile, huntZone, side, coordinates}
}

export function placeTile(state: GameState | GameView, move: PlaceTile) {
  const player = getHuntingPlayer(state)!
  const tile = state.huntingBoard[move.huntZone]
  if (tile === null) throw('error : trying to paint a null polyomino !')
  player.cave.push({tile: tile, side: move.side, ...move.coordinates})
  player.hunting = {
    huntPhase: HuntPhase.Pay,
    hunt: {zone: move.huntZone, huntersValue: 0},
    injuries: player.hunting.injuries,
    tilesHunted: player.hunting.tilesHunted + 1
  }
  state.huntingBoard[move.huntZone] = null
}

export function isPlaceTile(move: Move): move is PlaceTile {
  return move.type === MoveType.PlaceTile
}