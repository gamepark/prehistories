/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import {usePlay, useSound} from '@gamepark/react-client'
import {FC, useMemo, useState} from 'react'
import MoveTileSound from '../sounds/moveTile.mp3'
import {HuntTile} from './DraggableTile'
import {getPolyomino, Side, tiles} from "@gamepark/prehistories/material/Tile";
import {glowingAnimation, squareSize} from "../utils/styles";
import {Draggable} from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import AnimalTile from "./AnimalTile";
import {HuntZonePosition} from "./Board";

type Props = {
  game: GameView
  tileNumber: number
  position: HuntZonePosition
} & Omit<DraggableProps, 'type'>

const FlippingTile: FC<Props> = ({game, tileNumber, position, item, ...props}) => {
  const play = usePlay<Move>()
  const [side, setSide] = useState<Side>(0)
  const moveTileSound = useSound(MoveTileSound)
  moveTileSound.volume = 0.5

  function toggleSide() {
    moveTileSound.play()
    setSide(side => side ? 0 : 1)
  }

  const polyomino0 = useMemo(() => getPolyomino(tiles[tileNumber], 0), [tileNumber])
  const polyomino1 = useMemo(() => getPolyomino(tiles[tileNumber], 1), [tileNumber])

  return (
    <Draggable type={HuntTile} drop={play} onClick={toggleSide} item={{...item, side}}
               css={[style(polyomino0), rotation(position.rotation(side === 0 ? polyomino0 : polyomino1))]} {...props}>
      <div css={[flipWrapper(polyomino0.length !== polyomino1.length), style(polyomino0), side === 1 && backface]}>
        <AnimalTile tile={tiles[tileNumber]} side={0} css={props.canDrag && glowingAnimation}/>
        <AnimalTile tile={tiles[tileNumber]} side={1} css={props.canDrag && glowingAnimation}/>
      </div>
    </Draggable>
  )
}

const style = (polyomino: boolean[][]) => css`
  position: absolute;
  width: ${polyomino[0].length * squareSize}em;
  height: ${polyomino.length * squareSize}em;
`

const rotation = (degrees: number) => css`
  transform: rotate(${degrees}deg);
`

const flipWrapper = (backsideDiff: boolean) => css`
  position: absolute;
  transition: transform 0.2s ease-in-out;
  transform-style: preserve-3d;

  & > picture {
    position: absolute;
    backface-visibility: hidden;
    transform-style: preserve-3d;

    &:last-of-type {
      transform: rotateX(180deg) translate(${backsideDiff ? squareSize / 2 : 0}em, ${backsideDiff ? squareSize / 2 : 0}em);
    }

    & > img {
      backface-visibility: hidden;
    }
  }
`

const backface = css`
  transform: rotateX(180deg);
`

export default FlippingTile