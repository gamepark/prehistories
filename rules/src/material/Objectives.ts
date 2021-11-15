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
import {cavesSize, getHunterCoordinates, getTotemCoordinates, Space} from "./Caves";
import Tile, {isLegendaryAnimalTile} from "./Tile";

const {Mammoth, Buffalo, Fish, Boar, Ibex} = Painting;
const X = true
const _ = false
const canvasCave = [
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _],
  [_, _, _, _, _, _, _]
]

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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    return [
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, X, X, X, _, _],
      [_, _, X, X, X, _, _],
      [_, _, X, X, X, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ]
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    for (let x = 0; x < cavesSize; x++) {
      const column = new Set<Painting>()
      for (let y = 0; y < cavesSize; y++) {
        if (isAnimalPainting(cave[y][x])) {
          column.add(cave[y][x])
          if (column.size >= 5) {
            const result = canvasCave.slice()
            result.forEach(row => {
              row[y]=X
            })
            return result
          }
        }
      }
    }
    return undefined
  },
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    const hunter = getHunterCoordinates(player.color)  
    for(let i=hunter.x-1;i<=hunter.x+1;i++){
      for(let j=hunter.y-1;j<=hunter.y+1;j++){
        result[i][j] = X
      }
    }
    return result
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    for (let x = 0; x < cavesSize; x++) {
      const column = {[Mammoth]: 0, [Buffalo]: 0, [Fish]: 0, [Boar]: 0, [Ibex]: 0}
      for (let y = 0; y < cavesSize; y++) {
        const painting = cave[y][x]
        if (column[painting] !== undefined) {
          if (++column[painting] >= 5) {
            const result = canvasCave.slice()
            result.forEach(row => {
              row[y]=X
            })
            return result
          }
        }
      }
    }
    return undefined
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    player.cave.forEach(tile => {
      if(tile.tile === Tile.Ibex1 || tile.tile === Tile.Boar1 || tile.tile === Tile.Fish1 || tile.tile === Tile.Mammoth1 || tile.tile === Tile.Buffalo1){
        result[tile.x][tile.y] = X
      }
    })
    return result
  }
}

const objectiveA9: Objective = {
  text: 'objectiveA9',
  hint: 'hintA9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return player.cave.some(placedTile => isLegendaryTileSurroundedByPaintings(cave, placedTile))
  },
  squaresIfFulfilled:(player:PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    const result = canvasCave.slice()
    player.cave.forEach(placedTile => {
      if (isLegendaryTileSurroundedByPaintings(cave, placedTile)){
        for(let i = placedTile.x-1;i<=placedTile.x+2;i++){
          for(let j = placedTile.y-1;j<=placedTile.y+2;j++){
            result[i][j] = X
          }
        }
      }
    })
    return result
  }
}

const objectiveB1: Objective = {
  text: 'objectiveB1',
  hint: 'hintB1',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return getTotemCoordinates(player.color).every(totem => isSpaceSurrounded(cave, totem))
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    const totems = getTotemCoordinates(player.color)
    for(const totem of totems){
      for(let i = totem.x-1;i<=totem.x+1;i++){
        for(let j = totem.y-1;j<=totem.y+1;j++){
          result[i][j] = X
        }
      }
    }
    return result
  }
}

const objectiveB2: Objective = {
  text: 'objectiveB2',
  hint: 'hintB2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    return isColumnPainted(cave, cavesSize - 1)
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    for(let i=0;i<7;i++){
      result[i][6] = X
    }
    return result
  }
}

const objectiveB3: Objective = {
  text: 'objectiveB3',
  hint: 'hintB3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    return getPaintedCave(player).some(line => new Set(line.filter(isAnimalPainting)).size >= 5)
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    for (let y = 0; y < cavesSize; y++) {
      const line = new Set<Painting>()
      for (let x = 0; x < cavesSize; x++) {
        if (isAnimalPainting(cave[y][x])) {
          line.add(cave[y][x])
          if (line.size >= 5) {
            const result = canvasCave.slice()
            result.forEach(column => {
              column[x]=X
            })
            return result
          }
        }
      }
    }
    return undefined
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    const hunter = getHunterCoordinates(player.color)
    result[hunter.x][hunter.y] = X
    result[hunter.x+1][hunter.y] = X
    result[hunter.x-1][hunter.y] = X
    result[hunter.x][hunter.y+1] = X
    result[hunter.x][hunter.y-1] = X
    return result
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const cave = getPaintedCave(player)
    for (let y = 0; y < cavesSize; y++) {
      const line = {[Mammoth]: 0, [Buffalo]: 0, [Fish]: 0, [Boar]: 0, [Ibex]: 0}
      for (let x = 0; x < cavesSize; x++) {
        const painting = cave[y][x]
        if (line[painting] !== undefined) {
          if (++line[painting] >= 5) {
            const result = canvasCave.slice()
            result.forEach(column => {
              column[x]=X
            })
            return result
          }
        }
      }
    }
    return undefined
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    result[0][0] = X
    result[0][6] = X
    result[6][0] = X
    result[6][6] = X
    return result
  }
}

const objectiveB8: Objective = {
  text: 'objectiveB8',
  hint: 'hintB8',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf) => {
    return (player.hunting?.tilesHunted ?? 0) >= 3
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    for(let i=player.cave.length-1;i>=player.cave.length-3;i--){
      result[player.cave[i].x][player.cave[i].y] = X
    }
    return result
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
  },
  squaresIfFulfilled:(player: PlayerState | PlayerView | PlayerViewSelf) => {
    const result = canvasCave.slice()
    const legendaryTiles = player.cave.filter(placedTile => isLegendaryAnimalTile(placedTile.tile))
    for (const {x, y} of legendaryTiles) {
      for (const tile of legendaryTiles){
        if (tile.x === x + 2 && tile.y === y){
          for(let i=0;i<2;i++){
            for(let j=0;j<4;j++){
              result[i][j] = X
            }
          }
          return result
        } else if (tile.y === y + 2 && tile.x === x){
          for(let i=0;i<4;i++){
            for(let j=0;j<2;j++){
              result[i][j] = X
            }
          }
          return result
        }
      }
    }
    return undefined
  }
}

export const objectives = [
  objectiveA1, objectiveA2, objectiveA3, objectiveA4, objectiveA5, objectiveA6, objectiveA7, objectiveA8, objectiveA9,
  objectiveB1, objectiveB2, objectiveB3, objectiveB4, objectiveB5, objectiveB6, objectiveB7, objectiveB8, objectiveB9
]
