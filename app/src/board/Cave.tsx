/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { FC } from "react";
import { placingBackground, setPercentDimension, sizeTileH, sizeTileW, toAbsolute } from "../utils/styles";
import Images from "../utils/Images";
import Polyomino from "./Polyomino";
import PolyominoDropArea from "./PolyominoDropArea";

type Props = {
    player:PlayerView|PlayerViewSelf|PlayerHuntView
}

const Cave : FC<Props> = ({player}) => {

    return(

        <div css={[toAbsolute, setPercentDimension(45,42), cavePosition, placingBackground(getCave(player.color), "contain"), caveStyle]}> 

            <div css={[toAbsolute, setPercentDimension(87,88), canvasExcludingBorders]}>

                <PolyominoDropArea player={player} css={css`top:0;left:0`} />

                {player.cave.map((paint, index) => 

                    paint.tile < 2
                        ? null
                        : <div css = {[toAbsolute, tilePosition(paint.x, paint.y), tileSize(paint.tile, paint.side,sizeTileW, sizeTileH)]} key = {index}>
                            <Polyomino polyomino={paint.tile}
                                       side={paint.side}
                                       css={displayCavePolyomino}
                                       />
                        </div>
                )}

            </div>
            
        </div>

    )

}

const displayCavePolyomino = css`
    > div > div {
        &:nth-of-type(1){
            transform: rotateY(0deg);
        }
        &:nth-of-type(2){
            transform: rotateY(180deg);
        }
    }
`

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
    top:${x*sizeTileH}%;
    left:${y*sizeTileW}%;
`

const canvasExcludingBorders = css`
    left:2.5em;
    top:2.7em;
`

const cavePosition = css`
    top:28%;
    left:3%;
`

const caveStyle = css`
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