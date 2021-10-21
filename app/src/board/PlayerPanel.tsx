/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { getPlayerName } from "@gamepark/prehistories/PrehistoriesOptions";
import Phase from "@gamepark/prehistories/types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { PlayerTimer, usePlayer } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import { FC, HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import Images, { bluePowerBanners, greenPowerBanners, redPowerBanners, whitePowerBanners, yellowPowerBanners } from "../utils/Images";
import AvatarPanel from "./AvatarPanel";

type Props = {
    player: PlayerView | PlayerViewSelf | PlayerHuntView,
    phase?:Phase
    position:number
    huntOrder?:PlayerColor[] 
    nbPlayers:number
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel : FC<Props> = ({player:{color, totemTokens, injuries}, position, phase, huntOrder, nbPlayers, ...props}) => {

    const playerInfo = usePlayer(color)
    const {t} = useTranslation()

    return (

        <div {...props} css={[playerPanelStyle(getBG(color)), playerPanelPosition(position)]}>

            {huntOrder !== undefined && <div css={[powerPosition, powerStyle(getPowerBanner(color)[huntOrder.findIndex(c => c === color) !== -1 ? huntOrder.findIndex(c => c === color) + (nbPlayers - huntOrder.length) : -1]), entryBannerAnim]}> </div>}

            <AvatarPanel playerInfo={playerInfo} color={color} css={css`z-index:5;`}/>

            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(color, t) : playerInfo?.name}</h1>
            <div css={totemRemainingPosition}>

                {[...Array(totemTokens)].map((e, i) => <Picture key={i} alt={t('token')} src={getTotem(color)} css={totemStyle(totemTokens)} draggable={false} />)}

            </div>
            <PlayerTimer playerId={color} css={[TimerStyle]}/>

            {(injuries !== undefined) &&  
                <div css={injuriesIndicatorPosition}>
                    {[...Array(injuries)].map((_,i) => <Picture key={i} alt={t('injuries')} src={Images.arrowBrokenIcon} draggable={false} css={brokenArrowIconStyle(i)} /> )}
                </div>}

        </div>

    )

}

const injuriesIndicatorPosition = css`
position:absolute;
bottom:7%;
left:25%;
width:50%;
height:32%;
text-align:center;
`

const brokenArrowIconStyle = (index:number) => css`
position:absolute;
top:0;
left:${index*25}%;
width:38%;
height:100%;
border:0.1em solid orange;
border-radius:15%;
box-shadow:0 0 0.5em black;
transform:rotateZ(-10deg);
`

const entryBannerKeyframes = keyframes`
from{
    top:27%;
    left:12.5%;
    transform-origin:top;
    transform:rotateZ(95deg);
}
to{
    top:55%;
    left:3%;
    transform-origin:center;
    transform:rotateZ(5deg);
}
`

const entryBannerAnim = css`
animation: ${entryBannerKeyframes} 1s ease-out;
`

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
top:55%;
left:3%;
z-index:-1;
width:18%;
height:40%;
transform:rotateZ(5deg);
`

const powerStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
filter:drop-shadow(0 0 0.2em black);
`
const playerPanelPosition = (position:number) => css`
    position:absolute;
    top:${7+16+15*position}%;
    z-index:0;
    right:0;
    height:15%;
    width:20%;
`

const playerPanelStyle = (image:string) => css`
    background-image: url(${image});
    background-size: cover;
    background-repeat: no-repeat;
    background-position: top;
    border:0.1em solid black;
    cursor:pointer;
`

const nameStyle = css`
    font-size:2.9em;
    font-family:'Reggae One', sans-serif;
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