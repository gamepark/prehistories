/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Move from '@gamepark/prehistories/moves/Move'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import {FC} from 'react'
import {placingBackground, toAbsolute, toFullSize} from '../utils/styles'
import Images from '../utils/Images'
import Tile, {Side} from "@gamepark/prehistories/material/Tile";
import {DraggableProps} from "@gamepark/react-components/dist/Draggable/Draggable";

export const HuntTile = 'HuntTile'

export type DraggedTile = {
  polyomino: number
  side: Side
  huntSpot: number
}

type Props = {
  tile: Tile
  side: 0 | 1
} & Omit<DraggableProps, 'type'>

const Polyomino: FC<Props> = ({tile, side, ...props}) => {

  const play = usePlay<Move>()

  return (
    <Draggable type={HuntTile} drop={play} {...props} css={toFullSize}>

      <div css={[toAbsolute, toFullSize, flipTile(side)]}>

        <div css={[toAbsolute, toFullSize, sideDisplay,
          polyominoShadow,
          placingBackground(getTileImage(tile, 0), "contain"),
          props.canDrag && glowingAnimation
        ]}>
        </div>

        {<div css={[toAbsolute, toFullSize, sideDisplay, polyominoShadow,
          placingBackground(getTileImage(tile, 1), "contain"),
          props.canDrag && glowingAnimation
        ]}>
        </div>}

      </div>

    </Draggable>
  )

}

const glowingKeyframes = keyframes`
  from {
    filter: drop-shadow(0 0 0.2em lime);
  }
  to {
    filter: drop-shadow(0 0 0.8em lime) drop-shadow(0 0 0.8em lime);
  }
`

const glowingAnimation = css`
  animation: ${glowingKeyframes} 1s alternate infinite linear;
`

const sideDisplay = css`
  transform-style: preserve-3d;
  backface-visibility: hidden;
`

const flipTile = (side: 0 | 1) => css`
  transform-style: preserve-3d;
  transform: rotateY(${side * 180}deg);
  transition: transform 0.2s linear, top 0.2s cubic-bezier(1, 0, 0, 1), left 0.2s cubic-bezier(1, 0, 0, 1);
`

const polyominoShadow = css`
  filter: drop-shadow(0 0 0.2em black);
`

function getTileImage(tile: Tile, side: Side): string {
  switch (tile) {
    case Tile.Fish1:
      return Images.polyominoType1_1
    case Tile.Fish2:
      return side === 0 ? Images.polyominoType2_1A : Images.polyominoType2_1B
    case Tile.Fish3A:
      return side === 0 ? Images.polyominoType3_1A : Images.polyominoType3_1B
    case Tile.Fish3B:
      return side === 0 ? Images.polyominoType3_2A : Images.polyominoType3_2B
    case Tile.Fish4A:
      return side === 0 ? Images.polyominoType4_1A : Images.polyominoType4_1B
    case Tile.Fish4B:
      return side === 0 ? Images.polyominoType4_2A : Images.polyominoType4_2B
    case Tile.Mammoth1:
      return Images.polyominoType1_2
    case Tile.Mammoth2:
      return side === 0 ? Images.polyominoType2_2A : Images.polyominoType2_2B
    case Tile.Mammoth3A:
      return side === 0 ? Images.polyominoType3_3A : Images.polyominoType3_3B
    case Tile.Mammoth3B:
      return side === 0 ? Images.polyominoType3_4A : Images.polyominoType3_4B
    case Tile.Mammoth4A:
      return side === 0 ? Images.polyominoType4_3A : Images.polyominoType4_3B
    case Tile.Mammoth4B:
      return side === 0 ? Images.polyominoType4_4A : Images.polyominoType4_4B
    case Tile.Buffalo1:
      return Images.polyominoType1_4
    case Tile.Buffalo2:
      return side === 0 ? Images.polyominoType2_4A : Images.polyominoType2_4B
    case Tile.Buffalo3A:
      return side === 0 ? Images.polyominoType3_7A : Images.polyominoType3_7B
    case Tile.Buffalo3B:
      return side === 0 ? Images.polyominoType3_8A : Images.polyominoType3_8B
    case Tile.Buffalo4A:
      return side === 0 ? Images.polyominoType4_7A : Images.polyominoType4_7B
    case Tile.Buffalo4B:
      return side === 0 ? Images.polyominoType4_8A : Images.polyominoType4_8B
    case Tile.Ibex1:
      return Images.polyominoType1_3
    case Tile.Ibex2:
      return side === 0 ? Images.polyominoType2_3A : Images.polyominoType2_3B
    case Tile.Ibex3A:
      return side === 0 ? Images.polyominoType3_5A : Images.polyominoType3_5B
    case Tile.Ibex3B:
      return side === 0 ? Images.polyominoType3_6A : Images.polyominoType3_6B
    case Tile.Ibex4A:
      return side === 0 ? Images.polyominoType4_5A : Images.polyominoType4_5B
    case Tile.Ibex4B:
      return side === 0 ? Images.polyominoType4_6A : Images.polyominoType4_6B
    case Tile.Boar1:
      return Images.polyominoType1_5
    case Tile.Boar2:
      return side === 0 ? Images.polyominoType2_5A : Images.polyominoType2_5B
    case Tile.Boar3A:
      return side === 0 ? Images.polyominoType3_9A : Images.polyominoType3_9B
    case Tile.Boar3B:
      return side === 0 ? Images.polyominoType3_10A : Images.polyominoType3_10B
    case Tile.Boar4A:
      return side === 0 ? Images.polyominoType4_9A : Images.polyominoType4_9B
    case Tile.Boar4B:
      return side === 0 ? Images.polyominoType4_10A : Images.polyominoType4_10B
    case Tile.Legendary1:
      return Images.polyominoType5_1
    case Tile.Legendary2:
      return Images.polyominoType5_2
    case Tile.Legendary3:
      return Images.polyominoType5_3
    case Tile.Legendary4:
      return Images.polyominoType5_4
    case Tile.Legendary5:
      return Images.polyominoType5_5
  }
}

export default Polyomino