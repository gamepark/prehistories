/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import {Animation, usePlay, useSound} from '@gamepark/react-client'
import {FC, useMemo, useState} from 'react'
import MoveTileSound from '../sounds/moveTile.mp3'
import {HuntTile} from './DraggableTile'
import Tile, {getPolyomino, Side} from "@gamepark/prehistories/material/Tile";
import {glowingAnimation, squareSize} from "../utils/styles";
import {Draggable} from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import AnimalTile from "./AnimalTile";
import {HuntZonePosition} from "./Board";
import PlaceTile from "@gamepark/prehistories/moves/PlaceTile";

type Props = {
  game: GameView
  tile: Tile
  position: HuntZonePosition
  animation?: Animation<PlaceTile>
} & Omit<DraggableProps, 'animation' | 'type'>

const FlippingTile: FC<Props> = ({game, tile, position, item, animation, ...props}) => {
  const play = usePlay<Move>()
  const [side, setSide] = useState<Side>(0)
  const [dragging, setDragging] = useState(false)
  const moveTileSound = useSound(MoveTileSound)
  moveTileSound.volume = 0.8

  function toggleSide() {
    moveTileSound.play()
    setSide(side => side ? 0 : 1)
  }

  const polyomino0 = useMemo(() => getPolyomino(tile, 0), [tile])
  const polyomino1 = useMemo(() => getPolyomino(tile, 1), [tile])

  return (
    <Draggable type={HuntTile} draggingChange={setDragging} drop={play} onClick={toggleSide} item={{...item, side}}
               css={[style(polyomino0)]} canDrag={false} {...props}>
      <div css={[flipWrapper(polyomino0.length !== polyomino1.length), style(polyomino0),
        rotation(dragging || animation ? 0 : position.rotation(side === 0 ? polyomino0 : polyomino1), animation?.move.side ?? side)]}>
        <AnimalTile tile={tile} side={0} css={!dragging && props.canDrag && glowingAnimation}/>
        <AnimalTile tile={tile} side={1} css={!dragging && props.canDrag && glowingAnimation}/>
      </div>
    </Draggable>
  )
}

const style = (polyomino: boolean[][]) => css`
  position: absolute;
  width: ${polyomino[0].length * squareSize}em;
  height: ${polyomino.length * squareSize}em;
`

const rotation = (degrees: number, side: Side) => css`
  transform: rotate(${degrees}deg) rotateX(${side === 0 ? 0 : 180}deg);
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

export default FlippingTile