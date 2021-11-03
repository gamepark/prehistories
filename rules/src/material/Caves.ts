import PlayerColor from '../PlayerColor'

export const cavesSize = 7

export enum Space {
  EMPTY, HUNTER, TOTEM_ANIMAL, HAND, HAND2
}

const _ = Space.EMPTY
const H = Space.HUNTER
const T = Space.TOTEM_ANIMAL
const a = Space.HAND
const b = Space.HAND2

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