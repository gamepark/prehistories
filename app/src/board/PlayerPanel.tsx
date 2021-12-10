/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {getPlayerName} from "@gamepark/prehistories/PrehistoriesOptions";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {PlayerTimer, useAnimation, usePlayer} from "@gamepark/react-client";
import {Hand, Picture} from "@gamepark/react-components";
import {FC, HTMLAttributes} from "react";
import {useTranslation} from "react-i18next";
import {placingBackground, setPercentDimension, toAbsolute, toFullSize} from "../utils/styles";
import Images, {bluePowerBanners, greenPowerBanners, redPowerBanners, whitePowerBanners, yellowPowerBanners} from "../utils/Images";
import AvatarPanel from "./AvatarPanel";
import Card from './Card';
import FulfillObjective, { isFulfillObjective } from "@gamepark/prehistories/moves/FulfillObjective";
import GameView from "@gamepark/prehistories/GameView";
import { getHuntingPlayer } from "@gamepark/prehistories/types/HuntingPlayer";
import {getTokensForFulfilledObjective} from "@gamepark/prehistories/material/ObjectiveRules"
import Objective from "@gamepark/prehistories/material/Objective";

type Props = {
    player: PlayerView | PlayerViewSelf,
    position:number
    game:GameView
    playerListDisplayed: (PlayerView | PlayerViewSelf)[]
} & HTMLAttributes<HTMLDivElement>

const PlayerPanel : FC<Props> = ({player:{color, totemTokens, hunting, order, hand, played}, position, game, playerListDisplayed, ...props}) => {

    const playerInfo = usePlayer(color)
    const {t} = useTranslation()
    const handLength = Array.isArray(hand) ? hand.length : hand 
    const tokensAnimation = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))

    const getSortedObjectivesPlayers = (objective:Objective):(PlayerView|PlayerViewSelf)[] => {
        return [...playerListDisplayed].sort((a,b) => -a.totemTokens.filter(g => g === objective).length+b.totemTokens.filter(g => g === objective).length)
    }

    const tokenHasToMove = (index:number):boolean => {
        return tokensAnimation !== undefined && color === getHuntingPlayer(game)?.color && index >= 8 - totemTokens.length - getTokensForFulfilledObjective(game, tokensAnimation.move.objective)
    } 

    return (

        <div {...props} css={[placingBackground(getBG(color),"cover"), playerPanelBorder, toAbsolute, setPercentDimension(15,20), playerPanelPosition(position, color)]}>

            {order !== undefined && <div css={[toAbsolute, setPercentDimension(33,14), powerPosition, placingBackground(getPowerBanner(played.length ? color : PlayerColor.Yellow)[order],"contain"), powerShadow, entryBannerAnim, !played.length && grayscale]}> </div>}

            <AvatarPanel playerInfo={playerInfo} color={color} css={css`z-index:5;`}/>

            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(color, t) : playerInfo?.name}</h1>
            <div css={totemRemainingPosition}>

                {[...Array(Math.max(8 - totemTokens.length, 0))].map((_, i) => <Picture
                    key={i} 
                    alt={t('token')} 
                    src={getTotem(color)} 
                    css={[totemStyle(8 - totemTokens.length),
                        tokensAnimation && tokenHasToMove(i) && animateToken(tokensAnimation.duration,tokensAnimation.move.objective, 7-totemTokens.length-i, playerListDisplayed.findIndex(p => p.color === color), playerListDisplayed.length, getSortedObjectivesPlayers(tokensAnimation.move.objective).findIndex(p => p.color === color), game.objectives, totemTokens)]} 
                    draggable={false} 
                />)}

            </div>
            <PlayerTimer playerId={color} css={[toAbsolute,TimerStyle]}/>

            <Hand maxAngle={20} css={handPosition(handLength)}>{[...Array(handLength)].map((_, index) => <Card key={index} color={color} />)}</Hand>

            {(hunting && hunting.injuries !== 0) &&
                <div css={[toAbsolute, setPercentDimension(30,17), injuriesIndicatorPosition]}>
                    {[...Array(hunting.injuries)].map((_, i) => <Picture key={i} alt={t('injuries')} src={Images.arrowBrokenIcon} draggable={false} css={[toAbsolute, toFullSize, brokenArrowIconStyle, brokenArrowIconOffSet(i)]} /> )}
                </div>}

        </div>

    )

}

const animatePermanentTokenKeyframes = (objective:Objective, index:number, totemsPlaced:number, playerIndex:number, nbPlayers:number) => keyframes`
from{}
to{transform:translateX(${-25.5+(objective-1)*12.2+index*5.5+totemsPlaced*2.5}em) translateY(${-20.1-15.5*playerIndex*((nbPlayers-0.8)/nbPlayers)}em);}
`

const animateVariableTokenKeyframes45P = (objective:number, index:number, playerIndex:number, sortedObjPlayerRank:number) => keyframes`
from{}
to{transform:translateX(${-121.5+index*4.9 + (sortedObjPlayerRank === 0 ? 0 : 8.5) + objective*19}em) translateY(${-19.7-playerIndex*15.3+(sortedObjPlayerRank !== 0 ? (sortedObjPlayerRank-1)*2.4 : 0)}em);}
`

const animateVariableTokenKeyframes23P = (objective:number, index:number, playerIndex:number, sortedObjPlayerRank:number) => keyframes`
from{}
to{transform:translateX(${-114.8+index*4.9 + (sortedObjPlayerRank === 0? 0 : 8.5) + objective*19}em) translateY(${-19.7-playerIndex*15.3+(sortedObjPlayerRank !== 0 ? (sortedObjPlayerRank-1)*2.4 : 0)}em);}
`

const animateToken = (duration:number, objective:Objective, index:number, playerIndex:number, nbPlayers:number, sortedObjPlayerRank:number, objectiveList:Objective[], totemsPlacedList:Objective[]) => css`
animation : ${objective <= 3 
    ? animatePermanentTokenKeyframes(objective, index, totemsPlacedList.filter(o => o === objective).length, playerIndex,nbPlayers) 
    : nbPlayers < 4 
        ? animateVariableTokenKeyframes23P(objectiveList.findIndex(o => o === objective)!, index, playerIndex, sortedObjPlayerRank) 
        : animateVariableTokenKeyframes45P(objectiveList.findIndex(o => o === objective)!, index, playerIndex, sortedObjPlayerRank)
    } ${duration}s ease-in-out forwards;
`

const brokenArrowIconOffSet = (i:number) => css`
    transform:translateX(${-i*20}%) rotateZ(10deg);
`

const handPosition = (length:number) => css`
  font-size: 0.4em;
  left: ${25+((length-1)*(length > 9 ? 1.9 : 2.8))}%;
  bottom: 8%;
  width: ${8}em;
  height: ${11}em;
  transition:all 1s ease-in-out;
`

const injuriesIndicatorPosition = css`
    bottom:5%;
    right:10%;
    text-align:center;
`

const brokenArrowIconStyle = css`
    border:0.1em solid orange;
    border-radius:15%;
    box-shadow:0 0 0.5em black;
    transform:rotateZ(10deg);
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
    top:43%;
    left:4%;
    z-index:-1;
    transform:rotateZ(0deg);
`

const powerShadow = css`
    filter:drop-shadow(0 0 0.2em black);
`
const playerPanelPosition = (position:number, color:PlayerColor) => css`
    top:${7+15.9+15.42*position+0.42}%;
    right:0;
    ${color !== PlayerColor.White ? `color:white;` : `color:white;`}
    z-index:0;
`

const playerPanelBorder = css`
    border:0.1em solid black;
    border-radius:0.8em;
    cursor:pointer;
`

const grayscale = css`
    filter: grayscale();
`

const nameStyle = css`
    font-size: 2.8em;
    font-family: 'Reggae One', sans-serif;
    margin: 0.2em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const TimerStyle = css`
    top:69%;
    left:2%;
    display: block;
    font-size: 2.3em;
    padding-top: 0.5em;
    font-family:'Reggae One', sans-serif;
`

const totemRemainingPosition = css`
    height:3.5em;
    margin:0.5em 1em;
    display:flex;
    flex-direction:row;
`

const totemStyle = (spread:number) => css`
    height:4em;
    width:4em;
    margin : 0 ${-0.0625*spread+(8-spread)/10}em;
    border-radius:100%;
    box-shadow:0 0 0.4em black;
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