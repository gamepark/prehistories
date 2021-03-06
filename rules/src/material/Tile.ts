import Coordinates from "../types/Coordinates";
import {shuffle} from 'lodash'

enum Tile {
  Fish1 = 1, Fish2, Fish3A, Fish3B, Fish4A, Fish4B,
  Mammoth1, Mammoth2, Mammoth3A, Mammoth3B, Mammoth4A, Mammoth4B,
  Buffalo1, Buffalo2, Buffalo3A, Buffalo3B, Buffalo4A, Buffalo4B,
  Ibex1, Ibex2, Ibex3A, Ibex3B, Ibex4A, Ibex4B,
  Boar1, Boar2, Boar3A, Boar3B, Boar4A, Boar4B,
  Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

export function setupTilesDeck(): number[][] {
  return [
    shuffle([Tile.Fish1, Tile.Mammoth1, Tile.Buffalo1, Tile.Ibex1, Tile.Boar1].flatMap(tile => [...Array(5)].fill(tile))),
    shuffle([Tile.Fish2, Tile.Mammoth2, Tile.Buffalo2, Tile.Ibex2, Tile.Boar2].flatMap(tile => [...Array(5)].fill(tile))),
    shuffle([Tile.Fish3A, Tile.Fish3B, Tile.Mammoth3A, Tile.Mammoth3B, Tile.Buffalo3A, Tile.Buffalo3B, Tile.Ibex3A, Tile.Ibex3B, Tile.Boar3A, Tile.Boar3B]),
    shuffle([Tile.Fish4A, Tile.Fish4B, Tile.Mammoth4A, Tile.Mammoth4B, Tile.Buffalo4A, Tile.Buffalo4B, Tile.Ibex4A, Tile.Ibex4B, Tile.Boar4A, Tile.Boar4B]),
    shuffle([Tile.Legendary1, Tile.Legendary2, Tile.Legendary3, Tile.Legendary4, Tile.Legendary5])
  ]
}

export type Side = 0 | 1

export const sides: Side[] = [0, 1]

const X = true, _ = false

export function getPolyomino(tile: Tile, side: Side): boolean[][] {
  switch (tile) {
    case Tile.Fish1:
    case Tile.Mammoth1:
    case Tile.Buffalo1:
    case Tile.Ibex1:
    case Tile.Boar1:
      return [[X]]
    case Tile.Fish2:
    case Tile.Mammoth2:
    case Tile.Buffalo2:
    case Tile.Ibex2:
    case Tile.Boar2:
      return side === 0 ? [
        [X, X]
      ] : [
        [X],
        [X]
      ]
    case Tile.Fish3A:
    case Tile.Mammoth3A:
    case Tile.Buffalo3A:
      return side === 0 ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Tile.Fish3B:
    case Tile.Mammoth3B:
    case Tile.Buffalo3B:
      return side === 0 ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Tile.Ibex3A:
    case Tile.Boar3A:
      return side === 0 ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Tile.Ibex3B:
    case Tile.Boar3B:
      return side === 0 ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Tile.Fish4A:
    case Tile.Ibex4A:
      return side === 0 ? [
        [X, X, _],
        [_, X, X]
      ] : [
        [_, X, X],
        [X, X, _]
      ]
    case Tile.Fish4B:
    case Tile.Mammoth4B:
      return side === 0 ? [
        [_, X],
        [X, X],
        [_, X]
      ] : [
        [X, _],
        [X, X],
        [X, _]
      ]
    case Tile.Mammoth4A:
    case Tile.Buffalo4A:
    case Tile.Boar4A:
      return side === 0 ? [
        [_, X],
        [X, X],
        [X, _]
      ] : [
        [X, _],
        [X, X],
        [_, X]
      ]
    case Tile.Buffalo4B:
      return side === 0 ? [
        [X, X, X],
        [_, X, _]
      ] : [
        [_, X],
        [X, X],
        [_, X]
      ]
    case Tile.Ibex4B:
    case Tile.Boar4B:
      return side === 0 ? [
        [_, X, _],
        [X, X, X]
      ] : [
        [X, X, X],
        [_, X, _]
      ]
    case Tile.Legendary1:
    case Tile.Legendary2:
    case Tile.Legendary3:
    case Tile.Legendary4:
    case Tile.Legendary5:
      return [
        [X, X],
        [X, X]
      ]
  }
}

export function getPolyominoCoordinates(polyomino: boolean[][]): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let y = 0; y < polyomino.length; y++) {
    for (let x = 0; x < polyomino[y].length; x++) {
      if (polyomino[y][x]) coordinates.push({x: x, y: y})
    }
  }
  return coordinates
}

export function getPolyominoAdjacentCoordinates(polyomino: boolean[][]): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let y = 0; y < polyomino.length; y++) {
    for (let x = 0; x < polyomino[y].length; x++) {
      if (!polyomino[y][x]
        && (polyomino[y][x - 1] || polyomino[y][x + 1] || (polyomino[y - 1] && polyomino[y - 1][x]) || (polyomino[y + 1] && polyomino[y + 1][x]))) {
        coordinates.push({x, y})
      }
    }
  }
  for (let y = 0; y < polyomino.length; y++) {
    if (polyomino[y][0]) {
      coordinates.push({x: -1, y})
    }
    if (polyomino[y][polyomino[0].length - 1]) {
      coordinates.push({x: polyomino[0].length, y})
    }
  }
  for (let x = 0; x < polyomino[0].length; x++) {
    if (polyomino[0][x]) {
      coordinates.push({x, y: -1})
    }
    if (polyomino[polyomino.length - 1][x]) {
      coordinates.push({x, y: polyomino.length})
    }
  }
  return coordinates
}

export function isLegendaryAnimalTile(tile: Tile) {
  return tile === Tile.Legendary1 || tile === Tile.Legendary2 || tile === Tile.Legendary3 || tile === Tile.Legendary4 || tile === Tile.Legendary5
}

export function revertMatrix<T>(matrix: T[][]): T[][] {
  return matrix[0].map((_, x) => matrix.map((_, y) => matrix[y][x]))
}

export default Tile