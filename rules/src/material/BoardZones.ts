type Zone = {
  type: number
  injury: number
  safe: number
}

const fewPlayersSide: Zone[] = [
  {type: 0, injury: 1, safe: 4},
  {type: 1, injury: 4, safe: 7},
  {type: 2, injury: 7, safe: 10},
  {type: 3, injury: 10, safe: 13},
  {type: 4, injury: 13, safe: 16},
]

const morePlayersSide: Zone[] = [
  {type: 0, injury: 2, safe: 3},
  {type: 0, injury: 1, safe: 4},
  {type: 1, injury: 4, safe: 7},
  {type: 1, injury: 5, safe: 8},
  {type: 2, injury: 7, safe: 10},
  {type: 3, injury: 10, safe: 13},
  {type: 4, injury: 13, safe: 16},
]

export default function getBoardZones(players: number) {
  return players < 4 ? fewPlayersSide : morePlayersSide
}