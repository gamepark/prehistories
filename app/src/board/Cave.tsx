/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt";
import Phase from "@gamepark/prehistories/types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { FC, useRef } from "react";
import { DropTargetMonitor, useDrop } from "react-dnd";
import { useTranslation } from "react-i18next/*";
import Images from "../utils/Images";
import DropSquare from "./DropSquare";
import Polyomino from "./Polyomino";

type Props = {
    player:PlayerView|PlayerViewSelf|PlayerHuntView
    phase:Phase | undefined
}

const Cave : FC<Props> = ({player, phase}) => {

    const sizeTileW = 14.2857 // % unit
    const sizeTileH = 14.2857 // % unit

    return(

        <div css={[cavePosition, caveStyle(player.color)]}>

            <div css={canvasExcludingBorders}>

                {[0,1,2,3,4,5,6].map((x, index1) => 
                    [0,1,2,3,4,5,6].map((y, index2) =>
                        <DropSquare x={x}
                                  y={y}
                                  key={index1+' '+index2}
                                  player={player}
                        />
                    )
                )}

                {player.cave.map((paint, index) => 

                    paint.polyomino < 2 
                        ? <div css = {[tilePosition(paint.x, paint.y), tileSize(paint.polyomino, paint.side,sizeTileW, sizeTileH)]} key = {index}> 
                            <Polyomino  polyomino={paint.polyomino} 
                                        side={paint.side}
                                        color={player.color} 
                                        isAlreadyPlaced={true}
                                        phase={phase}
                                        />


                        </div>
                        : <div css = {[tilePosition(paint.x, paint.y), tileSize(paint.polyomino, paint.side,sizeTileW, sizeTileH)]} key = {index}>
                            <Polyomino polyomino={paint.polyomino} 
                                       side={paint.side}
                                       isAlreadyPlaced={true}
                                       phase={phase}
                                       />
                        </div>
                )}

            </div>
            
        </div>

    )

}

export const tileSize = (polyomino:number, side:number, sizeBaseW:number, sizeBaseH:number) =>`

${polyomino <= 26 && `width:${sizeBaseW}%;height:${sizeBaseH}%;`};
${polyomino > 26 && polyomino <= 51 && side === 0 && `width:${sizeBaseW*2}%;height:${sizeBaseH}%;`};
${polyomino > 26 && polyomino <= 51 && side === 1 && `width:${sizeBaseW}%;height:${sizeBaseH*2}%;`};
${polyomino > 51 && polyomino <= 61 && `width:${sizeBaseW*2}%;height:${sizeBaseH*2}%;`};
${(polyomino === 62 || polyomino === 66 || polyomino === 67 || polyomino === 71 || (polyomino === 69 && side === 1)) && `width:${sizeBaseW*3}%;height:${sizeBaseH*2}%;` };
${(polyomino === 63 || polyomino === 64 || polyomino === 65 || polyomino === 68 || polyomino === 70 || (polyomino === 69 && side === 0)) && `width:${sizeBaseW*2}%;height:${sizeBaseH*3}%;` };
${polyomino > 71 && polyomino <= 76 && `width:${sizeBaseW*2}%;height:${sizeBaseH*2}%;`};
`

const tilePosition = (x:number, y:number) => css`
position:absolute;
top:${x*14.2857}%;
left:${y*14.2857}%;
`

const canvasExcludingBorders = css`
position:absolute;
left:5.5%;
top:5.5%;
width:89%;
height:89%;
`

const cavePosition = css`
position:absolute;
top:28%;
left:3%;
width:42%;
height:45%;
`

const caveStyle = (color:PlayerColor|undefined) => css`
background-image: url(${getCave(color)});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
filter:drop-shadow(0 0 2em black);
border-radius:10%;
`

function getCave(color:PlayerColor|undefined):string{
    switch(color){
        case PlayerColor.Blue:
            return Images.caveBlue
        case PlayerColor.Green:
            return Images.caveGreen
        case PlayerColor.Red:
            return Images.caveRed
        case PlayerColor.White:
            return Images.caveWhite
        case PlayerColor.Yellow:
            return Images.caveYellow
        default :
            return ''
    }
}


export default Cave