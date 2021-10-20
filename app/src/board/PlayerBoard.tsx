/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cave from "./Cave";
import { getTotem } from "./PlayerPanel";
import Card from './Card'
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Images from "../utils/Images";
import { isPlayerHuntView, isPlayerViewSelf, PlayerHuntView, PlayerView, isPlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { DropTargetMonitor, useDrop, XYCoord } from "react-dnd";
import CardInHand, {isCardInHand} from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { useAnimation, useAnimations, usePlay, usePlayerId } from "@gamepark/react-client";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { Hand, Picture } from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import ResolvePermanentObjectives, { isResolvePermanentObjectives } from "@gamepark/prehistories/moves/CheckPermanentObjectives";
import ResolveVariableObjectives from "@gamepark/prehistories/moves/CheckVariableObjectives";
import PlayHuntCard, { isPlayHuntCard, PlayHuntCardView } from "@gamepark/prehistories/moves/PlayHuntCard";
import { RevealHuntCardsView, isRevealHuntCards } from "@gamepark/prehistories/moves/RevealHuntCards";
import SpendHunter, { isSpendHunter } from "@gamepark/prehistories/moves/SpendHunter";
import ShuffleDiscardPile, { isShuffleDiscardPile, ShuffleDiscardPileView } from "@gamepark/prehistories/moves/ShuffleDiscardPile";
import DrawXCards, { DrawXCardsView, isDrawXCards, isDrawXCardsView, isNotDrawXCardsView } from "@gamepark/prehistories/moves/DrawXCards";
import { getPlayerColor } from "../utils/getterFunctions";
import Button from "../utils/Button";
import SetSelectedHunters, { ResetSelectedHunters, resetSelectedHuntersMove, setSelectedHunterMove } from "../localMoves/setSelectedHunters";

type Props = {
    player:PlayerView | PlayerViewSelf | PlayerHuntView,
    phase:Phase | undefined,
    players:(PlayerView | PlayerViewSelf | PlayerHuntView)[]
    isActiveHuntingPlayer:boolean
    goals:number[]
    selectedHunters:number[]|undefined
}

const PlayerBoard : FC<Props> = ({player, players, phase, isActiveHuntingPlayer, goals, selectedHunters}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()

    const totemAnimationPermanent = useAnimation<ResolvePermanentObjectives>(animation => isResolvePermanentObjectives(animation.move))
    const totemAnimationVariable = useAnimation<ResolveVariableObjectives>(animation => isResolvePermanentObjectives(animation.move))
    const playHuntCardAnimation = useAnimation<PlayHuntCardView>(animation => isPlayHuntCard(animation.move))
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move))
    const shuffleDiscardAnimation = useAnimation<ShuffleDiscardPileView>(animation => isShuffleDiscardPile(animation.move))
    const powerOfSelectedHunters:number = selectedHunters !== undefined ? selectedHunters.reduce((acc, cv) => acc + getColoredDeck(player.color)[cv].power,0) : 0
    const drawXCardsAnimation = useAnimation<DrawXCards|DrawXCardsView>(animation => isDrawXCards(animation.move) && animation.move.playerId === player.color)
    const playerHand:number|number[] = isPlayerViewSelf(player) ? [...player.hand] : player.hand

    if(drawXCardsAnimation && isNotDrawXCardsView(drawXCardsAnimation.move) && Array.isArray(playerHand)){
        playerHand.push(...drawXCardsAnimation.move.cards)
    }

    function howManyTotemToMove(move:ResolvePermanentObjectives):number{
        return move.objectivesCompleted[0].length + move.objectivesCompleted[1].length + (move.objectivesCompleted[2] === true ? 1 : 0)
    }

    function displayValidationButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, isReady:boolean|undefined):boolean{
        return phase === Phase.Initiative && playerId === color && isReady !== true
    }

    function displayEndTurnButton(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, huntPhase:HuntPhase|undefined):boolean{
        return phase === Phase.Hunt && playerId === color && huntPhase === HuntPhase.Hunt
    }

    function displayHuntingButtons(phase:Phase|undefined, playerId:PlayerColor|undefined, color:PlayerColor, huntPhase:HuntPhase|undefined):boolean{
        return phase === Phase.Hunt && playerId === color && huntPhase === HuntPhase.Pay
    }

    function validateHunters(hunters:number[]|undefined, injury:boolean){
        if (hunters !== undefined){
            hunters?.forEach(card => {
                play({type:MoveType.SpendHunter, playerId:player.color, card})
            })
            if (injury){
                play({type:MoveType.ValidateSpendedHunters, playerId:player.color}, {delayed:true})
            }
            playResetHunters(resetSelectedHuntersMove(), {local:true})
        }
    }

    const playSelectHunter = usePlay<SetSelectedHunters>()
    const playResetHunters = usePlay<ResetSelectedHunters>()



    const [{canDropPlayed, isOverPlayed}, dropRefPlayed] = useDrop({
        accept: ["CardInHand", 'CardPlayed'],
        canDrop: (item: CardInHand | CardPlayed) => {

            if(isCardInHand(item)){
                return player.color === playerId          
            } else {
                return false
            }
        },
        collect: monitor => ({
          canDropPlayed: monitor.canDrop(),
          isOverPlayed: monitor.isOver()
        }),
        drop: (item: CardInHand | CardPlayed) => {
            if(isCardInHand(item)){
                return {type:MoveType.PlayHuntCard, card:item.card, playerId:player.color }          
            } else {
                return 
            }
        }
      })

      const getItemProps = (index: number) => {
        const card:number = player.hand[index]      // if playerView ==> undefined
        return ({
          ignore:isPlayerView(player) && playHuntCardAnimation && index === 0,
          hoverStyle: isPlayerViewSelf(player) ? css`transform: translateY(-25%) scale(1.7);` : undefined,
          drag: {
            type: "CardInHand",
            item: {type:"CardInHand", card},
            canDrag: player.color === playerId && phase === Phase.Initiative ,
            drop: () => play({type:MoveType.PlayHuntCard, card:card, playerId:player.color })
          },
          animation:playHuntCardAnimation ? {
            seconds:playHuntCardAnimation.duration,
            delay:0,
            fromNeutralPosition:false
          } : ( drawXCardsAnimation ? {
            seconds:drawXCardsAnimation.duration,
            delay:0,
            fromNeutralPosition:isNotDrawXCardsView(drawXCardsAnimation.move) && Array.isArray(playerHand) && index > playerHand.length - drawXCardsAnimation.move.cards.length -1
          } : undefined)
        })
      }

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave player={player}
                  phase={phase}
            />



            <div css={cardHandPanelPosition}> 

                <Hand css={[handPosition]} rotationOrigin={10} gapMaxAngle={isPlayerViewSelf(player) ? 3.2 - 0.12*player.hand.length : 3.2 - 0.12*player.hand} maxAngle={80} sizeRatio={8/11} getItemProps={getItemProps} >
            
                    {(isPlayerViewSelf(player) && Array.isArray(playerHand))
                        ? playerHand.map((card, index) => 
                            <Card key={index}
                            color={player.color}
                            css={[cardStyle, playHuntCardAnimation && index === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration,player.played.length), drawXCardsAnimation && isNotDrawXCardsView(drawXCardsAnimation.move) && drawXCardsAnimation.move.cards.find(c => c === card) && drawXCardsAnimStyle(drawXCardsAnimation.duration)]}
                            power={getColoredDeck(player.color)[card].power}
                            speed={getColoredDeck(player.color)[card].speed}
                            draggable={player.isReady !== true}
                            draggableItem={{type:"CardInHand", card:card}}
                            type={"CardInHand"}
                            />
                    )

                        : [...Array(player.hand)].map((_, i) => 
                            <Card key={i}
                            css = {[cardStyle,playHuntCardAnimation && i === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration, (player.played as number))]}
                            color={player.color}   
                            />
                        )
                    }

                </Hand>

            </div>

            <div css={[cardPlayedPanelPosition(player.color), canDropPlayed && canDropStyle, canDropPlayed && isOverPlayed && isOverStyle]} ref = {dropRefPlayed}> 

            {displayValidationButton(phase, playerId, player.color, player.isReady) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.TellYouAreReady, playerId:player.color})}} colorButton={player.color} >{t('Validate')}</Button> }
            {displayEndTurnButton(phase, playerId, player.color, player.huntPhase) && <Button css={[validationButtonPosition]} onClick={() => {play({type:MoveType.EndTurn, playerId:player.color})}} colorButton={player.color} >{t('End your Turn')}</Button>}

            {displayHuntingButtons(phase, playerId, player.color, player.huntPhase) && 
                <div css={huntingButtonsPosition(player.color)}>

                    <div css={[injuryStyle, (powerOfSelectedHunters < player.huntSpotTakenLevels![0] || powerOfSelectedHunters > player.huntSpotTakenLevels![1]) && desactivateStyle]} onClick={() => powerOfSelectedHunters >= player.huntSpotTakenLevels![0] && powerOfSelectedHunters < player.huntSpotTakenLevels![1] && validateHunters(selectedHunters, true)} > <span>{Math.max(player.huntSpotTakenLevels![0] - powerOfSelectedHunters,0)}</span></div>
                    <div css={[noInjuryStyle, powerOfSelectedHunters < player.huntSpotTakenLevels![1] && desactivateStyle]} onClick={() => powerOfSelectedHunters >= player.huntSpotTakenLevels![1] && validateHunters(selectedHunters, false)} > <span>{Math.max(player.huntSpotTakenLevels![1] - powerOfSelectedHunters,0)}</span> </div>
                    
                </div>
            }

            <span css={[spanDropDisplay(canDropPlayed)]}>{t("Drag Here")}</span>
            
            {Array.isArray(player.played) ? player.played.map((card, index) => {
                const spendCardAnimation = spendCardAnimations.find(a => a.move.card === card)
                return <Card key={index}
                css = {[cardPlayedPosition(index), cardStyle,
                        spendCardAnimation && index === (player.played as number[]).findIndex(card => card === spendCardAnimation.move.card) && spendAnimation(player.discard.length, spendCardAnimation.duration),
                        selectedHunters?.find(c => c === card) !== undefined && selectedCard
                    ]}
                color={player.color}
                power={getColoredDeck(player.color)[card].power}
                speed={getColoredDeck(player.color)[card].speed}
                onClick={() => player.color === playerId && playSelectHunter(setSelectedHunterMove(card), {local:true})}
                
                />
            
           } ) : [...Array(player.played)].map((_, i) => 
                <Card key={i}
                 css = {[cardPlayedPosition(i), cardStyle]}
                 color={player.color}   
                 power={revealCardsAnimation ? getColoredDeck(player.color)[revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards[i]].power : undefined}
                 speed={revealCardsAnimation ? getColoredDeck(player.color)[revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards[i]].speed : undefined}
                />
            )}

        </div>

            <div css={[discardZonePosition]}>

                {player.discard.map((card, index) =>  
                    <Card key={index}
                          color={player.color}
                          power={getColoredDeck(player.color)[card].power}
                          speed={getColoredDeck(player.color)[card].speed}
                          css={[deckOffset(index), cardStyle, shuffleDiscardAnimation && shufflingAnimation(index, shuffleDiscardAnimation.duration, player.discard.length)]}
                    />)}

            </div>

            <div css={[deckZonePosition]}> 
            
                {[...Array(player.deck - (drawXCardsAnimation ? (isNotDrawXCardsView(drawXCardsAnimation.move) ? drawXCardsAnimation.move.cards.length : 0) : 0))].map((_, i) => <Picture key={i} alt={t('token')} src={getCardBack(player.color)} css={[cardStyle, deckOffset(i), deckCardSize]} draggable={false} />)}
            
            </div>
            
        </div>

    )
    
}

type PlayerCardsProps = {
    player:PlayerViewSelf
}

const PlayerCards : FC<PlayerCardsProps> = ({player}) => {

    const playHuntCardAnimation = useAnimation<PlayHuntCardView>(animation => isPlayHuntCard(animation.move) && animation.move.playerId === player.color)
    const drawXCardsAnimation = useAnimation<DrawXCards>(animation => isDrawXCards(animation.move) && animation.move.playerId === player.color)
    const playerHand = [...player.hand]
    if(drawXCardsAnimation){
        playerHand.push(...drawXCardsAnimation.move.cards)
    }
    
        return <>
        {
        playerHand.map((card, index) => 
                    
            <Card key={index}
            color={player.color}
            css={[cardStyle, playHuntCardAnimation && index === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration,player.played.length), drawXCardsAnimation && drawXCardsAnimation.move.cards.find(c => c === card) && drawXCardsAnimStyle(60)]}
            power={getColoredDeck(player.color)[card].power}
            speed={getColoredDeck(player.color)[card].speed}
            draggable={player.isReady !== true}
            draggableItem={{type:"CardInHand", card:card}}
            type={"CardInHand"}
            />
        
        )}
    </>
}

const drawHuntCardKeyframes = keyframes`
from{
    transform:translate(-230%,-7%) rotateY(-180deg);
}
50%{
    transform:translate(-230%,-7%) rotateY(-180deg);
}
to{}
`

const drawXCardsAnimStyle = (duration:number) => css`
transform-style:preserve-3d;
animation:${drawHuntCardKeyframes} ${duration}s ease-in-out forwards;
`

const selectedCard = css`
box-shadow:0 0 1em 0.2em lime;
transform-origin:bottom left;
transform:rotateZ(-20deg);
`

const desactivateStyle = css`
filter: grayscale(80%);
cursor:not-allowed;
&:active{
    box-shadow:0 0.2em 0.5em black;
    top:0%;
}
`

const noInjuryStyle = css`
position:absolute;
top:0%;
right:10%;
width:35%;
height:100%;
background-image: url(${Images.arrowCleanIcon});
background-size: cover;
background-repeat: no-repeat;
background-position: center;
border:0.5em solid orange;
border-radius:15%;
cursor:pointer;
display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
box-shadow:0 0.2em 0.5em black;
&:active{
    box-shadow:0 0.2em 0.2em black;
    top:2%;
}
span{
    font-size:6em;
    font-family:'Reggae One', sans-serif;
    color:black;
}
`

const injuryStyle = css`
cursor:pointer;
position:absolute;
top:0%;
left:10%;
width:35%;
height:100%;
background-image: url(${Images.arrowBrokenIcon});
background-size: cover;
background-repeat: no-repeat;
background-position: center;
border:0.5em solid orange;
border-radius:15%;
display:flex;
flex-direction:row;
align-items:center;
justify-content:center;
box-shadow:0 0.2em 0.5em black;
&:active{
    box-shadow:0 0.2em 0.2em black;
    top:2%;
}
span{
    font-size:6em;
    font-family:'Reggae One', sans-serif;
    color:black;
}
`

const huntingButtonsPosition = (color:PlayerColor) => css`
width:80%;
height:30%;
position:absolute;
left:50%;
top:-30.5%;
transform:translateX(-50%);
z-index:1;
border:0.6em solid ${getPlayerColor(color)};
background-color:rgba(0,0,0,0.5);
border-top-left-radius:5% 15%;
border-top-right-radius:5% 15%;

`

const validationButtonPosition = css`
    position:absolute;
    left:50%;
    top:-18%;
    transform:translateX(-50%);
    width:fit-content;
    height:15%;
    font-size:3em;
    font-family:'Reggae One', sans-serif;
    z-index:1;
`

const shufflingKeyFrames = (index:number) => keyframes`
from{

}
50%,to{
  transform:rotateY(-180deg) ;
  left:${-500-index}%;  
}
`

const shufflingAnimation = (index:number, duration:number, discardLength:number) => css`
animation:${shufflingKeyFrames(discardLength - index)} ${duration-0.2}s linear ${(discardLength - index)/60}s forwards ;
`

const spendHunterKeyFrames = (discardLength:number) => keyframes`
from{z-index:11}
to{
    transform:rotateZ(0) scale(1.02);
    top:${108-discardLength*0.5}%;
    left:${71+discardLength*0.5}%;
    z-index:11;
}
`

const spendAnimation = (discardLength:number, duration:number) => css`
animation: ${spendHunterKeyFrames(discardLength)} ${duration}s ease-in forwards;
`

const dragKeyFrames = keyframes`
0% {
    box-shadow: 0 0 0.5em 0.1em gold;
  }
  90%, 100% {
    box-shadow: 0 0 0.7em 0.5em gold;
  }
`

const dragStyle = css`
animation: ${dragKeyFrames} 2s ease-in-out alternate infinite;
`

const playHuntCardKeyframes = (lengthPlayed:number) => keyframes`
from{
}
to{
    transform:translate(${38+Math.floor(lengthPlayed/3)*68.5 }%,${-195+(lengthPlayed%3)*43.5}%) scale(0.94);
}
`

const playHuntCardAnimationStyle = (duration:number, lengthPlayed:number) => css`
    animation:${playHuntCardKeyframes(lengthPlayed)} ${duration}s linear;
`

const deckCardSize = css`
width:100%;
height:100%;
`

const deckOffset = (index:number) => css`
position:absolute;
top:${-index*1}%;
left:${index*1}%;
`

const handPosition = css`
position:absolute;
top:0;
left:40%;
height:100%;
width:25.5%;

`

const spanDropDisplay = (canDrop:boolean) => css`
    ${canDrop ? `display:block;` : `display:none;`}
    font-size:4em;
    text-align:center;
    position:absolute;
    top:50%;
    left:50%;
    transform:translateY(-50%) translateX(-50%);
`

const canDropStyle = css`
background-color:rgba(131, 180, 65,0.5);
transition:all 0.2s linear;
`

const isOverStyle = css`
background-color:rgba(131, 180, 65,0.8);
`

const cardPlayedPanelPosition = (color:PlayerColor) => css`
position:absolute;
top:28%;
left:46%;
width:53%;
height:45%;
background-color:rgba(131, 180, 65,0.1);
border : solid 0.6em ${getPlayerColor(color)};
border-radius:5%;
`

const deckZonePosition = css`
position:absolute;
bottom:1%;
left:2%;
width:16%;
height:24%;
`

const discardZonePosition = css`
position:absolute;
bottom:1%;
right:1%;
width:16%;
height:23%;
transform-style: preserve-3d;
transform: perspective(200em);
z-index:1;
`

const cardPlayedPosition = (key:number) => css`
width:30%;
height:52%;
position:absolute;
top:${(key%3)*24}%;
left:${2+Math.floor(key/3)*22}%;
transform-origin:bottom left;
z-index:0;
cursor:pointer;
`

const cardStyle = css`
border-radius:8%;
box-shadow:0 0 0.5em black;
`

const cardHandPanelPosition = css`
    position:absolute;
    bottom:1%;
    right:20%;
    width:65%;
    height:24%;
    z-index:1;
`

const playerBoardPosition = css`
position:absolute;
top:7%;
left:24%;
width:56%;
height:93%;
`

const playerBoardStyle = css`

`

function getCardBack(color:PlayerColor):string{
    switch (color){
        case PlayerColor.Blue :
            return Images.cardBackBlue
        case PlayerColor.Green :
            return Images.cardBackGreen
        case PlayerColor.Red :
            return Images.cardBackRed
        case PlayerColor.White :
            return Images.cardBackWhite
        case PlayerColor.Yellow :
            return Images.cardBackYellow
    }
}

export default PlayerBoard