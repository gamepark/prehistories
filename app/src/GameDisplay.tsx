/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import {usePlay, usePlayerId} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import {useMemo, useState} from 'react'
import Objectives from './board/Objectives'
import PlayerBoard from './board/PlayerBoard'
import PlayerPanel from './board/PlayerPanel'
import SetCaveDisplayed, {setCaveDisplayedMove} from './localMoves/setCaveDisplayed'
import {AudioLoader} from './sounds/AudioLoader'
import PrehistoriesSounds from './sounds/PrehistoriesSounds'
import WelcomePopUp from './utils/WelcomePopUp'
import Board from "./board/Board";

type Props = {
  game: GameView
  audioLoader: AudioLoader
}

export default function GameDisplay({game, audioLoader}: Props) {

  const playerId = usePlayerId<PlayerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const playerDisplayed = game.players.find(p => p.color === game.caveDisplayed)!

  const playSetCaveDisplayed = usePlay<SetCaveDisplayed>()

  const [welcomePopUpClosed, setWelcomePopUpClosed] = useState(playerDisplayed.cave.length > 0)
  const showWelcomePopup = !welcomePopUpClosed

  return (
    <Letterbox id="letterbox" css={letterBoxStyle} top={0}>
      <div css={[css`position: absolute;
                    top:0;left:0;width:100%;height:100%;`, perspective]}>

        <Board game={game}/>

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
                     caveDisplayed = {game.caveDisplayed}
                     selectedHunters={game.huntersSelected}
        />

        {showWelcomePopup && <WelcomePopUp player={playerId} game={game} close={() => setWelcomePopUpClosed(true)} />}

      </div>

      <PrehistoriesSounds audioLoader={audioLoader} />

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