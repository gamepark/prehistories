/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import {playerWillDraw} from '@gamepark/prehistories/Prehistories'
import {getPlayerName} from '@gamepark/prehistories/PrehistoriesOptions'
import {Player as PlayerInfo, useAnimation, usePlayerId, usePlayers} from '@gamepark/react-client'
import {TFunction} from 'i18next'
import {useTranslation} from 'react-i18next'
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";

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
  const winner = game.players.find(p => p.totemTokens.length >= 8)!
  if(winner.color === playerId){
    return <> {t("game.over.you.win")} </>
  } else {
    return <> {t("game.over.player.win",{player:getPseudo(winner.color, players,t)})} </>
  }

}

function HeaderOnGoingGameText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<PlayerColor>()
  const player = game.players.find(p => p.color === playerId)
  const players = usePlayers<PlayerColor>()
  const animation = useAnimation<Move>()

  if (animation) {
    const move = animation.move
    if (move.type === MoveType.DrawCards) {
      const player = game.players.find(p => p.color === move.player)!
      const cardsDraw:number = playerWillDraw(player)
      if (cardsDraw !== 0){
        return player.color === playerId ? <> {t("hunt.you.draw.cards", {cards:cardsDraw})} </> : <> {t("hunt.player.draw.cards",{player:getPseudo(player.color,players,t), cards:cardsDraw})} </>
      } else {
        return player.color === playerId ? <> {t("hunt.you.draw.no.card")} </> : <> {t("hunt.player.draw.no.card",{player:getPseudo(player.color,players,t)})} </>
      }
    } else if (move.type === MoveType.FulfillObjective) {
      const activePlayer = getHuntingPlayer(game)!
      return activePlayer.color === playerId ? <> {t("hunt.you.complete.objectives")} </> : <> {t("hunt.player.complete.objectives",{player:getPseudo(activePlayer.color,players,t)})} </>
    }
  }

  const huntingPlayer = getHuntingPlayer(game)
  if (!huntingPlayer) {
    if(player === undefined || player.isReady === true){
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
  } else {
    if (!huntingPlayer.hunting.hunt) {
      return huntingPlayer.color === playerId ? <> {t("hunt.you.hunt.tile")} </> : <> {t("hunt.player.hunt.tile",{player:getPseudo(huntingPlayer.color,players,t)})} </>
    } else {
      return huntingPlayer.color === playerId ? <> {t("hunt.you.pay.tile")} </> : <> {t("hunt.player.pay.tile",{player:getPseudo(huntingPlayer.color,players,t)})} </>
    }
  }
}