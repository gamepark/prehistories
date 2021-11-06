/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {Picture, PictureAttributes} from '@gamepark/react-components'
import {squareSize} from '../utils/styles'
import Images from '../utils/Images'
import Tile, {getPolyomino, Side} from "@gamepark/prehistories/material/Tile";

type Props = {
  tile: Tile
  side: Side
} & PictureAttributes

export default function AnimalTile({tile, side, ...props}: Props) {
  return (
    <Picture src={getTileImage(tile, side)} css={style(getPolyomino(tile, side))} {...props}/>
  )
}

const style = (polyomino: boolean[][]) => css`
  width: ${polyomino[0].length * squareSize}em;
  height: ${polyomino.length * squareSize}em;
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
      return side === 0 ? Images.polyominoType4_8B : Images.polyominoType4_8A
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
