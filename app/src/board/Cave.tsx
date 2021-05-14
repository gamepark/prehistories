/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { FC } from "react";
import Images from "../utils/Images";

type Props = {
    color:PlayerColor | undefined
}

const Cave : FC<Props> = ({color}) => {

    return(

        <div css={[cavePosition, caveStyle(color)]}>


            
        </div>

    )

}

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
            return Images.caveYellow
    }
}


export default Cave