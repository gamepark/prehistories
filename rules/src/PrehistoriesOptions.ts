import {GameOptions, OptionsDescription, OptionType} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'

export type PrehistoriesGameOptions = {
  isExpertGame:boolean
}

export type PrehistoriesPlayerOptions = { id: PlayerColor }

export type PrehistoriesOptions = GameOptions<PrehistoriesGameOptions, PrehistoriesPlayerOptions>

export function isGameOptions(arg: GameState | PrehistoriesOptions): arg is PrehistoriesOptions {
  return typeof (arg as GameState).tilesDeck === 'undefined'
}

export const PrehistoriesOptionsDescription: OptionsDescription<PrehistoriesGameOptions, PrehistoriesPlayerOptions> = {
  isExpertGame:{
    type:OptionType.BOOLEAN,
    getLabel:(t:Function) => t('Cartes Objectifs Jour et Nuit')
  },
  
  players: {
    id: {
      type: OptionType.LIST,
      getLabel: (t: TFunction) => t('Color'),
      values: playerColors,
      getValueLabel: getPlayerName
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