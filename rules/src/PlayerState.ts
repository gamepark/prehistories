import {shuffle} from 'lodash';
import {getColoredDeck} from './material/Hunters';
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
  variableObjectivesMade:number[]
  isReady?:boolean
  hunting?:Hunting
}

export function setupDeck(color:PlayerColor):number[]{
  return shuffle(Array.from(getColoredDeck(color).keys()))
}
