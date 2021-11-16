import Objective from "@gamepark/prehistories/material/Objective"
import {
  getGroupOfIdenticalAnimals,
  getPaintedCave,
  isAnimalPainting,
  isColumnPainted,
  isLegendaryTileSurroundedByPaintings,
  isLinePainted,
  Painting
} from "@gamepark/prehistories/material/PaintedCave"
import {shortestPathBinaryMatrix} from "@gamepark/prehistories/utils/shortestPath"
import caves, {cavesSize, getHunterCoordinates, getTotemCoordinates} from "@gamepark/prehistories/material/Caves"
import Coordinates from "@gamepark/prehistories/types/Coordinates";
import Tile, {isLegendaryAnimalTile, revertMatrix} from "@gamepark/prehistories/material/Tile";
import {getPlacedTileCoordinates} from "@gamepark/prehistories/types/PlacedTile";
import PlayerState from "@gamepark/prehistories/PlayerState";

const {Mammoth, Buffalo, Fish, Boar, Ibex} = Painting
const X = true, _ = false

type Player = Pick<PlayerState, 'cave' | 'color'>

export default function getObjectiveSquaresHighlight(objective: Objective, player: Player): boolean[][] {
  switch (objective) {
    case Objective.AnyColumn: {
      const cave = getPaintedCave(player)
      const result = cave.map(row => row.map(() => false))
      const lastTilePlayed = player.cave[player.cave.length - 1]
      const lastFilledCoordinates = getPlacedTileCoordinates(lastTilePlayed)
      const columns = Array.from(new Set(lastFilledCoordinates.map(c => c.x))).filter(x => isColumnPainted(cave, x))
      for (const x of columns) {
        for (let y = 0; y < cavesSize; y++) {
          result[y][x] = true
        }
      }
      return result
    }
    case Objective.AnyLine: {
      const cave = getPaintedCave(player)
      const result = cave.map(row => row.map(() => false))
      const lastTilePlayed = player.cave[player.cave.length - 1]
      const lastFilledCoordinates = getPlacedTileCoordinates(lastTilePlayed)
      const lines = Array.from(new Set(lastFilledCoordinates.map(c => c.y))).filter(y => isLinePainted(cave, y))
      for (const y of lines) {
        for (let x = 0; x < cavesSize; x++) {
          result[y][x] = true
        }
      }
      return result
    }
    case Objective.Legendary: {
      const result = [...Array(cavesSize)].map(() => Array(cavesSize).fill(false))
      for (const {x, y} of getPlacedTileCoordinates(player.cave[player.cave.length - 1])) {
        result[y][x] = true
      }
      return result
    }
    case Objective.ConnectTotemAnimals:
      return getPathBetweenTotems(player)
    case Objective.PaintMiddle9:
      return [
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _],
        [_, _, X, X, X, _, _],
        [_, _, X, X, X, _, _],
        [_, _, X, X, X, _, _],
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _]
      ]
    case Objective.Column5Different:
      return revertMatrix(get5DifferentAnimalsInLine(revertMatrix(getPaintedCave(player))))
    case Objective.AnimalArea8: {
      const cave = getPaintedCave(player)
      const result = cave.map(row => row.map(() => false))
      for (const {x, y} of getGroupOfIdenticalAnimals(cave, 8)!) {
        result[y][x] = true
      }
      return result
    }
    case Objective.SurroundHunter:
      return getSurrounding([getHunterCoordinates(player.color)])
    case Objective.Column5Same:
      return revertMatrix(get5SameAnimalsInLine(revertMatrix(getPaintedCave(player))))
    case Objective.ConnectDiagonalCorners:
      return getPathBetweenOppositeCorners(player)
    case Objective.Paint5SmallestTiles: {
      const cave = getPaintedCave(player)
      const result = cave.map(row => row.map(() => false))
      for (const {tile, x, y} of player.cave) {
        if (tile === Tile.Ibex1 || tile === Tile.Boar1 || tile === Tile.Fish1 || tile === Tile.Mammoth1 || tile === Tile.Buffalo1) {
          result[y][x] = true
        }
      }
      return result
    }
    case Objective.SurroundLegendary:
      return getLegendarySurroundedTile(player)
    case Objective.SurroundTotemAnimals:
      return getSurrounding(getTotemCoordinates(player.color))
    case Objective.PaintLastColumn:
      return [
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X],
        [_, _, _, _, _, _, X]
      ]
    case Objective.Line5Different:
      return get5DifferentAnimalsInLine(getPaintedCave(player))
    case Objective.AnimalArea10: {
      const cave = getPaintedCave(player)
      const result = cave.map(row => row.map(() => false))
      for (const {x, y} of getGroupOfIdenticalAnimals(cave, 10)!) {
        result[y][x] = true
      }
      return result
    }
    case Objective.SurroundHunterDifferent: {
      const result = caves[player.color].map(row => row.map(() => false))
      const {x, y} = getHunterCoordinates(player.color)
      result[y + 1][x] = true
      result[y][x + 1] = true
      result[y - 1][x] = true
      result[y][x - 1] = true
      return result
    }
    case Objective.Line5Same:
      return get5SameAnimalsInLine(getPaintedCave(player))
    case Objective.PaintAllCorners:
      return [
        [X, _, _, _, _, _, X],
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _],
        [_, _, _, _, _, _, _],
        [X, _, _, _, _, _, X]
      ]
    case Objective.Collect3Tiles: {
      const result = [...Array(cavesSize)].map(() => Array(cavesSize).fill(false))
      for (const placedTile of player.cave.slice(-3)) {
        for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
          result[y][x] = true
        }
      }
      return result
    }
    case Objective.PaintAdjacentLegendary: {
      const result = [...Array(cavesSize)].map(() => Array(cavesSize).fill(false))
      let legendaryTiles = player.cave.filter(placedTile => isLegendaryAnimalTile(placedTile.tile))
      legendaryTiles = legendaryTiles.filter(({x, y}) => legendaryTiles.some(tile =>
        (tile.x === x + 2 && tile.y === y) || (tile.y === y + 2 && tile.x === x) || (tile.x === x - 2 && tile.y === y) || (tile.y === y - 2 && tile.x === x)
      ))
      for (const placedTile of legendaryTiles) {
        for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
          result[y][x] = true
        }
      }
      return result
    }
  }
}

function getPathBetweenTotems(player: Player) {
  const cave = getPaintedCave(player)
  const result = cave.map(row => row.map(() => false))
  const totemCoordinates = getTotemCoordinates(player.color);
  const path = shortestPathBinaryMatrix(cave, totemCoordinates[0], totemCoordinates[1])
  for (const {x, y} of path) {
    result[y][x] = true
  }
  return result
}

function get5DifferentAnimalsInLine(cave: Painting[][]) {
  const result = cave.map(row => row.map(() => false))
  for (let y = 0; y < cavesSize; y++) {
    const line = cave[y]
    const animals = new Set<Painting>()
    const coordinates: Coordinates[] = []
    for (let x = 0; x < cavesSize; x++) {
      const painting = line[x]
      if (isAnimalPainting(painting) && !animals.has(painting)) {
        animals.add(painting)
        coordinates.push({x, y})
      }
    }
    if (animals.size >= 5) {
      for (const {x, y} of coordinates) {
        result[y][x] = true
      }
      break
    }
  }
  return result
}

function get5SameAnimalsInLine(cave: Painting[][]) {
  const result = cave.map(row => row.map(() => false))
  for (let y = 0; y < cavesSize; y++) {
    const line = cave[y]
    const mapping: { [key in Painting]?: Coordinates[] } = {[Mammoth]: [], [Buffalo]: [], [Fish]: [], [Boar]: [], [Ibex]: []}
    for (let x = 0; x < cavesSize; x++) {
      const coordinates = mapping[line[x]]
      if (coordinates !== undefined) {
        coordinates.push({x, y})
        if (coordinates.length >= 5) {
          for (const {x, y} of coordinates) {
            result[y][x] = true
          }
          return result
        }
      }
    }
  }
  return result
}

function getPathBetweenOppositeCorners(player: Player) {
  const cave = getPaintedCave(player)
  const result = cave.map(row => row.map(() => false))
  const path = shortestPathBinaryMatrix(cave, {x: 0, y: 0}, {x: 6, y: 6})
  for (const {x, y} of path) {
    result[y][x] = true
  }
  return result
}

function getLegendarySurroundedTile(player: Player) {
  const cave = getPaintedCave(player)
  const result = cave.map(row => row.map(() => false))
  player.cave.forEach(placedTile => {
    if (isLegendaryTileSurroundedByPaintings(cave, placedTile)) {
      for (let x = Math.max(0, placedTile.x - 1); x <= Math.min(6, placedTile.x + 2); x++) {
        for (let y = Math.max(0, placedTile.y - 1); y <= Math.min(6, placedTile.y + 2); y++) {
          result[y][x] = true
        }
      }
    }
  })
  return result
}

function getSurrounding(coordinates: Coordinates[]) {
  const result = [...Array(cavesSize)].map(() => Array(cavesSize).fill(false))
  for (const c of coordinates) {
    for (let x = c.x - 1; x <= c.x + 1; x++) {
      for (let y = c.y - 1; y <= c.y + 1; y++) {
        if (x !== c.x || y !== c.y) {
          result[y][x] = true
        }
      }
    }
  }
  return result
}

