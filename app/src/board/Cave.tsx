/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PlayerState from "@gamepark/prehistories/PlayerState";
import { FC } from "react";
import Images from "../utils/Images";
import Polyomino from "./Polyomino";

type Props = {
    player:PlayerState

}

const Cave : FC<Props> = ({player}) => {

    return(

        <div css={[cavePosition, caveStyle(player.color)]}>

            <div css={canvasExcludingBorders}>

                {player.cave.map((paint, index) => 

                    paint.polyomino < 2 
                        ? <div css = {[tilePosition(paint.x, paint.y), tileSize(paint.polyomino, paint.side)]} key = {index}> 
                            <Polyomino  polyomino={paint.polyomino} 
                                        side={paint.side}
                                        color={player.color} />
                        </div>
                        : <div css = {[tilePosition(paint.x, paint.y), tileSize(paint.polyomino, paint.side)]} key = {index}>
                            <Polyomino polyomino={paint.polyomino} 
                                       side={paint.side} />
                        </div>
                )}

            </div>
            
        </div>

    )

}

export const tileSize = (polyomino:number, side:number) =>`
${polyomino <= 26 && `width:14.2857%;height:14.2857%;`};
${polyomino > 26 && polyomino <= 51 && side === 0 && `width:28.5714%;height:14.2857%;`};
${polyomino > 26 && polyomino <= 51 && side === 1 && `width:14.2857%;height:28.5714%;`};
${polyomino > 51 && polyomino <= 61 && `width:28.5714%;height:28.5714%;`};
${polyomino > 61 && polyomino <= 63 && `width:42.8571%;height:28.5714%;`};
${polyomino > 63 && polyomino <= 69 && `width:28.5714%;height:42.8571%;`};
${polyomino > 69 && polyomino <= 73 && `width:42.8571%;height:28.5714%;`};
${polyomino > 73 && polyomino <= 76 && `width:28.5714%;height:42.8571%;`};
${polyomino === 77 && `width:42.8571%;height:28.5714%;`};
${polyomino > 77 && polyomino <= 79 && `width:28.5714%;height:42.8571%;`};
${polyomino > 79 && polyomino <= 81 && `width:42.8571%;height:28.5714%;`};
${polyomino > 81 && polyomino <= 86 && `width:28.5714%;height:28.5714%;`};
border:1px red solid;
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
top:22%;
left:15%;
width:56%;
height:60%;
`

const caveStyle = (color:PlayerColor|undefined) => css`
background-image: url(${getCave(color)});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
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