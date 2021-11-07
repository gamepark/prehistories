import Coordinates from './Coordinates'
import Tile, {getPolyomino, getPolyominoAdjacentCoordinates, getPolyominoCoordinates, Side} from "../material/Tile";
import {cavesSize} from "../material/Caves";

type PlacedTile = {
  tile: Tile
  side: Side
} & Coordinates

export default PlacedTile

export function getPlacedTileCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoCoordinates(getPolyomino(placedTile.tile, placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.x, y: y + placedTile.y}))
}

export function getPlacedTileAdjacentCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoAdjacentCoordinates(getPolyomino(placedTile.tile, placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.x, y: y + placedTile.y}))
    .filter(({x, y}) => x >= 0 && y >= 0 && x < cavesSize && y < cavesSize)
}

export function getPlacedTileSurroundingCoordinates(placedTile: PlacedTile): Coordinates[] {
  return getPolyominoAdjacentCoordinates(getPolyomino(placedTile.tile, placedTile.side))
    .map(({x, y}) => ({x: x + placedTile.x, y: y + placedTile.y}))
    .filter(({x, y}) => x >= 0 && y >= 0 && x < cavesSize && y < cavesSize)
}