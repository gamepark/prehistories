/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/prehistories/moves/Move'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import Tile, {Side} from "@gamepark/prehistories/material/Tile";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import AnimalTile from "./AnimalTile";
import {glowingAnimation} from "../utils/styles";

export const HuntTile = 'HuntTile'

export type DraggedTile = {
  polyomino: number
  side: Side
  huntSpot: number
}

type Props = {
  tile: Tile
  side: Side
} & Omit<DraggableProps, 'type'>

export default function DraggableTile({tile, side, ...props}: Props) {
  const play = usePlay<Move>()
  return (
    <Draggable type={HuntTile} drop={play} css={style} {...props}>
      <AnimalTile tile={tile} side={side} css={props.canDrag && glowingAnimation}/>
    </Draggable>
  )

}

const style = css`
  position: absolute;
  width: fit-content;
  height: fit-content;
`
