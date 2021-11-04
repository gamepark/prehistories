import PlayerState from "../PlayerState";
import {PlayerHuntView, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import caves, {Space} from "./Caves";
import {getPlacedTileCoordinates} from "../types/PlacedTile";
import Tile, {tiles} from "./Tile";

export enum Painting {
  Empty, Hunter, TotemAnimal, Fish, Mammoth = 1, Buffalo, Ibex, Boar,
  Legendary1, Legendary2, Legendary3, Legendary4, Legendary5
}

export function getPaintedCave(player: PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): Painting[][] {
  const cave: Painting[][] = caves[player.color].map(row =>
    row.map(space => {
      switch (space) {
        case Space.Empty:
        case Space.Hand:
        case Space.Hand2:
          return Painting.Empty
        case Space.Hunter:
          return Painting.Hunter
        case Space.TotemAnimal:
          return Painting.TotemAnimal
      }
    })
  )
  for (const placedTile of player.cave) {
    for (const {x, y} of getPlacedTileCoordinates(placedTile)) {
      cave[y][x] = getAnimal(tiles[placedTile.tile])
    }
  }
  return cave
}

function getAnimal(tile: Tile): Painting {
  switch (tile) {
    case Tile.Hunter:
      return Painting.Hunter
    case Tile.TotemAnimal:
      return Painting.TotemAnimal
    case Tile.Fish1:
    case Tile.Fish2:
    case Tile.Fish3A:
    case Tile.Fish3B:
    case Tile.Fish4A:
    case Tile.Fish4B:
      return Painting.Fish
    case Tile.Mammoth1:
    case Tile.Mammoth2:
    case Tile.Mammoth3A:
    case Tile.Mammoth3B:
    case Tile.Mammoth4A:
    case Tile.Mammoth4B:
      return Painting.Mammoth
    case Tile.Buffalo1:
    case Tile.Buffalo2:
    case Tile.Buffalo3A:
    case Tile.Buffalo3B:
    case Tile.Buffalo4A:
    case Tile.Buffalo4B:
      return Painting.Buffalo
    case Tile.Ibex1:
    case Tile.Ibex2:
    case Tile.Ibex3A:
    case Tile.Ibex3B:
    case Tile.Ibex4A:
    case Tile.Ibex4B:
      return Painting.Ibex
    case Tile.Boar1:
    case Tile.Boar2:
    case Tile.Boar3A:
    case Tile.Boar3B:
    case Tile.Boar4A:
    case Tile.Boar4B:
      return Painting.Boar
    case Tile.Legendary1:
      return Painting.Legendary1
    case Tile.Legendary2:
      return Painting.Legendary2
    case Tile.Legendary3:
      return Painting.Legendary3
    case Tile.Legendary4:
      return Painting.Legendary4
    case Tile.Legendary5:
      return Painting.Legendary5
  }
}
