/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Cave from "./Cave";
import { getTotem } from "./PlayerPanel";
import Card from './Card'
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Images from "../utils/Images";
import { isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { useDrop } from "react-dnd";
import CardInHand, {isCardInHand} from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { usePlayerId } from "@gamepark/react-client";
import { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { Picture } from "@gamepark/react-components";

type Props = {
    player:PlayerView | PlayerViewSelf | PlayerHuntView
}

const PlayerBoard : FC<Props> = ({player}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()

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

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave player={player} />
            <div css={totemTokenPanelPosition}>

            {[...Array(player.totemTokens)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={totemStyle} draggable={false} />)}

            </div>

            <div css={cardHandPanelPosition}> 
            
                {isPlayerViewSelf(player) ? player.hand.map((card, index) => 
                
                    <Card key={index}
                    css = {[cardPosition(index, player.hand.length), cardStyle]}
                    color={player.color}
                    power={getColoredDeck(player.color)[card].power}
                    speed={getColoredDeck(player.color)[card].speed}
                    draggable={player.isReady !== true}
                    draggableItem={{type:"CardInHand", card:card}}
                    type={"CardInHand"}
                    />
                
                ) : [...Array(player.hand)].map((_, i) => 
                    <Card key={i}
                     css = {[cardPosition(i, player.hand), cardStyle]}
                     color={player.color}   
                    />
                )}

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

                {player.discard.length !== 0 && 
                    <Card color={player.color}
                          power={getColoredDeck(player.color)[player.discard[player.discard.length-1]].power}
                          speed={getColoredDeck(player.color)[player.discard[player.discard.length-1]].speed}
                    />}

            </div>

            <div css={[deckZonePosition, deckZoneStyle(getCardBack(player.color))]}> </div>
            
        </div>

    )
    
}

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
left:0%;
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
width:20%;
height:100%;
`

const cardPlayedPosition = (key:number) => css`
width:70%;
height:55%;
position:absolute;
top:${(key%6)*10}%;
left:${Math.floor(key/6)*30}%;
`

const cardStyle = css`
`

const cardHandPanelPosition = css`
    position:absolute;
    bottom:0%;
    right:20%;
    width:60%;
    height:18%;

    display:flex;
    flex-direction:row;
    justify-content:center;
`

const totemStyle = css`
    height:7em;
    width:7em;
    border-radius:100%;
    margin:1em auto;
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