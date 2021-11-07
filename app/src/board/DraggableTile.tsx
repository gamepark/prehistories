/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Move from '@gamepark/prehistories/moves/Move'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import Tile, {Side} from "@gamepark/prehistories/material/Tile";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";
import AnimalTile from "./AnimalTile";
import {glowingAnimation} from "../utils/styles";
import {useState} from "react";

export const HuntTile = 'HuntTile'

export type DraggedTile = {
  tile: Tile
  side: Side
  huntSpot: number
}

type Props = {
  tile: Tile
  rotation: number
} & Omit<DraggableProps, 'type'>

export default function DraggableTile({tile, rotation, ...props}: Props) {
  const play = usePlay<Move>()
  const [dragging, setDragging] = useState(false)
  return (
    <Draggable type={HuntTile} drop={play} css={style} draggingChange={setDragging} {...props}>
      <AnimalTile tile={tile} side={0} css={[!dragging && rotationCss(rotation), !dragging && props.canDrag && glowingAnimation]}/>
    </Draggable>
  )

}

const style = css`
  position: absolute;
  width: fit-content;
  height: fit-content;
`

const rotationCss = (degrees: number) => css`
  transform: rotate(${degrees}deg);
`
