import PlayerState from "../PlayerState";
import Animal from "../types/Animal";
import Coordinates, {getAdjacentCoordinates} from "../types/Coordinates";
import Face from "../types/Face";
import Goal from "../types/Goal";
import PlacedTile from "../types/PlacedTile";
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import {PaintedSquare} from "../types/Polyomino";
import {getOccupiedSquares, getTilesFromTarget} from "../utils/getSquaresStartLeft";
import {getPaintedCave, Painting} from "./PaintedCave";
import {cavesSize} from "./Caves";

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
        const painting = cave[y][x];
        if (painting !== Painting.Empty && painting !== Painting.Hunter) {
          column.add(painting)
        }
      }
      if (column.size >= 5) return true
    }
    return false
  }
}

const GoalA4: Goal = {
  face: Face.A,
  text: 'goalA4',
  hint: 'hintA4',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const animalsToCheck: Animal[] = [Animal.Fish, Animal.Ibex, Animal.Mammoth, Animal.Yak, Animal.Boar].filter(animal => occupiedSquares.filter(square => square.animal === animal).length >= 8)
    if (animalsToCheck.length === 0) return false
    for (const animal of animalsToCheck) {
      let listOfCheckedSquares: Coordinates[] = []
      const occupiedSquareByAnimal = occupiedSquares.filter(square => square.animal === animal)
      for (const square of occupiedSquareByAnimal) {
        if (listOfCheckedSquares.find(check => check.x === square.x && check.y === square.y) === undefined) {
          const result = [{x: square.x, y: square.y}].concat(getTilesFromTarget(square, [{x: square.x, y: square.y}], occupiedSquareByAnimal))
          if (result.length >= 8) {
            return true
          } else {
            listOfCheckedSquares = listOfCheckedSquares.concat(result)
          }
        }
      }
    }
    return false
  }
}

const GoalA5: Goal = {
  face: Face.A,
  text: 'goalA5',
  hint: 'hintA5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const hunterCoord: Coordinates = {x: cave[2].x, y: cave[2].y}
    return occupiedSquares.filter(square => square.x >= hunterCoord.x - 1 && square.x <= hunterCoord.x + 1 && square.y >= hunterCoord.y - 1 && square.y <= hunterCoord.y + 1).length === 9
  }
}

const GoalA6: Goal = {
  face: Face.A,
  text: 'goalA6',
  hint: 'hintA6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const animalsToCheck: Animal[] = [Animal.Fish, Animal.Ibex, Animal.Mammoth, Animal.Yak, Animal.Boar].filter(animal => occupiedSquares.filter(square => square.animal === animal).length >= 5)
    for (const animal of animalsToCheck) {
      for (const y of [0, 1, 2, 3, 4, 5, 6]) {
        let animalsInColumn: number = 0;
        for (const x of [0, 1, 2, 3, 4, 5, 6]) {
          const square = occupiedSquares.find(square => square.x === x && square.y === y)
          if (square !== undefined && square.animal === animal) {
            animalsInColumn++
          }
        }
        if (animalsInColumn >= 5) {
          return true
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
    const cave: PlacedTile[] = player.cave
    return cave.filter(polyo => polyo.tile < 27 && polyo.tile > 1).length >= 5
  }
}

const GoalA9: Goal = {
  face: Face.A,
  text: 'goalA9',
  hint: 'hintA9',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const coordToCheck: Coordinates[] = [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: -1, y: 2}, {x: 0, y: 2}, {x: 1, y: 2}, {x: 2, y: 2}, {
      x: 2,
      y: 1
    }, {x: 2, y: 0}, {x: 2, y: -1}, {x: 1, y: -1}, {x: 0, y: -1}]
    for (const polyo of cave) {
      if (polyo.tile > 71) {
        if (coordToCheck.every(coord => polyo.x + coord.x < 0 || polyo.x + coord.x > 6 || polyo.y + coord.y < 0 || polyo.y + coord.y > 6 || occupiedSquares.find(square => square.x === polyo.x + coord.x && square.y === polyo.y + coord.y) !== undefined)) return true
      }
    }
    return false
  }
}

const GoalB1: Goal = {
  face: Face.B,
  text: 'goalB1',
  hint: 'hintB1',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const totems = cave.filter(polyo => polyo.tile === 1)
    const coordToCheck: Coordinates[] = [{x: -1, y: -1}, {x: -1, y: 0}, {x: -1, y: 1}, {x: 0, y: 1}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 1, y: -1}, {x: 0, y: -1}]
    return totems.every(tile => coordToCheck.every(coord => occupiedSquares.find(square => square.x === tile.x + coord.x && square.y === tile.y + coord.y)))
  }
}

const GoalB2: Goal = {
  face: Face.B,
  text: 'goalB2',
  hint: 'hintB2',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    return [0, 1, 2, 3, 4, 5, 6].every(x => occupiedSquares.find(square => square.x === x && square.y === 6))
  }
}

const GoalB3: Goal = {
  face: Face.B,
  text: 'goalB3',
  hint: 'hintB3',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    for (const x of [0, 1, 2, 3, 4, 5, 6]) {
      const animalsInLine: Animal[] = [];
      for (const y of [0, 1, 2, 3, 4, 5, 6]) {
        const square = occupiedSquares.find(square => square.x === x && square.y === y)
        if (square !== undefined && animalsInLine.includes(square.animal) === false && square.animal !== Animal.Hunter) {
          animalsInLine.push(square.animal)
        }
      }
      if (animalsInLine.length >= 5) {
        return true
      }
    }
    return false
  }
}

const GoalB4: Goal = {
  face: Face.B,
  text: 'goalB4',
  hint: 'hintB4',
  value: 3,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const animalsToCheck: Animal[] = [Animal.Fish, Animal.Ibex, Animal.Mammoth, Animal.Yak, Animal.Boar].filter(animal => occupiedSquares.filter(square => square.animal === animal).length >= 10)
    if (animalsToCheck.length === 0) return false
    for (const animal of animalsToCheck) {
      let listOfCheckedSquares: Coordinates[] = []
      const occupiedSquareByAnimal = occupiedSquares.filter(square => square.animal === animal)
      for (const square of occupiedSquareByAnimal) {
        if (listOfCheckedSquares.find(check => check.x === square.x && check.y === square.y) === undefined) {
          const result = [{x: square.x, y: square.y}].concat(getTilesFromTarget(square, [{x: square.x, y: square.y}], occupiedSquareByAnimal))
          if (result.length >= 10) {
            return true
          } else {
            listOfCheckedSquares = listOfCheckedSquares.concat(result)
          }
        }
      }
    }
    return false
  }
}

const GoalB5: Goal = {
  face: Face.B,
  text: 'goalB5',
  hint: 'hintB5',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const hunterCoord: Coordinates = {x: cave[2].x, y: cave[2].y}
    const adjacentAnimal: Animal[] = []
    for (const coord of [{x: -1, y: 0}, {x: 1, y: 0}, {x: 0, y: -1}, {x: 0, y: 1}]) {
      if (occupiedSquares.find(square => square.x === hunterCoord.x + coord.x && square.y === hunterCoord.y + coord.y && adjacentAnimal.includes(square.animal) === false)) {
        adjacentAnimal.push(occupiedSquares.find(square => square.x === hunterCoord.x + coord.x && square.y === hunterCoord.y + coord.y)!.animal)
      } else {
        return false
      }
    }
    return true
  }
}

const GoalB6: Goal = {
  face: Face.B,
  text: 'goalB6',
  hint: 'hintB6',
  value: 2,
  rule: (player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView) => {
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    const animalsToCheck: Animal[] = [Animal.Fish, Animal.Ibex, Animal.Mammoth, Animal.Yak, Animal.Boar].filter(animal => occupiedSquares.filter(square => square.animal === animal).length >= 5)
    for (const animal of animalsToCheck) {
      for (const x of [0, 1, 2, 3, 4, 5, 6]) {
        let animalsInLine: number = 0;
        for (const y of [0, 1, 2, 3, 4, 5, 6]) {
          const square = occupiedSquares.find(square => square.x === x && square.y === y)
          if (square !== undefined && square.animal === animal) {
            animalsInLine++
          }
        }
        if (animalsInLine >= 5) {
          return true
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
    const cave: PlacedTile[] = player.cave
    const occupiedSquares: PaintedSquare[] = getOccupiedSquares(cave)
    return [{x: 0, y: 0}, {x: 6, y: 0}, {x: 6, y: 6}, {x: 0, y: 6}].every(coord => occupiedSquares.find(square => square.x === coord.x && square.y === coord.y))
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
    const cave: PlacedTile[] = player.cave
    const legendaryTiles = cave.filter(tile => tile.tile > 71)
    for (const polyo of legendaryTiles) {
      if (legendaryTiles.find(tile => ((tile.x === polyo.x + 2 && tile.y === polyo.y) || (tile.y === polyo.y + 2 && tile.x === polyo.x)))) return true
    }
    return false
  }
}

export const goals = [
  GoalA1, GoalA2, GoalA3, GoalA4, GoalA5, GoalA6, GoalA7, GoalA8, GoalA9,
  GoalB1, GoalB2, GoalB3, GoalB4, GoalB5, GoalB6, GoalB7, GoalB8, GoalB9
]
