import PlayerColor from '../PlayerColor'

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