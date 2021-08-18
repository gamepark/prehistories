/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { getPlayerName } from "@gamepark/prehistories/PrehistoriesOptions";
import Phase from "@gamepark/prehistories/types/Phase";
import { PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { PlayerTimer, usePlay, usePlayer, usePlayerId } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Button from "../utils/Button";
import Images from "../utils/Images";
import AvatarPanel from "./AvatarPanel";

type Props = {
    player: PlayerView | PlayerViewSelf,
    phase?:Phase
    position:number
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel : FC<Props> = ({player:{color, totemTokens, isReady}, position, phase, ...props}) => {

    const playerInfo = usePlayer(color)
    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()

    return (

        <div {...props} css={[playerPanelStyle, playerPanelPosition(position)]}>

            <AvatarPanel playerInfo={playerInfo} color={color} />

            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(color, t) : playerInfo?.name}</h1>
            <div css={totemRemainingPosition}>

                {[...Array(totemTokens)].map((e, i) => <img key={i} alt={t('token')} src={getTotem(color)} css={totemStyle(totemTokens)} draggable={false} />)}

            </div>
            <PlayerTimer playerId={color} css={[TimerStyle]}/>

            {displayValidationButton(phase, playerId, color, isReady) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.TellYouAreReady, playerId:color})}} colorButton={color} >{t('Validate')}</Button> }

        
        </div>

    )

}

function displayValidationButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, isReady:boolean|undefined):boolean{
    return phase === Phase.Initiative && playerId === color && isReady !== true
}

const validationButtonPosition = css`
    position:relative;
    width:50%;
    height:20%;
    font-size:3em;
`

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