import PlayerState from "../PlayerState";
import caves, {cavesSize, Space} from "./Caves";
import PlacedTile, {getPlacedTileCoordinates} from "../types/PlacedTile";
import Tile, {isLegendaryAnimalTile} from "./Tile";
import Coordinates from "../types/Coordinates";

export enum Painting {
  Empty, Hunter, TotemAnimal, Fish, Mammoth, Buffalo, Ibex, Boar,
  Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

export type PlayerWithCave = Pick<PlayerState, 'color' | 'cave'>;

export function getPaintedCave(player: PlayerWithCave): Painting[][] {
  const cave: Painting[][] = caves[player.color].map(row =>
    row.map(space => {
      switch (space) {
        case Space.Empty:
        case Space.Hand:
        case Space.Hand2:
          return Painting.Empty
        case Space.Hunter:
          return Painting.Hunter
        case Space.TotemAnimal:
          return Painting.TotemAnimal
      }
    })
  )
  for (const placedTile of player.cave) {
    for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
      cave[y][x] = getAnimal(placedTile.tile)
    }
  }
  return cave
}

function getAnimal(tile: Tile): Painting {
  switch (tile) {
    case Tile.Fish1:
    case Tile.Fish2:
    case Tile.Fish3A:
    case Tile.Fish3B:
    case Tile.Fish4A:
    case Tile.Fish4B:
      return Painting.Fish
    case Tile.Mammoth1:
    case Tile.Mammoth2:
    case Tile.Mammoth3A:
    case Tile.Mammoth3B:
    case Tile.Mammoth4A:
    case Tile.Mammoth4B:
      return Painting.Mammoth
    case Tile.Buffalo1:
    case Tile.Buffalo2:
    case Tile.Buffalo3A:
    case Tile.Buffalo3B:
    case Tile.Buffalo4A:
    case Tile.Buffalo4B:
      return Painting.Buffalo
    case Tile.Ibex1:
    case Tile.Ibex2:
    case Tile.Ibex3A:
    case Tile.Ibex3B:
    case Tile.Ibex4A:
    case Tile.Ibex4B:
      return Painting.Ibex
    case Tile.Boar1:
    case Tile.Boar2:
    case Tile.Boar3A:
    case Tile.Boar3B:
    case Tile.Boar4A:
    case Tile.Boar4B:
      return Painting.Boar
    case Tile.Legendary1:
      return Painting.Legendary1
    case Tile.Legendary2:
      return Painting.Legendary2
    case Tile.Legendary3:
      return Painting.Legendary3
    case Tile.Legendary4:
      return Painting.Legendary4
    case Tile.Legendary5:
      return Painting.Legendary5
  }
}

export function isLegendaryTileSurroundedByPaintings(cave: Painting[][], placedTile: PlacedTile) {
  const tile = placedTile.tile
  if (!isLegendaryAnimalTile(tile)) {
    return false
  }
  for (let x = placedTile.x; x < placedTile.x + 3; x++) {
    if ((cave[placedTile.y - 1] && cave[placedTile.y - 1][x - 1] === Painting.Empty) || (cave[placedTile.y + 2] && cave[placedTile.y + 2][x] === Painting.Empty)) {
      return false
    }
  }
  for (let y = placedTile.y; y < placedTile.y + 3; y++) {
    if ((cave[y] && cave[y][placedTile.x - 1] === Painting.Empty) || (cave[y - 1] && cave[y - 1][placedTile.x + 2] === Painting.Empty)) {

      return false
    }
  }
  return true
}

export function isSpaceSurrounded(cave: Painting[][], coordinates: Coordinates) {
  for (let y = coordinates.y - 1; y <= coordinates.y + 1; y++) {
    for (let x = coordinates.x - 1; x <= coordinates.x + 1; x++) {
      if (cave[y][x] === Painting.Empty) return false
    }
  }
  return true
}

export function isAnimalPainting(painting: Painting) {
  return painting !== Painting.Empty && painting !== Painting.Hunter
}

export function getGroupCreatedWithLastTile(player: PlayerWithCave): Coordinates[] {
  const cave = getPaintedCave(player)
  const result: Coordinates[] = []
  const recursiveFunction = ({x, y}: Coordinates) => {
    const painting = cave[y][x]
    result.push({x, y})
    cave[y][x] = Painting.Empty
    if (y > 0 && cave[y - 1][x] === painting) recursiveFunction({y: y - 1, x})
    if (x > 0 && cave[y][x - 1] === painting) recursiveFunction({y, x: x - 1})
    if (y + 1 < cavesSize && cave[y + 1][x] === painting) recursiveFunction({y: y + 1, x})
    if (x + 1 < cavesSize && cave[y][x + 1] === painting) recursiveFunction({y, x: x + 1})
  }
  recursiveFunction(getPlacedTileCoordinates(player.cave[player.cave.length - 1])[0])
  return result
}

export function isColumnPainted(cave: Painting[][], column: number) {
  for (let y = 0; y < cave.length; y++) {
    if (cave[y][column] === Painting.Empty) return false
  }
  return true
}

export function isLinePainted(cave: Painting[][], line: number) {
  return cave[line].every(painting => painting !== Painting.Empty)
}
