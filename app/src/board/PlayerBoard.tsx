/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import PlayerState from "@gamepark/prehistories/PlayerState";
import { FC } from "react";
import Cave from "./Cave";

type Props = {
    player:PlayerState
}

const PlayerBoard : FC<Props> = ({player}) => {

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave player={player} />

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