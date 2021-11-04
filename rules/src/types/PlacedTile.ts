import Coordinates from './Coordinates'
import {getPolyomino, getPolyominoAdjacentCoordinates, getPolyominoCoordinates, tiles} from "../material/Tile";
import {cavesSize} from "../material/Caves";

type PlacedTile = {
  tile: number
  side: 0 | 1
} & Coordinates

export default PlacedTile

export function getPlacedTileCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoCoordinates(getPolyomino(tiles[placedTile.tile], placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.y, y: y + placedTile.x})) // TODO: reverse PlacedTile.coordinates
}

export function getPlacedTileAdjacentCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoAdjacentCoordinates(getPolyomino(tiles[placedTile.tile], placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.y, y: y + placedTile.x})) // TODO: reverse PlacedTile.coordinates
    .filter(({x, y}) => x >= 0 && y >= 0 && x < cavesSize && y < cavesSize)
}

export function getPlacedTileSurroundingCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoAdjacentCoordinates(getPolyomino(tiles[placedTile.tile], placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.y, y: y + placedTile.x})) // TODO: reverse PlacedTile.coordinates
    .filter(({x, y}) => x >= 0 && y >= 0 && x < cavesSize && y < cavesSize)
}