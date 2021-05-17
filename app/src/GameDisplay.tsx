/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import { usePlayer, usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import { useMemo } from 'react'
import HuntingZone from './board/HuntingZone'
import Objectives from './board/Objectives'
import PlayerBoard from './board/PlayerBoard'
import PlayerPanel from './board/PlayerPanel'

type Props = {
  game: GameView
}

export default function GameDisplay({game}: Props) {

  const playerId = usePlayerId<PlayerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId]) 

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={css`position: absolute;
                    top:0;left:0;width:100%;height:100%;`}>
                      
        <HuntingZone game={game}
                     numberOfPlayers={game.players.length}          
        />
        <Objectives goals={game.goals}            
        />
        {players.map((player, index) =>
          <PlayerPanel key={player.color}
                       position={index}
                       player = {player}
          />
        )}

        <PlayerBoard player={game.players[0]}
        
        />


      </div>
    </Letterbox>
  )
}

export const getPlayersStartingWith = (game: GameView, playerId?: PlayerColor) => {
  if (playerId) {
    const playerIndex = game.players.findIndex(player => player.color === playerId)
    return [...game.players.slice(playerIndex, game.players.length), ...game.players.slice(0, playerIndex)]
  } else {
    return game.players
  }
}

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;
`