import PlayerColor from '../PlayerColor'
import Coordinates from "../types/Coordinates";

export const cavesSize = 7

export enum Space {
  Empty, Hunter, TotemAnimal, Hand, Hand2
}

const _ = Space.Empty
const H = Space.Hunter
const T = Space.TotemAnimal
const a = Space.Hand
const b = Space.Hand2

const caves: { [key in PlayerColor]: Space[][] } = {
  [PlayerColor.Yellow]: [
    [_, _, _, _, _, _, _],
    [_, T, _, _, _, _, _],
    [_, _, _, _, _, b, _],
    [_, _, H, _, _, _, _],
    [_, _, _, a, _, _, _],
    [_, _, _, _, T, _, _],
    [_, _, _, _, _, _, _]
  ],
  [PlayerColor.Blue]: [
    [_, _, _, _, _, _, _],
    [_, _, a, _, _, _, _],
    [_, _, _, _, _, T, _],
    [_, _, _, _, b, _, _],
    [_, _, _, H, _, _, _],
    [_, T, _, _, _, _, _],
    [_, _, _, _, _, _, _]
  ],
  [PlayerColor.Red]: [
    [_, _, a, _, _, _, _],
    [_, _, _, _, T, _, _],
    [_, _, _, _, _, _, _],
    [_, _, _, H, _, _, _],
    [_, _, _, _, _, b, _],
    [_, T, _, _, _, _, _],
    [_, _, _, _, _, _, _]
  ],
  [PlayerColor.Green]: [
    [_, _, _, _, _, _, _],
    [_, _, a, _, _, _, _],
    [_, _, _, _, _, T, _],
    [_, _, _, H, _, _, _],
    [_, _, _, _, _, _, _],
    [_, T, _, _, _, _, _],
    [_, _, _, _, b, _, _]
  ],
  [PlayerColor.White]: [
    [_, _, _, _, _, _, _],
    [_, _, T, _, _, _, _],
    [_, _, _, b, _, _, _],
    [_, _, _, _, H, _, _],
    [_, _, _, _, _, _, _],
    [_, a, _, _, _, T, _],
    [_, _, _, _, _, _, _]
  ]
}

export default caves

export function getHunterCoordinates(player: PlayerColor): Coordinates {
  for (let y = 1; y < cavesSize - 1; y++) {
    for (let x = 1; x < cavesSize - 1; x++) {
      if (caves[player][y][x] === Space.Hunter) {
        return {x, y}
      }
    }
  }
  throw new Error(`Hunter is missing for ${player}`)
}

export function getTotemCoordinates(player: PlayerColor): Coordinates[] {
  const coordinates: Coordinates[] = []
  for (let y = 1; y < cavesSize - 1; y++) {
    for (let x = 1; x < cavesSize - 1; x++) {
      if (caves[player][y][x] === Space.TotemAnimal) {
        coordinates.push({x, y})
        if (coordinates.length === 2) return coordinates
      }
    }
  }
  throw new Error(`At least one totem animal is missing for ${player}`)
}
