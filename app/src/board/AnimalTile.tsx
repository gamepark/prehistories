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
      return Images.fish1
    case Tile.Fish2:
      return side === 0 ? Images.fish2Front : Images.fish2Back
    case Tile.Fish3A:
      return side === 0 ? Images.fish3AFront : Images.fish3ABack
    case Tile.Fish3B:
      return side === 0 ? Images.fish3BFront : Images.fish3BBack
    case Tile.Fish4A:
      return side === 0 ? Images.fish4AFront : Images.fish4ABack
    case Tile.Fish4B:
      return side === 0 ? Images.fish4BFront : Images.fish4BBack
    case Tile.Mammoth1:
      return Images.mammoth1
    case Tile.Mammoth2:
      return side === 0 ? Images.mammoth2Front : Images.mammoth2Back
    case Tile.Mammoth3A:
      return side === 0 ? Images.mammoth3AFront : Images.mammoth3ABack
    case Tile.Mammoth3B:
      return side === 0 ? Images.mammoth3BFront : Images.mammoth3BBack
    case Tile.Mammoth4A:
      return side === 0 ? Images.mammoth4AFront : Images.mammoth4ABack
    case Tile.Mammoth4B:
      return side === 0 ? Images.mammoth4BFront : Images.mammoth4BBack
    case Tile.Buffalo1:
      return Images.buffalo1
    case Tile.Buffalo2:
      return side === 0 ? Images.buffalo2Front : Images.buffalo2Back
    case Tile.Buffalo3A:
      return side === 0 ? Images.buffalo3AFront : Images.buffalo3ABack
    case Tile.Buffalo3B:
      return side === 0 ? Images.buffalo3BFront : Images.buffalo3BBack
    case Tile.Buffalo4A:
      return side === 0 ? Images.buffalo4AFront : Images.buffalo4ABack
    case Tile.Buffalo4B:
      return side === 0 ? Images.buffalo4BFront : Images.buffalo4BBack
    case Tile.Ibex1:
      return Images.ibex1
    case Tile.Ibex2:
      return side === 0 ? Images.ibex2Front : Images.ibex2Back
    case Tile.Ibex3A:
      return side === 0 ? Images.ibex3AFront : Images.ibex3ABack
    case Tile.Ibex3B:
      return side === 0 ? Images.ibex3BFront : Images.ibex3BBack
    case Tile.Ibex4A:
      return side === 0 ? Images.ibex4AFront : Images.ibex4ABack
    case Tile.Ibex4B:
      return side === 0 ? Images.ibex4BFront : Images.ibex4BBack
    case Tile.Boar1:
      return Images.boar1
    case Tile.Boar2:
      return side === 0 ? Images.boar2Front : Images.boar2Back
    case Tile.Boar3A:
      return side === 0 ? Images.boar3AFront : Images.boar3ABack
    case Tile.Boar3B:
      return side === 0 ? Images.boar3BFront : Images.boar3BBack
    case Tile.Boar4A:
      return side === 0 ? Images.boar4AFront : Images.boar4ABack
    case Tile.Boar4B:
      return side === 0 ? Images.boar4BFront : Images.boar4BBack
    case Tile.Legendary1:
      return Images.legendary1
    case Tile.Legendary2:
      return Images.legendary2
    case Tile.Legendary3:
      return Images.legendary3
    case Tile.Legendary4:
      return Images.legendary4
    case Tile.Legendary5:
      return Images.legendary5
  }
}
