import Animal from '../types/Animal'
import Coordinates from '../types/Coordinates'
import Polyomino from '../types/Polyomino'
import Tile, {getPolyomino} from './Tile'

function paintingToAnimal(painting: Tile): Animal {
  switch (painting) {
    case Tile.Hunter:
      return Animal.Hunter
    case Tile.TotemicAnimal:
      return Animal.Totem
    case Tile.Fish1:
    case Tile.Fish2:
    case Tile.Fish3A:
    case Tile.Fish3B:
    case Tile.Fish4A:
    case Tile.Fish4B:
      return Animal.Fish
    case Tile.Mammoth1:
    case Tile.Mammoth2:
    case Tile.Mammoth3A:
    case Tile.Mammoth3B:
    case Tile.Mammoth4A:
    case Tile.Mammoth4B:
      return Animal.Mammoth
    case Tile.Buffalo1:
    case Tile.Buffalo2:
    case Tile.Buffalo3A:
    case Tile.Buffalo3B:
    case Tile.Buffalo4A:
    case Tile.Buffalo4B:
      return Animal.Yak
    case Tile.Ibex1:
    case Tile.Ibex2:
    case Tile.Ibex3A:
    case Tile.Ibex3B:
    case Tile.Ibex4A:
    case Tile.Ibex4B:
      return Animal.Ibex
    case Tile.Boar1:
    case Tile.Boar2:
    case Tile.Boar3A:
    case Tile.Boar3B:
    case Tile.Boar4A:
    case Tile.Boar4B:
      return Animal.Boar
    case Tile.Legendary1:
      return Animal.Legendary1
    case Tile.Legendary2:
      return Animal.Legendary2
    case Tile.Legendary3:
      return Animal.Legendary3
    case Tile.Legendary4:
      return Animal.Legendary4
    case Tile.Legendary5:
      return Animal.Legendary5
  }
}

function getReversedCoordinates(painting: Tile, flipped?: boolean): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let x = 0; x < getPolyomino(painting, flipped).length; x++) {
    const row = getPolyomino(painting, flipped)[x]
    for (let y = 0; y < row.length; y++) {
      if (row[y]) {
        coordinates.push({x, y})
      }
    }
  }
  return coordinates
}

function paintingToPolyomino(painting: Tile): Polyomino {
  const animal = paintingToAnimal(painting)
  return [{
    animal: animal,
    coordinates: getReversedCoordinates(painting)
  }, {
    animal: animal,
    coordinates: getReversedCoordinates(painting, true)
  }]
}

export const allPolyominos: Polyomino[] = [
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
].map(paintingToPolyomino)
