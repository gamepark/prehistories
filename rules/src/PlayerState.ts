import { shuffle } from 'lodash';
import { getColoredDeck } from './material/Hunters';
import PlayerColor from './PlayerColor'
import Animal from './types/Animal';

import Card from './types/Card';
import Polyomino from './types/Polyomino';
import Square from './types/Square';

export default interface PlayerState {
  color: PlayerColor
  cave:Square[][]
  totemTokens:number
  discard:Card[]
  hand:Card[]
  deck:Card[]
  goalsMade:number[]
  tilesInHand?:Polyomino[]
  injuries?:number
  isReady?:boolean
}

export function setupDeck(color:PlayerColor):Card[]{
  return shuffle(getColoredDeck(color))
}

export function setupCave(color:PlayerColor):Square[][]{
  const cave:Square[][] = []
  for(let i=0; i<7;i++){
    const line:Square[] = []
    for (let j=0;j<7;j++){
      line.push({animal:undefined, coordinates:{x:i, y:j}})
    }
    cave.push(line)
  }
  switch(color){
    case PlayerColor.Yellow :
      {
        cave[1][1].animal = Animal.Totem
        cave[3][2].animal = Animal.Hunter
        cave[5][4].animal = Animal.Totem
        cave[4][3].animal = Animal.HandPrints
        cave[2][5].animal = Animal.HandPrints
        break
      }
    case PlayerColor.Blue :
      {
        cave[5][1].animal = Animal.Totem
        cave[4][3].animal = Animal.Hunter
        cave[2][5].animal = Animal.Totem
        cave[1][2].animal = Animal.HandPrints
        cave[3][4].animal = Animal.HandPrints
        break
      }
    case PlayerColor.Red :
      {
        cave[2][5].animal = Animal.Totem
        cave[3][3].animal = Animal.Hunter
        cave[5][1].animal = Animal.Totem
        cave[0][2].animal = Animal.HandPrints
        cave[4][5].animal = Animal.HandPrints
        break
      }
    case PlayerColor.Green :
      {
        cave[2][5].animal = Animal.Totem
        cave[3][3].animal = Animal.Hunter
        cave[5][1].animal = Animal.Totem
        cave[1][2].animal = Animal.HandPrints
        cave[6][4].animal = Animal.HandPrints
        break
      }
    case PlayerColor.White :
      {
        cave[2][5].animal = Animal.Totem
        cave[3][3].animal = Animal.Hunter
        cave[5][1].animal = Animal.Totem
        cave[2][3].animal = Animal.HandPrints
        cave[4][2].animal = Animal.HandPrints
        break
      }
  }
  return cave
}