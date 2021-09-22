/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { allPolyominos } from "@gamepark/prehistories/material/Polyominos";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayPolyomino from "@gamepark/prehistories/moves/PlayPolyomino";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt";
import Coordinates from "@gamepark/prehistories/types/Coordinates";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import getSquaresStartLeft, { getFreeSquaresFromPath, getOccupiedSquares, isCoordFree, isCoordOutOfBorders } from "@gamepark/prehistories/utils/getSquaresStartLeft";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { FC, useRef } from "react";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";

type Props = {
    x:number,
    y:number,
    player:PlayerView|PlayerViewSelf|PlayerHuntView,
} & React.HTMLAttributes<HTMLDivElement>

const DropSquare : FC<Props> = ({x,y,player, ...props}) => {

    const playerId = usePlayerId<PlayerColor>()

    const [{canDrop, isOver}, dropRef] = useDrop({
      accept: ["PolyominoToHunt"],
      canDrop: (item: PolyominoToHunt, monitor:DropTargetMonitor) => {
          const XYCoordDiff = { x: Math.floor((convertIntoPercent(monitor.getInitialClientOffset() ?? {x:0,y:0}).x - convertIntoPercent(monitor.getInitialSourceClientOffset() ?? {x:0,y:0}).x)/4.1),
                                y: Math.floor((convertIntoPercent(monitor.getInitialClientOffset() ?? {x:0,y:0}).y - convertIntoPercent(monitor.getInitialSourceClientOffset() ?? {x:0,y:0}).y)/8.2)
          }

          const accessibleSquares:Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave)

          return allPolyominos[item.polyomino][item.side].coordinates.some(coord => accessibleSquares.find(square => square.x === x+coord.x-XYCoordDiff.y && square.y === y+coord.y-XYCoordDiff.x))
          && allPolyominos[item.polyomino][item.side].coordinates.every(coord => !isCoordOutOfBorders({x:coord.x+x-XYCoordDiff.y,y:coord.y+y-XYCoordDiff.x}) && isCoordFree({x:coord.x+x-XYCoordDiff.y,y:coord.y+y-XYCoordDiff.x}, getOccupiedSquares(player.cave)))
      },
      collect: monitor => ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      }),
      drop: (item: PolyominoToHunt, monitor:DropTargetMonitor) => {
        const XYCoordDiff = { x: Math.floor((convertIntoPercent(monitor.getInitialClientOffset() ?? {x:0,y:0}).x - convertIntoPercent(monitor.getInitialSourceClientOffset() ?? {x:0,y:0}).x)/4.1),
        y: Math.floor((convertIntoPercent(monitor.getInitialClientOffset() ?? {x:0,y:0}).y - convertIntoPercent(monitor.getInitialSourceClientOffset() ?? {x:0,y:0}).y)/8.2)
}
          return {type:MoveType.PlayPolyomino,polyomino:item.polyomino,side:item.side, huntSpot:item.huntSpot, playerId, square:{x:x-XYCoordDiff.y,y:y-XYCoordDiff.x}}
      }
    })

  return(
      <div ref = {dropRef} css={[squareDimension, squarePosition(x,y), squareStyle, canDrop && canDropStyle, isOver && isOverStyle(canDrop)]}>

      </div>
  )

}

const convertIntoPercent = (position:XYCoord) => ({
    x: window.innerWidth / window.innerHeight > (16/9) ? Math.round(position.x * 100 / (window.innerHeight * (16/9))) : Math.round(position.x * 100 / window.innerWidth),
    y: window.innerWidth / window.innerHeight > (16/9) ? Math.round(position.y * 100 / window.innerHeight) : Math.round(position.y * 100 / (window.innerWidth / (16/9)))
})

const isOverStyle = (canDrop:boolean) => css`
${canDrop === true && `background-color:rgba(0,255,0,0.8);`};
${canDrop === false && `background-color:rgba(255,0,0,0.8);`};
`

const canDropStyle = css`
background-color:rgba(0,255,0,0.5);
`

const squareDimension = css`
width:14.2857%;height:14.2857%;
`

const squarePosition = (x:number, y:number) => css`
position:absolute;
top:${x*14.2857}%;
left:${y*14.2857}%;
z-index:2;
`

const squareStyle = css`

`

export default DropSquare