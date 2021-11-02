enum Painting {
  Hunter, TotemicAnimal,
  Fish1, Fish2, Fish3A, Fish3B, Fish4A, Fish4B,
  Mammoth1, Mammoth2, Mammoth3A, Mammoth3B, Mammoth4A, Mammoth4B,
  Buffalo1, Buffalo2, Buffalo3A, Buffalo3B, Buffalo4A, Buffalo4B,
  Ibex1, Ibex2, Ibex3A, Ibex3B, Ibex4A, Ibex4B,
  Boar1, Boar2, Boar3A, Boar3B, Boar4A, Boar4B,
  Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

const X = true, _ = false

export function getPolyomino(tile: Painting, flipped?: boolean): boolean[][] {
  switch (tile) {
    case Painting.Hunter:
    case Painting.TotemicAnimal:
    case Painting.Fish1:
    case Painting.Mammoth1:
    case Painting.Buffalo1:
    case Painting.Ibex1:
    case Painting.Boar1:
      return [[X]]
    case Painting.Fish2:
    case Painting.Mammoth2:
    case Painting.Buffalo2:
    case Painting.Ibex2:
    case Painting.Boar2:
      return !flipped ? [
        [X, X]
      ] : [
        [X],
        [X]
      ]
    case Painting.Fish3A:
    case Painting.Mammoth3A:
    case Painting.Buffalo3A:
      return !flipped ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Painting.Fish3B:
    case Painting.Mammoth3B:
    case Painting.Buffalo3B:
      return !flipped ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Painting.Ibex3A:
    case Painting.Boar3A:
      return !flipped ? [
        [X, _],
        [X, X]
      ] : [
        [X, X],
        [_, X]
      ]
    case Painting.Ibex3B:
    case Painting.Boar3B:
      return !flipped ? [
        [_, X],
        [X, X]
      ] : [
        [X, X],
        [X, _]
      ]
    case Painting.Fish4A:
    case Painting.Ibex4A:
      return !flipped ? [
        [X, X, _],
        [_, X, X]
      ] : [
        [_, X, X],
        [X, X, _]
      ]
    case Painting.Fish4B:
    case Painting.Mammoth4B:
      return !flipped ? [
        [_, X],
        [X, X],
        [_, X]
      ] : [
        [X, _],
        [X, X],
        [X, _]
      ]
    case Painting.Mammoth4A:
    case Painting.Buffalo4A:
    case Painting.Boar4A:
      return !flipped ? [
        [_, X],
        [X, X],
        [X, _]
      ] : [
        [X, _],
        [X, X],
        [_, X]
      ]
    case Painting.Buffalo4B:
      return !flipped ? [
        [_, X],
        [X, X],
        [_, X]
      ] : [
        [X, X, X],
        [_, X, _]
      ]
    case Painting.Ibex4B:
    case Painting.Boar4B:
      return !flipped ? [
        [_, X, _],
        [X, X, X]
      ] : [
        [X, X, X],
        [_, X, _]
      ]
    case Painting.Legendary1:
    case Painting.Legendary2:
    case Painting.Legendary3:
    case Painting.Legendary4:
    case Painting.Legendary5:
      return [
        [X, X],
        [X, X]
      ]
  }
}

export default Painting