import { shuffle } from 'lodash';
import { getColoredDeck } from './material/Hunters';
import { allPolyominos } from './material/Polyominos';
import PlayerColor from './PlayerColor'
import PaintedPolyominos from './types/PaintedPolyominos';

export default interface PlayerState {
  color: PlayerColor
  cave:PaintedPolyominos[]
  totemTokens:number
  discard:number[]
  hand:number[]
  deck:number[]
  goalsMade:number[]
  tilesInHand?:number[]
  injuries?:number
  isReady?:boolean
}

export function setupDeck(color:PlayerColor):number[]{
  return shuffle(Array.from(getColoredDeck(color).keys()))
}

export function setupCave(color:PlayerColor):PaintedPolyominos[]{
  const cave:PaintedPolyominos[] = []
  const polyominosArray : number[] = Array.from(allPolyominos.keys())
  switch(color){
    case PlayerColor.Yellow :
      {
        cave.push({polyomino:polyominosArray[1],side:0, x:1, y:1})
        cave.push({polyomino:polyominosArray[1],side:0, x:5, y:4})
        cave.push({polyomino:polyominosArray[0],side:0, x:3, y:2})
        break
      }
    case PlayerColor.Blue :
      {
        cave.push({polyomino:polyominosArray[1],side:0, x:5, y:1})
        cave.push({polyomino:polyominosArray[1],side:0, x:2, y:5})
        cave.push({polyomino:polyominosArray[0],side:0, x:4, y:3})
        break
      }
    case PlayerColor.Red :
      {
        cave.push({polyomino:polyominosArray[1],side:0, x:2, y:5})
        cave.push({polyomino:polyominosArray[1],side:0, x:5, y:1})
        cave.push({polyomino:polyominosArray[0],side:0, x:3, y:3})
        break
      }
    case PlayerColor.Green :
      {
        cave.push({polyomino:polyominosArray[1],side:0, x:2, y:5})
        cave.push({polyomino:polyominosArray[1],side:0, x:5, y:1})
        cave.push({polyomino:polyominosArray[0],side:0, x:3, y:3})
        break
      }
    case PlayerColor.White :
      {
        cave.push({polyomino:polyominosArray[1],side:0, x:2, y:5})
        cave.push({polyomino:polyominosArray[1],side:0, x:5, y:1})
        cave.push({polyomino:polyominosArray[0],side:0, x:3, y:3})
        break
      }
  }
  return cave
}