/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import {usePlay, usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import {useMemo, useState} from 'react'
import ObjectiveCards from './board/ObjectiveCards'
import PlayerBoard from './board/PlayerBoard'
import PlayerPanel from './board/PlayerPanel'
import SetCaveDisplayed, {getCaveDisplayed, setCaveDisplayedMove} from './localMoves/setCaveDisplayed'
import {AudioLoader} from './sounds/AudioLoader'
import PrehistoriesSounds from './sounds/PrehistoriesSounds'
import WelcomePopUp from './utils/WelcomePopUp'
import Board from "./board/Board";
import TutorialPopup from './tutorial/TutorialPopUp'
import GameLocalView from "./GameLocalView";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import {isWinner} from '@gamepark/prehistories/Prehistories'

type Props = {
  game: GameLocalView
  audioLoader: AudioLoader
}

export default function GameDisplay({game, audioLoader}: Props) {

  const playerId = usePlayerId<PlayerColor>()
  const players = useMemo(() => getPlayersStartingWith(game, playerId), [game, playerId])
  const playerDisplayed = game.players.find(p => p.color === getCaveDisplayed(game, playerId))!
  const tutorial = useTutorial()

  const playSetCaveDisplayed = usePlay<SetCaveDisplayed>()

  const [welcomePopUpClosed, setWelcomePopUpClosed] = useState(tutorial ? true : playerDisplayed.cave.length > 0)
  const showWelcomePopup = !welcomePopUpClosed
  const huntingPlayer = getHuntingPlayer(game)

  return (
    <Letterbox id="letterbox" css={letterBoxStyle} top={0}>
      <div css={[css`position: absolute;
                    top:0;left:0;width:100%;height:100%;`, perspective]}>

        <Board game={game}/>

        <ObjectiveCards objectives={game.objectives}
                        players={players}
                        onClick={() => setWelcomePopUpClosed(false)}
        />
        {players.map((player, index) =>
          <PlayerPanel key={player.color}
                       position={index}
                       player = {player}
                       playerListDisplayed={players}
                       game={game}
                       onClick = {() => playSetCaveDisplayed(setCaveDisplayedMove(player.color), {local:true})}
          />
        )}

        <PlayerBoard player={playerDisplayed}
                     huntPhase={huntingPlayer !== undefined}
                     selectedHunters={game.huntersSelected}
                     isTutorial={!!tutorial}
                     huntBoard={game.huntingBoard}
                     isWinner={game.players.some(p => isWinner(p))}
        />

        {showWelcomePopup && <WelcomePopUp player={playerId} game={game} close={() => setWelcomePopUpClosed(true)} />}

      </div>

      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}

      <PrehistoriesSounds audioLoader={audioLoader} game={game} />

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
