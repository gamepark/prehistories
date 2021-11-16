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
}

export function setupDeck(color:PlayerColor):number[]{
  return shuffle(Array.from(getColoredDeck(color).keys()))
}
