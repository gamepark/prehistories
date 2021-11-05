import PlayerState from "../PlayerState";
import {getAdjacentCoordinates} from "../types/Coordinates";
import Face from "../types/Face";
import Goal from "../types/Goal";
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "../types/PlayerView";
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
import Tile, {isLegendaryAnimalTile, tiles} from "./Tile";

const {Mammoth, Buffalo, Fish, Boar, Ibex} = Painting;

const GoalA1: Goal = {
  face: Face.A,
  text: 'goalA1',
  hint: 'hintA1',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
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

const GoalA2: Goal = {
  face: Face.A,
  text: 'goalA2',
  hint: 'hintA2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
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

const GoalA3: Goal = {
  face: Face.A,
  text: 'goalA3',
  hint: 'hintA3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
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

const GoalA4: Goal = {
  face: Face.A,
  text: 'goalA4',
  hint: 'hintA4',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => hasGroupOfIdenticalAnimals(getPaintedCave(player), 8)
}

const GoalA5: Goal = {
  face: Face.A,
  text: 'goalA5',
  hint: 'hintA5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    return isSpaceSurrounded(getPaintedCave(player), getHunterCoordinates(player.color))
  }
}

const GoalA6: Goal = {
  face: Face.A,
  text: 'goalA6',
  hint: 'hintA6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
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

const GoalA7: Goal = {
  face: Face.A,
  text: 'goalA7',
  hint: 'hintA7',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    return cave[0][0] !== Painting.Empty && cave[cavesSize - 1][cavesSize - 1] !== Painting.Empty
  }
}

const GoalA8: Goal = {
  face: Face.A,
  text: 'goalA8',
  hint: 'hintA8',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    let count = 0
    for (const placedTile of player.cave) {
      const tile = tiles[placedTile.tile]
      if (tile === Tile.Ibex1 || tile === Tile.Boar1 || tile === Tile.Fish1 || tile === Tile.Mammoth1 || tile === Tile.Buffalo1) {
        if (++count === 5) {
          return true
        }
      }
    }
    return false
  }
}

const GoalA9: Goal = {
  face: Face.A,
  text: 'goalA9',
  hint: 'hintA9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    return player.cave.some(placedTile => isLegendaryTileSurroundedByPaintings(cave, placedTile))
  }
}

const GoalB1: Goal = {
  face: Face.B,
  text: 'goalB1',
  hint: 'hintB1',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    return getTotemCoordinates(player.color).every(totem => isSpaceSurrounded(cave, totem))
  }
}

const GoalB2: Goal = {
  face: Face.B,
  text: 'goalB2',
  hint: 'hintB2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    return isColumnPainted(cave, cavesSize - 1)
  }
}

const GoalB3: Goal = {
  face: Face.B,
  text: 'goalB3',
  hint: 'hintB3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    return getPaintedCave(player).some(line => new Set(line.filter(isAnimalPainting)).size >= 5)
  }
}

const GoalB4: Goal = {
  face: Face.B,
  text: 'goalB4',
  hint: 'hintB4',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => hasGroupOfIdenticalAnimals(getPaintedCave(player), 10)
}

const GoalB5: Goal = {
  face: Face.B,
  text: 'goalB5',
  hint: 'hintB5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    const {x, y} = getHunterCoordinates(player.color)
    const paintings = [cave[y][x - 1], cave[y - 1][x], cave[y][x + 1], cave[y + 1][x]]
    return !paintings.includes(Painting.Empty) && new Set(paintings).size === 4
  }
}

const GoalB6: Goal = {
  face: Face.B,
  text: 'goalB6',
  hint: 'hintB6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
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

const GoalB7: Goal = {
  face: Face.B,
  text: 'goalB7',
  hint: 'hintB7',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave = getPaintedCave(player)
    return cave[0][0] !== Painting.Empty && cave[0][cavesSize - 1] !== Painting.Empty
      && cave[cavesSize - 1][0] !== Painting.Empty && cave[cavesSize - 1][cavesSize - 1] !== Painting.Empty
  }
}

const GoalB8: Goal = {
  face: Face.B,
  text: 'goalB8',
  hint: 'hintB8',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    return (player.hunting?.tilesHunted ?? 0) >= 3
  }
}

const GoalB9: Goal = {
  face: Face.B,
  text: 'goalB9',
  hint: 'hintB9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const legendaryTiles = player.cave.filter(placedTile => isLegendaryAnimalTile(tiles[placedTile.tile]))
    for (const {x, y} of legendaryTiles) {
      if (legendaryTiles.some(tile => ((tile.x === x + 2 && tile.y === y) || (tile.y === y + 2 && tile.x === x)))) {
        return true
      }
    }
    return false
  }
}

export const goals = [
  GoalA1, GoalA2, GoalA3, GoalA4, GoalA5, GoalA6, GoalA7, GoalA8, GoalA9,
  GoalB1, GoalB2, GoalB3, GoalB4, GoalB5, GoalB6, GoalB7, GoalB8, GoalB9
]
