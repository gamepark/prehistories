import PlayerState from "../PlayerState";
import {PlayerView, PlayerViewSelf} from "../types/PlayerView";
import caves, {Space} from "../material/Caves";
import PlacedTile, {getPlacedTileAdjacentCoordinates, getPlacedTileCoordinates} from "../types/PlacedTile";
import {getAdjacentCoordinates} from "../types/Coordinates";

export enum PlacementSpace {
  BLOCKED, FREE, CONNECTED
}

export function getCavePlacementSpaces(player: PlayerState | PlayerView | PlayerViewSelf): PlacementSpace[][] {
  const cave = caves[player.color]
  const placementSpaces: PlacementSpace[][] = cave.map(row => row.map(space =>
    space === Space.Hunter || space === Space.TotemAnimal ? PlacementSpace.BLOCKED : PlacementSpace.FREE
  ))
  if (player.cave.length > 0) {
    for (const placedTile of player.cave) {
      for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
        placementSpaces[y][x] = PlacementSpace.BLOCKED
      }
      for (const {x, y} of getPlacedTileAdjacentCoordinates(placedTile)) {
        if (placementSpaces[y][x] === PlacementSpace.FREE) {
          placementSpaces[y][x] = PlacementSpace.CONNECTED
        } else if (cave[y][x] === Space.Hunter || cave[y][x] === Space.TotemAnimal) { // Those are never on edges
          const adjacentCoordinates = getAdjacentCoordinates({x, y})
          for (const {x, y} of adjacentCoordinates) {
            if (placementSpaces[y][x] === PlacementSpace.FREE) {
              placementSpaces[y][x] = PlacementSpace.CONNECTED
            }
          }
        }
      }
    }
  } else {
    for (let y = 0; y < placementSpaces.length; y++) {
      placementSpaces[y][0] = PlacementSpace.CONNECTED
    }
  }
  return placementSpaces
}

export function canPlaceTile(cave: PlacementSpace[][], placedTile: PlacedTile) {
  let connected = false
  const coordinates = getPlacedTileCoordinates(placedTile)
  for (const {x, y} of coordinates) {
    if (!cave[y] || !cave[y][x]) return false
    if (cave[y][x] === PlacementSpace.CONNECTED) {
      connected = true
    }
  }
  return connected
}
