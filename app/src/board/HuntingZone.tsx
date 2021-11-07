/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import {FC, useMemo} from 'react'
import DraggableTile from './DraggableTile'
import Tile, {getPolyomino} from "@gamepark/prehistories/material/Tile";
import FlippingTile from "./FlippingTile";
import {HuntZonePosition} from "./Board";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import {squareSize} from "../utils/styles";

type Props = {
  game: GameView
  tile: Tile
  position: HuntZonePosition
} & Omit<DraggableProps, 'animation' | 'type'>

const HuntingZone: FC<Props> = ({game, tile, position, ...props}) => {
  const polyomino = useMemo(() => getPolyomino(tile, 0), [tile])
  if (position.flip) {
    return <FlippingTile game={game} tile={tile} position={position}
                         css={[huntPosition(position, polyomino)]} {...props}/>
  } else {
    return (
      <DraggableTile tile={tile} rotation={position.rotation(polyomino)} css={huntPosition(position, polyomino)} {...props}/>
    )
  }
}

const huntPosition = (spot: HuntZonePosition, polyomino: boolean[][]) => css`
  left: ${spot.left - polyomino[0].length * squareSize / 2}em;
  top: ${spot.top - polyomino.length * squareSize / 2}em;
`

export default HuntingZone