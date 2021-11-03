import PlayerState from "../PlayerState";
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import caves, {Space} from "../material/Caves";
import PlacedTile, {getPlacedTileAdjacentCoordinates, getPlacedTileCoordinates} from "../types/PlacedTile";

export enum PlacementSpace {
  BLOCKED, FREE, CONNECTED
}

export function getCavePlacementSpaces(player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): PlacementSpace[][] {
  const cave = caves[player.color]
  const placementSpaces: PlacementSpace[][] = cave.map(row => row.map(space =>
    space === Space.HUNTER || space === Space.TOTEM_ANIMAL ? PlacementSpace.BLOCKED : PlacementSpace.FREE
  ))
  if (player.cave.length > 3) { // TODO: do not place Hunter and Totem animal at startup as if they were tiles
    for (const placedTile of player.cave) {
      for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
        placementSpaces[y][x] = PlacementSpace.BLOCKED
      }
      for (const {x, y} of getPlacedTileAdjacentCoordinates(placedTile)) {
        if (placementSpaces[y][x] === PlacementSpace.FREE) {
          placementSpaces[y][x] = PlacementSpace.CONNECTED
        } else if (cave[y][x] === Space.HUNTER || cave[y][x] === Space.TOTEM_ANIMAL) { // Those are never on edges
          const adjacentCoordinates = [{x: x + 1, y}, {x: x - 1, y}, {x, y: y + 1}, {x, y: y - 1}]
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
