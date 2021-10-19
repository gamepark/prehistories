/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import { usePlay, usePlayerId } from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import { useMemo, useState } from 'react'
import HuntingZone from './board/HuntingZone'
import Objectives from './board/Objectives'
import PlayerBoard from './board/PlayerBoard'
import PlayerPanel from './board/PlayerPanel'
import SetCaveDisplayed, { setCaveDisplayed, setCaveDisplayedMove } from './localMoves/setCaveDisplayed'
import WelcomePopUp from './utils/WelcomePopUp'

type Props = {
  game: GameView
}

export default function GameDisplay({game}: Props) {

  const playerId = usePlayerId<PlayerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId]) 
  const playerDisplayed = game.players.find(p => p.color === game.caveDisplayed)!

  const playSetCaveDisplayed = usePlay<SetCaveDisplayed>()

  const [welcomePopUpClosed, setWelcomePopUpClosed] = useState(false)
  const showWelcomePopup = !welcomePopUpClosed

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={[css`position: absolute;
                    top:0;left:0;width:100%;height:100%;`, perspective]}>
                      
        <HuntingZone game={game}
                     numberOfPlayers={game.players.length}    
                     indexOfDisplayedPlayer={players.findIndex(p => p.color === playerDisplayed.color)} 
                     indexListDisplayedPlayers={players.map(p => p.color)}     
        />
        <Objectives goals={game.goals}    
                    players={game.players} 
                    onClick={() => setWelcomePopUpClosed(false)}       
        />
        {players.map((player, index) =>
          <PlayerPanel key={player.color}
                       position={index}
                       player = {player}
                       onClick = {() => playSetCaveDisplayed(setCaveDisplayedMove(player.color), {local:true})}
                       phase = {game.phase}
                       huntOrder = {game.sortedPlayers}
                       nbPlayers = {game.players.length}
          />
        )}

        <PlayerBoard player={playerDisplayed} 
                     players={game.players}
                     phase={game.phase}
                     isActiveHuntingPlayer={game.sortedPlayers !== undefined && game.sortedPlayers[0] === playerDisplayed.color}
                     goals={game.goals}
                     selectedHunters={game.huntersSelected}
        />

        {showWelcomePopup && <WelcomePopUp player={playerId} game={game} close={() => setWelcomePopUpClosed(true)} />}



      </div>
    </Letterbox>
  )
}

const perspective = css`

`

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