/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { allPolyominos } from "@gamepark/prehistories/material/Polyominos";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt";
import Coordinates from "@gamepark/prehistories/types/Coordinates";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import getSquaresStartLeft, { getFreeSquaresFromPath, getOccupiedSquares, isCoordFree, isCoordOutOfBorders } from "@gamepark/prehistories/utils/getSquaresStartLeft";
import { usePlayerId } from "@gamepark/react-client";
import { FC } from "react";
import { useDrop } from "react-dnd";

type Props = {
    x:number,
    y:number,
    player:PlayerView|PlayerViewSelf|PlayerHuntView,
} & React.HTMLAttributes<HTMLDivElement>

const DropSquare : FC<Props> = ({x,y,player, ...props}) => {

    const playerId = usePlayerId<PlayerColor>()

    const [{canDrop, isOver}, dropRef] = useDrop({
        accept: ["PolyominoToHunt"],
        canDrop: (item: PolyominoToHunt) => {
            const accessibleSquares:Coordinates[] = getFreeSquaresFromPath(getSquaresStartLeft(player.cave),player.cave)
            return allPolyominos[item.polyomino][item.side].coordinates.some(coord => accessibleSquares.find(square => square.x === x+coord.x && square.y === y+coord.y))
            && allPolyominos[item.polyomino][item.side].coordinates.every(coord => !isCoordOutOfBorders({x:coord.x+x,y:coord.y+y}) && isCoordFree({x:coord.x+x,y:coord.y+y}, getOccupiedSquares(player.cave)))
        },
        collect: monitor => ({
          canDrop: monitor.canDrop(),
          isOver: monitor.isOver()
        }),
        drop: (item: PolyominoToHunt) => {
            return {type:MoveType.PlayPolyomino,polyomino:item.polyomino,side:item.side, huntSpot:item.huntSpot, playerId, square:{x,y}}
        }
      })

    return(
        <div ref = {dropRef} css={[squareDimension, squarePosition(x,y), squareStyle, canDrop && canDropStyle, isOver && isOverStyle(canDrop)]}>

        </div>
    )

}

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
`

const squareStyle = css`

`

export default DropSquare