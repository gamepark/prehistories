/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import Move from "@gamepark/prehistories/moves/Move";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { getPlayerName } from "@gamepark/prehistories/PrehistoriesOptions";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { PlayerTimer, usePlay, usePlayer, usePlayerId } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import { FC, HTMLAttributes, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../utils/Button";
import Images, { bluePowerBanners, greenPowerBanners, redPowerBanners, whitePowerBanners, yellowPowerBanners } from "../utils/Images";
import AvatarPanel from "./AvatarPanel";

type Props = {
    player: PlayerView | PlayerViewSelf | PlayerHuntView,
    phase?:Phase
    position:number
    huntOrder?:PlayerColor[] 
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel : FC<Props> = ({player:{color, totemTokens, isReady, huntPhase, huntSpotTakenLevels}, position, phase, huntOrder, ...props}) => {

    const playerInfo = usePlayer(color)
    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()


    return (

        <div {...props} css={[playerPanelStyle(getBG(color)), playerPanelPosition(position)]}>

            {huntOrder !== undefined && <div css={[powerPosition, powerStyle(getPowerBanner(color)[huntOrder.findIndex(c => c === color)])]}> </div>}

            <AvatarPanel playerInfo={playerInfo} color={color} css={css`z-index:5;`}/>

            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(color, t) : playerInfo?.name}</h1>
            <div css={totemRemainingPosition}>

                {[...Array(totemTokens)].map((e, i) => <Picture key={i} alt={t('token')} src={getTotem(color)} css={totemStyle(totemTokens)} draggable={false} />)}

            </div>
            <PlayerTimer playerId={color} css={[TimerStyle]}/>

            {displayValidationButton(phase, playerId, color, isReady) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.TellYouAreReady, playerId:color})}} colorButton={color} >{t('Validate')}</Button> }
            {displayTakeWithInjuryButton(phase, playerId, color, huntPhase, huntSpotTakenLevels !== undefined && huntSpotTakenLevels[0] <= 0) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.ValidateSpendedHunters, playerId:color})}} colorButton={color} >{t('Take With Injury')}</Button> }
            {displayEndTurnButton(phase, playerId, color, huntPhase) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.EndTurn, playerId:color})}} colorButton={color} >{t('End your Turn')}</Button>}

        </div>

    )

}

function getPowerBanner(color:PlayerColor):string[]{
    switch(color){
        case PlayerColor.Yellow :
            return yellowPowerBanners
        case PlayerColor.Blue :
            return bluePowerBanners
        case PlayerColor.Red :
            return redPowerBanners
        case PlayerColor.Green :
            return greenPowerBanners
        case PlayerColor.White :
            return whitePowerBanners
    }
}

const powerPosition = css`
position:absolute;
top:43%;
left:3%;
z-index:-1;
width:18%;
height:33%;
transform:rotateZ(5deg);
`

const powerStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
filter:drop-shadow(0 0 0.2em black);
`

function displayEndTurnButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, huntPhase:HuntPhase|undefined):boolean{
    return phase === Phase.Hunt && playerId === color && huntPhase === HuntPhase.Hunt
}

function displayValidationButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, isReady:boolean|undefined):boolean{
    return phase === Phase.Initiative && playerId === color && isReady !== true
}

function displayTakeWithInjuryButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, huntPhase:HuntPhase | undefined, canPay:boolean):boolean{
    return phase === Phase.Hunt && playerId === color && huntPhase === HuntPhase.Pay && canPay
}

const validationButtonPosition = css`
    position:absolute;
    left:50%;
    transform:translateX(-50%);
    width:fit-content;
    height:20%;
    font-size:3em;
`

const playerPanelPosition = (position:number) => css`
    position:absolute;
    top:${7+18.6*position}%;
    z-index:0;
    right:0;
    height:18.6%;
    width:20%;
`

const playerPanelStyle = (image:string) => css`
    background-image: url(${image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;
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

export function getBG(color:PlayerColor):string{
    switch(color){
        case PlayerColor.Blue:
            return Images.blueBGtest
        case PlayerColor.Green:
            return Images.greenBGtest
        case PlayerColor.Red:
            return Images.redBGtest
        case PlayerColor.White:
            return Images.whiteBGtest
        case PlayerColor.Yellow:
            return Images.yellowBGtest
    }
}

export default PlayerPanel