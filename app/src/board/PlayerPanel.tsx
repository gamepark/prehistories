/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PlayerState from "@gamepark/prehistories/PlayerState";
import { getPlayerName } from "@gamepark/prehistories/PrehistoriesOptions";
import { PlayerTimer, usePlayer } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Images from "../utils/Images";
import AvatarPanel from "./AvatarPanel";

type Props = {
    player: PlayerState,
    position:number
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel : FC<Props> = ({player:{color, totemTokens}, position, ...props}) => {

    const playerInfo = usePlayer(color)
    const {t} = useTranslation()

    return (

        <div {...props} css={[playerPanelStyle, playerPanelPosition(position)]}>

            <AvatarPanel playerInfo={playerInfo} color={color} />

            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(color, t) : playerInfo?.name}</h1>
            <div css={totemRemainingPosition}>

                {[...Array(totemTokens)].map((e, i) => <img key={i} alt={t('token')} src={getTotem(color)} css={totemStyle(totemTokens)} draggable={false} />)}

            </div>
            <PlayerTimer playerId={color} css={[TimerStyle]}/>

        
        </div>

    )

}

const playerPanelPosition = (position:number) => css`
    position:absolute;
    top:${7+18.6*position}%;
    right:0;
    height:18.6%;
    width:20%;
`

const playerPanelStyle = css`
    background-color:teal;
    border:0.1em solid black;
`

const nameStyle = css`
    font-size:3.0em;
    font-family:'Mulish', sans-serif;
    margin : 0.2em 1em;
`

const TimerStyle = css`
    display: block;
    font-size: 2.5em;
    padding-top: 0.5em;
`

const totemRemainingPosition = css`
    height:3.5em;
    margin:1em 1em;
    display:flex;
    flex-direction:row;
`

const totemStyle = (spread:number) => css`
height:3em;
width:3em;
margin : 0em ${-0.0625*spread+(8-spread)/10}em;
border-radius:100%;


`

export function getTotem(color:PlayerColor):string{
    switch(color){
        case PlayerColor.Blue:
            return Images.totemBlue
        case PlayerColor.Green:
            return Images.totemGreen
        case PlayerColor.Red:
            return Images.totemRed
        case PlayerColor.White:
            return Images.totemWhite
        case PlayerColor.Yellow:
            return Images.totemYellow
    }
}

export default PlayerPanel