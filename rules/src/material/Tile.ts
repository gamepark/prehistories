enum Tile {
  Hunter, TotemicAnimal,
  Fish1, Fish2, Fish3A, Fish3B, Fish4A, Fish4B,
  Mammoth1, Mammoth2, Mammoth3A, Mammoth3B, Mammoth4A, Mammoth4B,
  Buffalo1, Buffalo2, Buffalo3A, Buffalo3B, Buffalo4A, Buffalo4B,
  Ibex1, Ibex2, Ibex3A, Ibex3B, Ibex4A, Ibex4B,
  Boar1, Boar2, Boar3A, Boar3B, Boar4A, Boar4B,
  Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

export const tiles = [
  Tile.Hunter, Tile.TotemicAnimal,
  Tile.Fish1, Tile.Fish1, Tile.Fish1, Tile.Fish1, Tile.Fish1,
  Tile.Mammoth1, Tile.Mammoth1, Tile.Mammoth1, Tile.Mammoth1, Tile.Mammoth1,
  Tile.Ibex1, Tile.Ibex1, Tile.Ibex1, Tile.Ibex1, Tile.Ibex1,
  Tile.Buffalo1, Tile.Buffalo1, Tile.Buffalo1, Tile.Buffalo1, Tile.Buffalo1,
  Tile.Boar1, Tile.Boar1, Tile.Boar1, Tile.Boar1, Tile.Boar1,
  Tile.Fish2, Tile.Fish2, Tile.Fish2, Tile.Fish2, Tile.Fish2,
  Tile.Mammoth2, Tile.Mammoth2, Tile.Mammoth2, Tile.Mammoth2, Tile.Mammoth2,
  Tile.Ibex2, Tile.Ibex2, Tile.Ibex2, Tile.Ibex2, Tile.Ibex2,
  Tile.Buffalo2, Tile.Buffalo2, Tile.Buffalo2, Tile.Buffalo2, Tile.Buffalo2,
  Tile.Boar2, Tile.Boar2, Tile.Boar2, Tile.Boar2, Tile.Boar2,
  Tile.Fish3A, Tile.Fish3B,
  Tile.Mammoth3A, Tile.Mammoth3B,
  Tile.Ibex3A, Tile.Ibex3B,
  Tile.Buffalo3A, Tile.Buffalo3B,
  Tile.Boar3A, Tile.Boar3B,
  Tile.Fish4A, Tile.Fish4B,
  Tile.Mammoth4A, Tile.Mammoth4B,
  Tile.Ibex4A, Tile.Ibex4B,
  Tile.Buffalo4A, Tile.Buffalo4B,
  Tile.Boar4A, Tile.Boar4B,
  Tile.Legendary1, Tile.Legendary2, Tile.Legendary3, Tile.Legendary4, Tile.Legendary5
]

const X = true, _ = false

export function getPolyomino(tile: Tile, flipped?: boolean): boolean[][] {
  switch (tile) {
    case Tile.Hunter:
    case Tile.TotemicAnimal:
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
      return !flipped ? [
        [X, X]
      ] : [
        [X],
        [X]
      ]
    case Tile.Fish3A:
    case Tile.Mammoth3A:
    case Tile.Buffalo3A:
      return !flipped ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Tile.Fish3B:
    case Tile.Mammoth3B:
    case Tile.Buffalo3B:
      return !flipped ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Tile.Ibex3A:
    case Tile.Boar3A:
      return !flipped ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Tile.Ibex3B:
    case Tile.Boar3B:
      return !flipped ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Tile.Fish4A:
    case Tile.Ibex4A:
      return !flipped ? [
        [X, X, _],
        [_, X, X]
      ] : [
        [_, X, X],
        [X, X, _]
      ]
    case Tile.Fish4B:
    case Tile.Mammoth4B:
      return !flipped ? [
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
      return !flipped ? [
        [_, X],
        [X, X],
        [X, _]
      ] : [
        [X, _],
        [X, X],
        [_, X]
      ]
    case Tile.Buffalo4B:
      return !flipped ? [
        [_, X],
        [X, X],
        [_, X]
      ] : [
        [X, X, X],
        [_, X, _]
      ]
    case Tile.Ibex4B:
    case Tile.Boar4B:
      return !flipped ? [
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

export default Tile