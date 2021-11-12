/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import {playerCouldDraw, playerWillDraw} from '@gamepark/prehistories/Prehistories'
import { getPlayerName } from '@gamepark/prehistories/PrehistoriesOptions'
import Phase, { HuntPhase } from '@gamepark/prehistories/types/Phase'
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
  const player = game.players.find(p => p.color === playerId)!
  const players = usePlayers<PlayerColor>()

  switch(game.phase){
    case Phase.Initiative:{
      if(player.isReady === true){
        if(game.players.every(p => p.isReady === true)){
          return <> {t("initiative.reveal")} </>
        } else if (game.players.filter(p => p.isReady === false).length === 1){
          return <> {t("initiative.one.player.play.and.validate",{player:getPseudo(game.players.find(p => p.isReady === false)!.color,players,t)})} </>
        } else {
          return <> {t("initiative.other.players.play.and.validate")} </>
        }
      } else {
        return <> {t("initiative.you.play.and.validate")} </>
      }
    }
    case Phase.Hunt:{
      const activePlayer = game.players.find(p => p.color === game.sortedPlayers![0])!
      switch(activePlayer.hunting?.huntPhase){
        case HuntPhase.Hunt:{
          return activePlayer.color === playerId ? <> {t("hunt.you.hunt.tile")} </> : <> {t("hunt.player.hunt.tile",{player:getPseudo(activePlayer.color,players,t)})} </>
        }
        case HuntPhase.Pay:{
          return activePlayer.color === playerId ? <> {t("hunt.you.pay.tile")} </> : <> {t("hunt.player.pay.tile",{player:getPseudo(activePlayer.color,players,t)})} </>
        }
        case HuntPhase.DrawCards:{
          const cardsDraw:number = playerWillDraw(activePlayer)
          if (cardsDraw !== 0){
            return activePlayer.color === playerId ? <> {t("hunt.you.draw.cards", {cards:cardsDraw})} </> : <> {t("hunt.player.draw.cards",{player:getPseudo(activePlayer.color,players,t), cards:cardsDraw})} </>
          } else {
            return activePlayer.color === playerId ? <> {t("hunt.you.draw.no.card")} </> : <> {t("hunt.player.draw.no.card",{player:getPseudo(activePlayer.color,players,t)})} </>
          }
        }
        default:{
          return activePlayer.color === playerId ? <> {t("hunt.you.complete.objectives")} </> : <> {t("hunt.player.complete.objectives",{player:getPseudo(activePlayer.color,players,t)})} </>
        }
      }
    } 
    default:{
      return <> {t("Hunting the text bar...")} </>
    }
  }

}