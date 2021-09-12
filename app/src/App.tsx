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

export default function App() {
  const game = useGame<GameView>()
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || isJustDisplayed
  return (
    <DndProvider options={HTML5ToTouch}>
      {game && <GameDisplay game={game}/>}
      <LoadingScreen display={loading} gameBox={Images.polyominoType1_2} author="Someone" artist="Somebody" publisher="Nobody" developer="You"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <ImagesLoader images={Object.values(Images)} />
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
    </DndProvider>
  )
}