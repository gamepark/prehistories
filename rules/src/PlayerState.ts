import { shuffle } from 'lodash';
import { getColoredDeck } from './material/Hunters';
import { allPolyominos } from './material/Polyominos';
import PlayerColor from './PlayerColor'
import PlacedTile from './types/PlacedTile';
import Hunting from './types/Hunting';

export default interface PlayerState {
  color: PlayerColor
  cave:PlacedTile[]
  totemTokens:number
  discard:number[]
  hand:number[]
  deck:number[]
  played:number[]
  variableGoalsMade:number[]
  isReady?:boolean
  hunting?:Hunting
}

export function setupDeck(color:PlayerColor):number[]{
  return shuffle(Array.from(getColoredDeck(color).keys()))
}

export function setupCave(color:PlayerColor):PlacedTile[]{
  const cave:PlacedTile[] = []
  const polyominosArray : number[] = Array.from(allPolyominos.keys())
  switch(color){
    case PlayerColor.Yellow :
      {
        cave.push({tile:polyominosArray[1],side:0, x:1, y:1})
        cave.push({tile:polyominosArray[1],side:0, x:5, y:4})
        cave.push({tile:polyominosArray[0],side:0, x:3, y:2})
        break
      }
    case PlayerColor.Blue :
      {
        cave.push({tile:polyominosArray[1],side:0, x:5, y:1})
        cave.push({tile:polyominosArray[1],side:0, x:2, y:5})
        cave.push({tile:polyominosArray[0],side:0, x:4, y:3})
        break
      }
    case PlayerColor.Red :
      {
        cave.push({tile:polyominosArray[1],side:0, x:1, y:4})
        cave.push({tile:polyominosArray[1],side:0, x:5, y:1})
        cave.push({tile:polyominosArray[0],side:0, x:3, y:3})
        break
      }
    case PlayerColor.Green :
      {
        cave.push({tile:polyominosArray[1],side:0, x:2, y:5})
        cave.push({tile:polyominosArray[1],side:0, x:5, y:1})
        cave.push({tile:polyominosArray[0],side:0, x:3, y:3})
        break
      }
    case PlayerColor.White :
      {
        cave.push({tile:polyominosArray[1],side:0, x:1, y:2})
        cave.push({tile:polyominosArray[1],side:0, x:5, y:5})
        cave.push({tile:polyominosArray[0],side:0, x:3, y:4})
        break
      }
  }
  return cave
}

