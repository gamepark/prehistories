import PlayerState from "../PlayerState";
import {getAdjacentCoordinates} from "../types/Coordinates";
import Objective from "../types/Objective";
import {PlayerView, PlayerViewSelf} from "../types/PlayerView";
import {
  getPaintedCave,
  hasGroupOfIdenticalAnimals,
  isAnimalPainting,
  isColumnPainted,
  isLegendaryTileSurroundedByPaintings,
  isSpaceSurrounded,
  Painting
} from "./PaintedCave";
import {cavesSize, getHunterCoordinates, getTotemCoordinates} from "./Caves";
import Tile, {isLegendaryAnimalTile} from "./Tile";

const {Mammoth, Buffalo, Fish, Boar, Ibex} = Painting;

const objectiveA1: Objective = {
  text: 'objectiveA1',
  hint: 'hintA1',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
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
}

const objectiveA2: Objective = {
  text: 'objectiveA2',
  hint: 'hintA2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    for (let y = 2; y <= 4; y++) {
      for (let x = 2; x <= 4; x++) {
        if (cave[y][x] === Painting.Empty) {
          return false
        }
      }
    }
    return true
  }
}

const objectiveA3: Objective = {
  text: 'objectiveA3',
  hint: 'hintA3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
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
}

const objectiveA4: Objective = {
  text: 'objectiveA4',
  hint: 'hintA4',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => hasGroupOfIdenticalAnimals(getPaintedCave(player), 8)
}

const objectiveA5: Objective = {
  text: 'objectiveA5',
  hint: 'hintA5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    return isSpaceSurrounded(getPaintedCave(player), getHunterCoordinates(player.color))
  }
}

const objectiveA6: Objective = {
  text: 'objectiveA6',
  hint: 'hintA6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
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
}

const objectiveA7: Objective = {
  text: 'objectiveA7',
  hint: 'hintA7',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return cave[0][0] !== Painting.Empty && cave[cavesSize - 1][cavesSize - 1] !== Painting.Empty
  }
}

const objectiveA8: Objective = {
  text: 'objectiveA8',
  hint: 'hintA8',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    let count = 0
    for (const {tile} of player.cave) {
      if (tile === Tile.Ibex1 || tile === Tile.Boar1 || tile === Tile.Fish1 || tile === Tile.Mammoth1 || tile === Tile.Buffalo1) {
        if (++count === 5) {
          return true
        }
      }
    }
    return false
  }
}

const objectiveA9: Objective = {
  text: 'objectiveA9',
  hint: 'hintA9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return player.cave.some(placedTile => isLegendaryTileSurroundedByPaintings(cave, placedTile))
  }
}

const objectiveB1: Objective = {
  text: 'objectiveB1',
  hint: 'hintB1',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return getTotemCoordinates(player.color).every(totem => isSpaceSurrounded(cave, totem))
  }
}

const objectiveB2: Objective = {
  text: 'objectiveB2',
  hint: 'hintB2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return isColumnPainted(cave, cavesSize - 1)
  }
}

const objectiveB3: Objective = {
  text: 'objectiveB3',
  hint: 'hintB3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    return getPaintedCave(player).some(line => new Set(line.filter(isAnimalPainting)).size >= 5)
  }
}

const objectiveB4: Objective = {
  text: 'objectiveB4',
  hint: 'hintB4',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => hasGroupOfIdenticalAnimals(getPaintedCave(player), 10)
}

const objectiveB5: Objective = {
  text: 'objectiveB5',
  hint: 'hintB5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    const {x, y} = getHunterCoordinates(player.color)
    const paintings = [cave[y][x - 1], cave[y - 1][x], cave[y][x + 1], cave[y + 1][x]]
    return !paintings.includes(Painting.Empty) && new Set(paintings).size === 4
  }
}

const objectiveB6: Objective = {
  text: 'objectiveB6',
  hint: 'hintB6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
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
}

const objectiveB7: Objective = {
  text: 'objectiveB7',
  hint: 'hintB7',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return cave[0][0] !== Painting.Empty && cave[0][cavesSize - 1] !== Painting.Empty
      && cave[cavesSize - 1][0] !== Painting.Empty && cave[cavesSize - 1][cavesSize - 1] !== Painting.Empty
  }
}

const objectiveB8: Objective = {
  text: 'objectiveB8',
  hint: 'hintB8',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    return (player.hunting?.tilesHunted ?? 0) >= 3
  }
}

const objectiveB9: Objective = {
  text: 'objectiveB9',
  hint: 'hintB9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const legendaryTiles = player.cave.filter(placedTile => isLegendaryAnimalTile(placedTile.tile))
    for (const {x, y} of legendaryTiles) {
      if (legendaryTiles.some(tile => ((tile.x === x + 2 && tile.y === y) || (tile.y === y + 2 && tile.x === x)))) {
        return true
      }
    }
    return false
  }
}

export const objectives = [
  objectiveA1, objectiveA2, objectiveA3, objectiveA4, objectiveA5, objectiveA6, objectiveA7, objectiveA8, objectiveA9,
  objectiveB1, objectiveB2, objectiveB3, objectiveB4, objectiveB5, objectiveB6, objectiveB7, objectiveB8, objectiveB9
]
