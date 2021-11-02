/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/prehistories/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useGame} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Images from './utils/Images'
import Box from '@gamepark/prehistories-app/public/box.png'
import { AudioLoader } from './sounds/AudioLoader'
import { SoundLoader } from './sounds/SoundLoader'
import buttonClick from './sounds/buttonClick.mp3'
import cardFlipSound from "./sounds/cardFlip.mp3";
import cardMoveSound from "./sounds/cardMove.mp3";
import moveTileSound from "./sounds/moveTile.mp3";
import permObjectiveSound from "./sounds/permObjective.mp3";
import varObjectiveSound from "./sounds/varObjective.mp3";
import playerTurnSound from "./sounds/playerTurn.mp3";

export default function App() {
  const game = useGame<GameView>()
  const [audioLoader, setAudioLoader] = useState<AudioLoader>()
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isSoundsLoading, setSoundLoading] = useState(true)
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = imagesLoading || isJustDisplayed || isSoundsLoading
  return (
    <DndProvider options={HTML5ToTouch}>
      {!loading && game && audioLoader && <GameDisplay game={game} audioLoader={audioLoader}/>}
      <LoadingScreen display={loading} 
                     gameBox={Box} 
                     author="Alexandre Emerit & Benoit Turpin" 
                     artist="Camille Chaussy" 
                     publisher="The Flying Games" 
                     developer="Théo Gregorio"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)} />
      <SoundLoader sounds={[buttonClick, cardFlipSound, cardMoveSound, moveTileSound, permObjectiveSound, varObjectiveSound, playerTurnSound]} onSoundLoad={() => setSoundLoading(false)} onSoundsPrepared={ (audioLoader) => setAudioLoader(audioLoader) }/>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
    </DndProvider>
  )
}