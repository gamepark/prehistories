import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'

export type PrehistoriesPlayerOptions = { id: PlayerColor }

export type PrehistoriesOptions = {
  players:PrehistoriesPlayerOptions[]
  isExpertGame:boolean      // To reduce
}

export function isGameOptions(arg: GameState | PrehistoriesOptions): arg is PrehistoriesOptions {
  return typeof (arg as GameState).tilesDeck === 'undefined'
}

export const PrehistoriesOptionsSpec: OptionsSpec<PrehistoriesOptions> = {
  isExpertGame:{
    label:(t:Function) => t('Cartes Objectifs Jour et Nuit'),
    subscriberRequired:true
  },
  
  players: {
    id: {
      label: (t: TFunction) => t('Color'),
      values: playerColors,
      valueSpec: color => ({label:t => getPlayerName(color, t)})
    }
  }

}

export function getPlayerName(playerId: PlayerColor, t: TFunction) {
  switch (playerId) {
    case PlayerColor.Blue:
      return t('Blue player')
    case PlayerColor.Green:
      return t('Green player')
    case PlayerColor.Red:
      return t('Red player')
    case PlayerColor.White:
      return t('White player')
    case PlayerColor.Yellow:
      return t('Yellow player')
  }
}