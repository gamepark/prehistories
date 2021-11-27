import {shuffle} from 'lodash';
import {getColoredDeck} from './material/Hunters';
import PlayerColor from './PlayerColor'
import PlacedTile from './types/PlacedTile';
import Hunting from './types/Hunting';
import Objective from "./material/Objective";

export default interface PlayerState {
  color: PlayerColor
  cave:PlacedTile[]
  totemTokens: Objective[]
  discard:number[]
  hand:number[]
  deck:number[]
  played:number[]
  isReady?:boolean
  hunting?:Hunting
  order?: number // Convenient for display usage only
}

export function setupDeck(color:PlayerColor, isTutorial:boolean):number[]{
  return isTutorial ? getTutoColoredDeck(color) : shuffle(Array.from(getColoredDeck(color).keys()))
}

function getTutoColoredDeck(color:PlayerColor):number[]{
  switch(color){
    case PlayerColor.Yellow:
      return [2,4,6,3,8,10,0,5,7,1,9,11]
    case PlayerColor.Green:
      return [0,6,7,1,11,4,2,8,10,9,5,3]
    case PlayerColor.White:
      return [2,4,0,3,6,10,11,5,8,7,1,9]
    default:
      throw("error : "+color+" is not a color prepared for the tutorial !")
  }
}