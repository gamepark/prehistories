import {OptionsSpec} from '@gamepark/rules-api'
import {TFunction} from 'i18next'
import GameState from './GameState'
import PlayerColor, {playerColors} from './PlayerColor'

export type PrehistoriesPlayerOptions = { id: PlayerColor }

export type PrehistoriesOptions = {
  players: PrehistoriesPlayerOptions[]
  beginner: boolean
}

export function isGameOptions(arg: GameState | PrehistoriesOptions): arg is PrehistoriesOptions {
  return !arg.hasOwnProperty('huntingBoard')
}

export const PrehistoriesOptionsSpec: OptionsSpec<PrehistoriesOptions> = {
  beginner: {
    label: (t: Function) => t('Beginner game'),
    help: t => t('beginner.help')
  },

  players: {
    id: {
      label: (t: TFunction) => t('Color'),
      values: playerColors,
      valueSpec: color => ({label: t => getPlayerName(color, t)})
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