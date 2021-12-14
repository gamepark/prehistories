/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {getPlayerName} from "@gamepark/prehistories/PrehistoriesOptions";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {PlayerTimer, useAnimation, usePlayer} from "@gamepark/react-client";
import {Hand, Picture} from "@gamepark/react-components";
import {FC, HTMLAttributes} from "react";
import {useTranslation} from "react-i18next";
import {centerContent, centerContainer, placingBackground, setPercentDimension, toAbsolute, toFullSize} from "../utils/styles";
import Images, {bluePowerBanners, greenPowerBanners, redPowerBanners, whitePowerBanners, yellowPowerBanners} from "../utils/Images";
import AvatarPanel from "./AvatarPanel";
import Card from './Card';
import FulfillObjective, { isFulfillObjective } from "@gamepark/prehistories/moves/FulfillObjective";
import GameView from "@gamepark/prehistories/GameView";
import { getHuntingPlayer } from "@gamepark/prehistories/types/HuntingPlayer";
import {getTokensForFulfilledObjective} from "@gamepark/prehistories/material/ObjectiveRules"
import Objective from "@gamepark/prehistories/material/Objective";
import { isWinner } from "@gamepark/prehistories/Prehistories";

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

    const playerRank = game.players.some(isWinner) ? [...game.players].sort((a,b) => -a.totemTokens.length + b.totemTokens.length).findIndex(p => p.color === color) : undefined
    return (

        <>

            {playerRank !== undefined &&
                <>
                    <div css={[winBanner(playerRank), centerContent, toAbsolute,  setPercentDimension(14,30), bannerPosition(position, color), bannerEntryAnimation]} >
                        <div css={[setPercentDimension(100,25), css`position:relative; transform:translateX(-132.5%);`]}>
                            {playerRank === 0 && <Picture alt={t("token")} src={Images.victoryIcon} css={[toAbsolute, centerContainer, css`width:15em; height:15em; filter:drop-shadow(0 0.5em 0.5em black); top:37%; `]} />}
                            <Picture alt={t("token")} src={getTotem(color)} css={[toAbsolute, centerContainer, css`width:10em; height:10em; border-radius:100%; box-shadow:0 0 1em black, 0 0 1em black; `]} />
                            <span css={[toAbsolute, centerContainer, css`font-size:7em; color:white;font-family:'Reggae One', sans-serif; -webkit-text-stroke: 0.03em black;`]}>x{Math.max(0,8-totemTokens.length)} </span>
                        </div>
                    </div>
                </>
            }

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

        </>

    )

}

const bannerPosition = (position:number, color:PlayerColor) => css`
    top:${7.5+15.9+15.42*position+0.42}%;
    right:0%;
    ${color !== PlayerColor.White ? `color:white;` : `color:white;`}
`

const bannerOffset = (rank:number, nbPlayers:number) => css`
    transform:translateX(${-(nbPlayers-1-rank)*3.5}%);
`

const bannerEntryKeyframes = keyframes`
from{width:10%;}
to{width:30%;}
`

const bannerEntryAnimation = css`
    animation:${bannerEntryKeyframes} 3s ease-out forwards;
`

const winBanner = (rank:number) => css`
    right:0;
    background-color:rgba(255,255,255,0.8);
    border-radius:2em;
    z-index:2;
    ${rank === 0 && `border:0.5em gold solid;box-shadow:0 0 1em gold,0 0 1em gold;`}
    ${rank === 1 && `border:0.5em silver solid;box-shadow:0 0 0.7em silver,0 0 0.7em silver;`}
    ${rank === 2 && `border:0.5em sienna solid;box-shadow:0 0 0.7em sienna,0 0 0.7em sienna;`}
`

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
    right:0%;
    ${color !== PlayerColor.White ? `color:white;` : `color:white;`}
`

const playerPanelBorder = css`
    border:0.1em solid black;
    border-radius:0.8em;
    cursor:pointer;
    z-index:3;
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