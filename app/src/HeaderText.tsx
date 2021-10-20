/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import { getPlayerName } from '@gamepark/prehistories/PrehistoriesOptions'
import { Player as PlayerInfo, usePlayerId, usePlayers } from '@gamepark/react-client'
import { TFunction } from 'i18next'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading || !game) return <>{t('Game loading...')}</>

  if (!game.phase){
    return <HeaderGameOverText game={game} />
  } else {
    return <HeaderOnGoingGameText game={game} />
  }
}

function getPseudo(player: PlayerColor, players: PlayerInfo<PlayerColor>[], t: TFunction): string {
  if (players.find(p => p.id === player, t)!.name === undefined) {
    return getPlayerName(player, t)
     
  } else {
      return players.find(p => p.id === player, t)!.name!
  }
}

function HeaderGameOverText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerColor>()
  const players = usePlayers<PlayerColor>()
  const winner = game.players.find(p => p.totemTokens === 0)!
  if(winner.color === playerId){
    return <> {t("game.over.you.win")} </>
  } else {
    return <> {t("game.over.player.win",{player:getPseudo(winner.color, players,t)})} </>
  }

}

function HeaderOnGoingGameText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerColor>()
  const players = usePlayers<PlayerColor>()

  return <> {t("Hunting the text bar...")} </>
}