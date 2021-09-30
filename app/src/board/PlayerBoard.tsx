/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Cave from "./Cave";
import { getTotem } from "./PlayerPanel";
import Card from './Card'
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Images from "../utils/Images";
import { isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { DropTargetMonitor, useDrop, XYCoord } from "react-dnd";
import CardInHand, {isCardInHand} from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { Hand, Picture } from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import { getGoalsArray } from "@gamepark/prehistories/material/Goals";

type Props = {
    player:PlayerView | PlayerViewSelf | PlayerHuntView,
    phase:Phase | undefined,
    players:(PlayerView | PlayerViewSelf | PlayerHuntView)[]
    isActiveHuntingPlayer:boolean
}

const PlayerBoard : FC<Props> = ({player, players, phase, isActiveHuntingPlayer}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()

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

      const [{canDropDiscard, isOverDiscard}, dropRefDiscard] = useDrop({
        accept: ['CardPlayed'],
        canDrop: (item:CardPlayed) => {
            return true
        },
        collect: monitor => ({
          canDropDiscard: monitor.canDrop(),
          isOverDiscard: monitor.isOver()
        }),
        drop: (item: CardPlayed) => {
            return {type:MoveType.SpendHunter, card:item.card, playerId:player.color}          
        }
      })

      const getItemProps = (index: number) => {
        const card:number = player.hand[index]      // Can't be a PlayerView
        return ({
          hoverStyle: css`transform: translateY(-25%) scale(1.7);`,
          drag: {
            type: "CardInHand",
            item: {type:"CardInHand", card},
            canDrag: player.color === playerId && phase === Phase.Initiative ,
            drop: () => play({type:MoveType.PlayHuntCard, card:card, playerId:player.color })
          },
        })
      }

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave player={player}
                  phase={phase}
            />

            <div css={totemTokenPanelPosition}>

            {[...Array(player.totemTokens)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={totemStyle} draggable={false} />)}

            </div>

            <div css={cardHandPanelPosition}> 

                <Hand css={[handPosition]} rotationOrigin={10} gapMaxAngle={isPlayerViewSelf(player) ? 3.2 - 0.12*player.hand.length : 3.2 - 0.12*player.hand} maxAngle={80} sizeRatio={11/8} getItemProps={isPlayerViewSelf(player) ? getItemProps : undefined} >
            
                    {isPlayerViewSelf(player) ? player.hand.map((card, index) => 
                    
                        <Card key={index}
                        color={player.color}
                        css={cardStyle}
                        power={getColoredDeck(player.color)[card].power}
                        speed={getColoredDeck(player.color)[card].speed}
                        draggable={player.isReady !== true}
                        draggableItem={{type:"CardInHand", card:card}}
                        type={"CardInHand"}
                        />
                    
                    ) : [...Array(player.hand)].map((_, i) => 
                        <Card key={i}
                        css = {cardStyle}
                        color={player.color}   
                        />
                    )}

                </Hand>

            </div>

            <div css={[cardPlayedPanelPosition, canDropPlayed && canDropStyle, canDropPlayed && isOverPlayed && isOverStyle]} ref = {dropRefPlayed}> 

            <span css={[spanDropDisplay(canDropPlayed)]}>{t("Drag Here")}</span>
            
            {Array.isArray(player.played) ? player.played.map((card, index) => 
            
                <Card key={index}
                css = {[cardPlayedPosition(index), cardStyle]}
                color={player.color}
                power={getColoredDeck(player.color)[card].power}
                speed={getColoredDeck(player.color)[card].speed}
                draggable={player.huntPhase === HuntPhase.Pay && player.color === playerId}
                draggableItem={{type:"CardPlayed", card:card}}
                type={"CardPlayed"}
                />
            
            ) : [...Array(player.played)].map((_, i) => 
                <Card key={i}
                 css = {[cardPlayedPosition(i), cardStyle]}
                 color={player.color}   
                />
            )}

        </div>

            <div css={[discardZonePosition, discardZoneStyle, canDropDiscard && canDropStyle, canDropDiscard && isOverDiscard && isOverStyle]} ref = {dropRefDiscard}>

                {player.discard.map((card, index) =>  
                    <Card key={index}
                          color={player.color}
                          power={getColoredDeck(player.color)[card].power}
                          speed={getColoredDeck(player.color)[card].speed}
                          css={[deckOffset(index), cardStyle]}
                    />)}

            </div>

            <div css={[deckZonePosition]}> 
            
                {[...Array(player.deck)].map((_, i) => <Picture key={i} alt={t('token')} src={getCardBack(player.color)} css={[cardStyle, deckOffset(i), deckCardSize]} draggable={false} />)}
            
            </div>

            {isActiveHuntingPlayer === true && player.injuries !== undefined &&
                <div css={injuriesndicatorPosition}>
                    {[...Array(player.injuries)].map((_,i) => <Picture key={i} alt={t('injuries')} src={Images.arrowBrokenIcon} draggable={false} css={brokenArrowIconStyle(i+1)} /> )}
                </div>
            }
            
        </div>

    )
    
}

const injuriesndicatorPosition = css`
position:absolute;
top:22%;
left:1%;
width:14%;
text-align:center;
`

const brokenArrowIconStyle = (index:number) => css`
margin:-0.4em 0em;
width:80%;
height:50%;
border:0.5em solid orange;
border-radius:15%;
box-shadow:0 0 0.5em black;
transform:rotateZ(${Math.pow(-1, index)*2*index}deg);
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
width:20.5%;
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
border : dashed 0.6em white;
background-color:rgba(131, 180, 65,0.5);

`

const isOverStyle = css`
background-color:rgba(131, 180, 65,0.8);
`

const cardPlayedPanelPosition = css`
position:absolute;
top:42%;
right:10%;
width:18.5%;
height:38%;
border : solid 0.6em transparent;
border-radius:20% / 10%;
`

const deckZonePosition = css`
position:absolute;
bottom:0%;
left:2%;
width:12%;
height:18%;
`
const deckZoneStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const discardZonePosition = css`
position:absolute;
bottom:0%;
right:0%;
width:12%;
height:18%;
`
const discardZoneStyle = css`
`

const cardPosition = (position:number, handLength:number) => css`
position:absolute;
top:0;
height:100%;
width:20%;

`

const cardPlayedPosition = (key:number) => css`
width:70%;
height:49%;
position:absolute;
top:${(key%6)*10}%;
left:${Math.floor(key/6)*30}%;
`

const cardStyle = css`
border-radius:8%;
box-shadow:0 0 0.5em black;
`

const cardHandPanelPosition = css`
    position:absolute;
    bottom:0%;
    right:20%;
    width:60%;
    height:18%;
`

const totemStyle = css`
    height:7em;
    width:7em;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:1em auto;
`

const totemPosition = (token:number|false, index:number) => css`
position:absolute;
${token === false && `top:${index*10}%; right:2%;`};
${token === -1 && `display:none;`};
`

const totemTokenPanelPosition = css`
    position:absolute;
    top:0%;
    right:1%;
    width:8%;
    height:80%;

    display:flex;
    flex-direction:column;
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