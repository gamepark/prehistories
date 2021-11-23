import Objective from "./Objective";
import Tile, {isLegendaryAnimalTile, revertMatrix} from "./Tile";
import {
  getGroupCreatedWithLastTile,
  getPaintedCave,
  isAnimalPainting,
  isColumnPainted,
  isLegendaryTileSurroundedByPaintings,
  isLinePainted,
  isSpaceSurrounded,
  Painting
} from "./PaintedCave";
import Coordinates, {getAdjacentCoordinates} from "../types/Coordinates";
import GameState from "../GameState";
import GameView from "../GameView";
import {getPlayers} from "../types/PlayerView";
import {cavesSize, getHunterCoordinates, getTotemCoordinates} from "./Caves";
import PlacedTile, {getPlacedTileCoordinates} from "../types/PlacedTile";
import HuntingPlayer from "../types/HuntingPlayer";

const {Mammoth, Buffalo, Fish, Boar, Ibex} = Painting

export function getObjectiveValue(objective: Objective, isFirstToFulfill?: boolean) {
  switch (objective) {
    case Objective.AnyColumn:
    case Objective.AnyLine:
    case Objective.Legendary:
      return 1
    case Objective.AnimalArea10:
    case Objective.SurroundTotemAnimals:
    case Objective.PaintAllCorners:
      return isFirstToFulfill ? 3 : 2
    default:
      return isFirstToFulfill ? 2 : 1
  }
}

export function getFulfilledObjectives(game: GameState | GameView): Objective[] {
  const fulfilledObjectives = []
  const player = getPlayers(game).find(p => p.hunting) as HuntingPlayer
  const cave = getPaintedCave(player)
  if (paintedColumns(cave) > count(player.totemTokens, o => o === Objective.AnyColumn)) {
    fulfilledObjectives.push(Objective.AnyColumn)
  }
  if (paintedLines(cave) > count(player.totemTokens, o => o === Objective.AnyLine)) {
    fulfilledObjectives.push(Objective.AnyLine)
  }
  if (count(player.cave, ({tile}) => isLegendaryAnimalTile(tile)) > count(player.totemTokens, o => o === Objective.Legendary)) {
    fulfilledObjectives.push(Objective.Legendary)
  }
  for (const objective of game.objectives) {
    if (!player.totemTokens.includes(objective) && isCardObjectiveFulfilled(objective, cave, player)) {
      fulfilledObjectives.push(objective)
    }
  }
  return fulfilledObjectives
}

const count = <T>(array: T[], predicate: (t: T) => boolean) => array.reduce((sum, i) => predicate(i) ? sum + 1 : sum, 0)

function paintedLines(cave: Painting[][]) {
  return cave.reduce((count, line) => line.every(painting => painting !== Painting.Empty) ? count + 1 : count, 0)
}

function paintedColumns(cave: Painting[][]) {
  return paintedLines(revertMatrix(cave))
}

function columnsFillCompleted(cave: Painting[][], lastFilledCoordinates: Coordinates[]) {
  const columnsToCheck = Array.from(new Set(lastFilledCoordinates.map(c => c.x)))
  return columnsToCheck.reduce((sum, x) => isColumnPainted(cave, x) ? sum + 1 : sum, 0)
}

function linesFillCompleted(cave: Painting[][], lastFilledCoordinates: Coordinates[]) {
  const linesToCheck = Array.from(new Set(lastFilledCoordinates.map(c => c.y)))
  return linesToCheck.reduce((sum, y) => isLinePainted(cave, y) ? sum + 1 : sum, 0)
}

function isCardObjectiveFulfilled(objective: Objective, cave: Painting[][], player: HuntingPlayer) {
  switch (objective) {
    case Objective.ConnectTotemAnimals:
      return areTotemAnimalsConnected(cave)
    case Objective.PaintMiddle9:
      return isMiddle9Painted(cave)
    case Objective.Column5Different:
      return hasColumnWith5DifferentAnimals(cave)
    case Objective.AnimalArea8:
      return getGroupCreatedWithLastTile(player).length >= 8
    case Objective.SurroundHunter:
      return isSpaceSurrounded(cave, getHunterCoordinates(player.color))
    case Objective.Column5Same:
      return hasColumnWith5SameAnimal(cave)
    case Objective.ConnectDiagonalCorners:
      return cave[0][0] !== Painting.Empty && cave[cavesSize - 1][cavesSize - 1] !== Painting.Empty
    case Objective.Paint5SmallestTiles:
      return hasPainted5SmallestTiles(player.cave)
    case Objective.SurroundLegendary:
      return player.cave.some(placedTile => isLegendaryTileSurroundedByPaintings(cave, placedTile))
    case Objective.SurroundTotemAnimals:
      return getTotemCoordinates(player.color).every(totem => isSpaceSurrounded(cave, totem))
    case Objective.PaintLastColumn:
      return isColumnPainted(cave, cavesSize - 1)
    case Objective.Line5Different:
      return cave.some(line => new Set(line.filter(isAnimalPainting)).size >= 5)
    case Objective.AnimalArea10:
      return getGroupCreatedWithLastTile(player).length >= 10
    case Objective.SurroundHunterDifferent:
      return isSpaceSurroundedWith4DifferentAnimals(cave, getHunterCoordinates(player.color))
    case Objective.Line5Same:
      return hasLineWith5SameAnimal(cave)
    case Objective.PaintAllCorners:
      return [cave[0][0], cave[0][cavesSize - 1], cave[cavesSize - 1][0], cave[cavesSize - 1][cavesSize - 1]].every(space => space !== Painting.Empty)
    case Objective.Collect3Tiles:
      return player.hunting.tilesHunted >= 3
    case Objective.PaintAdjacentLegendary:
      return hasPaintedLegendaryAdjacentTiles(player.cave)
    default:
      return false
  }
}

function areTotemAnimalsConnected(cave: Painting[][]) {
  for (let y = 0; y < cave.length; y++) {
    for (let x = 0; x < cave[y].length; x++) {
      if (cave[y][x] === Painting.TotemAnimal) {
        if (getAdjacentCoordinates({x, y}).every(({x, y}) => cave[y][x] === Painting.Empty)) {
          return false
        }
      }
    }
  }
  return true
}

function isMiddle9Painted(cave: Painting[][]) {
  for (let y = 2; y <= 4; y++) {
    for (let x = 2; x <= 4; x++) {
      if (cave[y][x] === Painting.Empty) {
        return false
      }
    }
  }
  return true
}

function hasColumnWith5DifferentAnimals(cave: Painting[][]) {
  for (let x = 0; x < cavesSize; x++) {
    const column = new Set<Painting>()
    for (let y = 0; y < cavesSize; y++) {
      if (isAnimalPainting(cave[y][x])) {
        column.add(cave[y][x])
        if (column.size >= 5) return true
      }
    }
  }
  return false
}

function hasColumnWith5SameAnimal(cave: Painting[][]) {
  for (let x = 0; x < cavesSize; x++) {
    const column = {[Mammoth]: 0, [Buffalo]: 0, [Fish]: 0, [Boar]: 0, [Ibex]: 0}
    for (let y = 0; y < cavesSize; y++) {
      const painting = cave[y][x]
      if (column[painting] !== undefined) {
        if (++column[painting] >= 5) {
          return true
        }
      }
    }
  }
  return false
}

function hasPainted5SmallestTiles(cave: PlacedTile[]) {
  let count = 0
  for (const {tile} of cave) {
    if (tile === Tile.Ibex1 || tile === Tile.Boar1 || tile === Tile.Fish1 || tile === Tile.Mammoth1 || tile === Tile.Buffalo1) {
      if (++count === 5) {
        return true
      }
    }
  }
  return false
}

function isSpaceSurroundedWith4DifferentAnimals(cave: Painting[][], {x, y}: Coordinates) {
  const paintings = [cave[y][x - 1], cave[y - 1][x], cave[y][x + 1], cave[y + 1][x]]
  return !paintings.includes(Painting.Empty) && new Set(paintings).size === 4
}

function hasLineWith5SameAnimal(cave: Painting[][]) {
  for (const line of cave) {
    const count = {[Mammoth]: 0, [Buffalo]: 0, [Fish]: 0, [Boar]: 0, [Ibex]: 0}
    for (const painting of line) {
      if (count[painting] !== undefined) {
        if (++count[painting] >= 5) {
          return true
        }
      }
    }
  }
  return false
}

function hasPaintedLegendaryAdjacentTiles(cave: PlacedTile[]) {
  const legendaryTiles = cave.filter(placedTile => isLegendaryAnimalTile(placedTile.tile))
  for (const {x, y} of legendaryTiles) {
    if (legendaryTiles.some(tile => ((tile.x === x + 2 && tile.y === y) || (tile.y === y + 2 && tile.x === x)))) {
      return true
    }
  }
  return false
}

export function getTokensForFulfilledObjective(game: GameState | GameView, objective: Objective): number {
  const player = getPlayers(game).find(p => p.hunting) as HuntingPlayer
  const cave = getPaintedCave(player)
  switch (objective) {
    case Objective.AnyColumn: {
      const lastTilePlayed = player.cave[player.cave.length - 1]
      const lastFilledCoordinates = getPlacedTileCoordinates(lastTilePlayed)
      return columnsFillCompleted(cave, lastFilledCoordinates)
    }
    case Objective.AnyLine: {
      const lastTilePlayed = player.cave[player.cave.length - 1]
      const lastFilledCoordinates = getPlacedTileCoordinates(lastTilePlayed)
      return linesFillCompleted(cave, lastFilledCoordinates)
    }
    case Objective.Legendary:
      return 1
    default:
      const isFirstToFulfill = !getPlayers(game).some(player => player.totemTokens.includes(objective))
      return getObjectiveValue(objective, isFirstToFulfill)
  }
}
