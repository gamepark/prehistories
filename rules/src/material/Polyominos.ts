import Animal from '../types/Animal'
import Coordinates from '../types/Coordinates'
import Polyomino from '../types/Polyomino'
import Painting, {getPolyomino} from './Painting'

function paintingToAnimal(painting: Painting): Animal {
  switch (painting) {
    case Painting.Hunter:
      return Animal.Hunter
    case Painting.TotemicAnimal:
      return Animal.Totem
    case Painting.Fish1:
    case Painting. Fish2:
    case Painting. Fish3A:
    case Painting. Fish3B:
    case Painting. Fish4A:
    case Painting. Fish4B:
      return Animal.Fish
    case Painting.Mammoth1:
    case Painting. Mammoth2:
    case Painting. Mammoth3A:
    case Painting. Mammoth3B:
    case Painting. Mammoth4A:
    case Painting. Mammoth4B:
      return Animal.Mammoth
    case Painting.Buffalo1:
    case Painting. Buffalo2:
    case Painting. Buffalo3A:
    case Painting. Buffalo3B:
    case Painting. Buffalo4A:
    case Painting. Buffalo4B:
      return Animal.Yak
    case Painting.Ibex1:
    case Painting. Ibex2:
    case Painting. Ibex3A:
    case Painting. Ibex3B:
    case Painting. Ibex4A:
    case Painting. Ibex4B:
      return Animal.Ibex
    case Painting.Boar1:
    case Painting. Boar2:
    case Painting. Boar3A:
    case Painting. Boar3B:
    case Painting. Boar4A:
    case Painting. Boar4B:
      return Animal.Boar
    case Painting.Legendary1:
      return Animal.Legendary1
    case Painting. Legendary2:
      return Animal.Legendary2
    case Painting. Legendary3:
      return Animal.Legendary3
    case Painting. Legendary4:
      return Animal.Legendary4
    case Painting. Legendary5:
      return Animal.Legendary5
  }
}

function getReversedCoordinates(painting: Painting, flipped?: boolean): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let x = 0; x < getPolyomino(painting, flipped).length; x++){
    const row = getPolyomino(painting, flipped)[x]
    for (let y = 0; y < row.length; y++) {
      if (row[y]) {
        coordinates.push({x, y})
      }
    }
  }
  return coordinates
}

function paintingToPolyomino(painting: Painting): Polyomino {
  const animal = paintingToAnimal(painting)
  return [{
    animal: animal,
    coordinates: getReversedCoordinates(painting)
  }, {
    animal: animal,
    coordinates: getReversedCoordinates(painting, true)
  }]
}

export const allPolyominos:Polyomino[] = [
  Painting.Hunter, Painting.TotemicAnimal,
  Painting.Fish1, Painting.Fish1, Painting.Fish1, Painting.Fish1, Painting.Fish1,
  Painting.Mammoth1, Painting.Mammoth1, Painting.Mammoth1, Painting.Mammoth1, Painting.Mammoth1,
  Painting.Ibex1, Painting.Ibex1, Painting.Ibex1, Painting.Ibex1, Painting.Ibex1,
  Painting.Buffalo1, Painting.Buffalo1, Painting.Buffalo1, Painting.Buffalo1, Painting.Buffalo1,
  Painting.Boar1, Painting.Boar1, Painting.Boar1, Painting.Boar1, Painting.Boar1,
  Painting.Fish2, Painting.Fish2, Painting.Fish2, Painting.Fish2, Painting.Fish2,
  Painting.Mammoth2, Painting.Mammoth2, Painting.Mammoth2, Painting.Mammoth2, Painting.Mammoth2,
  Painting.Ibex2, Painting.Ibex2, Painting.Ibex2, Painting.Ibex2, Painting.Ibex2,
  Painting.Buffalo2, Painting.Buffalo2, Painting.Buffalo2, Painting.Buffalo2, Painting.Buffalo2,
  Painting.Boar2, Painting.Boar2, Painting.Boar2, Painting.Boar2, Painting.Boar2,
  Painting.Fish3A, Painting.Fish3B,
  Painting.Mammoth3A, Painting.Mammoth3B,
  Painting.Ibex3A, Painting.Ibex3B,
  Painting.Buffalo3A, Painting.Buffalo3B,
  Painting.Boar3A, Painting.Boar3B,
  Painting.Fish4A, Painting.Fish4B,
  Painting.Mammoth4A, Painting.Mammoth4B,
  Painting.Ibex4A, Painting.Ibex4B,
  Painting.Buffalo4A, Painting.Buffalo4B,
  Painting.Boar4A, Painting.Boar4B,
  Painting.Legendary1, Painting.Legendary2, Painting.Legendary3, Painting.Legendary4, Painting.Legendary5
].map(paintingToPolyomino)
