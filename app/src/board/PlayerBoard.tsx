/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { FC } from "react";
import Cave from "./Cave";

type Props = {
    color:PlayerColor|undefined
}

const PlayerBoard : FC<Props> = ({color}) => {

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave color={color} />

        </div>

    )
    
}

const playerBoardPosition = css`
position:absolute;
top:7%;
left:24%;
width:56%;
height:93%;
`

const playerBoardStyle = css`
border:0.1em solid black;
`

export default PlayerBoard