/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import {usePlay} from '@gamepark/react-client'
import {FC, useMemo} from 'react'
import {HuntTile} from './DraggableTile'
import {getPolyomino, tiles} from "@gamepark/prehistories/material/Tile";
import FlippingTile from "./FlippingTile";
import {HuntZonePosition} from "./Board";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import {Draggable} from "@gamepark/react-components";
import AnimalTile from "./AnimalTile";
import {glowingAnimation, squareSize} from "../utils/styles";
import Move from "@gamepark/prehistories/moves/Move";

type Props = {
  game: GameView
  tileNumber: number
  position: HuntZonePosition
} & Omit<DraggableProps, 'animation' | 'type'>

const HuntingZone: FC<Props> = ({game, tileNumber, position, ...props}) => {
  const play = usePlay<Move>()
  const polyomino = useMemo(() => getPolyomino(tiles[tileNumber], 0), [tileNumber])
  if (position.flip) {
    return <FlippingTile game={game} tileNumber={tileNumber} position={position}
                         css={[huntPosition(position, polyomino)]} {...props}/>
  } else {
    return (
      <Draggable type={HuntTile} drop={play}
                 css={[style, huntPosition(position, polyomino), rotation(position.rotation(polyomino))]}
                 {...props}>
        <AnimalTile tile={tiles[tileNumber]} side={0} css={props.canDrag && glowingAnimation}/>
      </Draggable>
    )
  }
}

const style = css`
  position: absolute;
  width: fit-content;
  height: fit-content;
`

const huntPosition = (spot: HuntZonePosition, polyomino: boolean[][]) => css`
  left: ${spot.left - polyomino[0].length * squareSize / 2}em;
  top: ${spot.top - polyomino.length * squareSize / 2}em;
`

const rotation = (degrees: number) => css`
  transform: rotate(${degrees}deg);
`

export default HuntingZone