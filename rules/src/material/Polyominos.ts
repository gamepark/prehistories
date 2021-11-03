import Animal from '../types/Animal'
import Coordinates from '../types/Coordinates'
import Polyomino from '../types/Polyomino'
import Tile, {getPolyomino, Side, tiles} from './Tile'

function paintingToAnimal(painting: Tile): Animal {
  switch (painting) {
    case Tile.Hunter:
      return Animal.Hunter
    case Tile.TotemAnimal:
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

function getReversedCoordinates(painting: Tile, side: Side): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let x = 0; x < getPolyomino(painting, side).length; x++) {
    const row = getPolyomino(painting, side)[x]
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
    coordinates: getReversedCoordinates(painting, 0)
  }, {
    animal: animal,
    coordinates: getReversedCoordinates(painting, 1)
  }]
}

export const allPolyominos: Polyomino[] = tiles.map(paintingToPolyomino)
