/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import PlayerState from "@gamepark/prehistories/PlayerState";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Cave from "./Cave";
import { getTotem } from "./PlayerPanel";
import Card from './Card'
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Images from "../utils/Images";

type Props = {
    player:PlayerState
}

const PlayerBoard : FC<Props> = ({player}) => {

    const {t} = useTranslation()

    return(

        <div css={[playerBoardPosition, playerBoardStyle]}>

            <Cave player={player} />
            <div css={totemTokenPanelPosition}>

            {[...Array(player.totemTokens)].map((e, i) => <img key={i} alt={t('token')} src={getTotem(player.color)} css={totemStyle} draggable={false} />)}

            </div>

            <div css={cardHandPanelPosition}> 
            
                {player.hand.map((card, index) => 
                
                    <Card key={index}
                    css = {[cardPosition(index, player.hand.length), cardStyle]}
                    color={player.color}
                    power={getColoredDeck(player.color)[card].power}
                    speed={getColoredDeck(player.color)[card].speed}
                    />
                
                )}

            </div>

            <div css={[discardZonePosition, discardZoneStyle]}>

                {player.discard.length !== 0 && 
                    <Card color={player.color}
                          power={getColoredDeck(player.color)[player.discard[player.discard.length]].power}
                          speed={getColoredDeck(player.color)[player.discard[player.discard.length]].speed}
                    />}

            </div>

            <div css={[deckZonePosition, deckZoneStyle(getCardBack(player.color))]}> </div>
            
        </div>

    )
    
}

const deckZonePosition = css`
position:absolute;
bottom:0%;
left:0%;
width:12%;
height:18%;
`
const deckZoneStyle = (image:string) => css`
border:0.5em white dashed;

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
border:0.5em white dashed;
`

const cardPosition = (position:number, handLength:number) => css`
width:20%;
height:100%;
`

const cardStyle = css`
border: 1px solid yellow;
`

const cardHandPanelPosition = css`
    position:absolute;
    bottom:0%;
    right:20%;
    width:60%;
    height:18%;
    border:1px red solid;

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
border:0.1em solid black;
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