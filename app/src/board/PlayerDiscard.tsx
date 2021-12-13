/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { isShuffleDiscardPile, ShuffleDiscardPileView } from "@gamepark/prehistories/moves/ShuffleDiscardPile";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import { PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { useAnimation } from "@gamepark/react-client";
import { FC } from "react"
import { useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import { centerContainer, setPercentDimension, toAbsolute } from "../utils/styles";
import Card from './Card';

type Props = {
    player:PlayerView|PlayerViewSelf
}

const PlayerDiscard : FC<Props> = ({player}) => {

    const {t} = useTranslation()
    const shuffleDiscardAnimation = useAnimation<ShuffleDiscardPileView>(animation => isShuffleDiscardPile(animation.move) && player.hunting !== undefined)

    const [{canDropDiscard, isOverDiscard}, dropRefDiscard] = useDrop({
        accept: ['CardPlayed'],
        canDrop: (item: CardPlayed) => {
            return player.hunting?.hunt !== undefined
        },
        collect: monitor => ({
          canDropDiscard: monitor.canDrop(),
          isOverDiscard: monitor.isOver()
        }),
        drop: (item: CardPlayed) => {
            return {type:MoveType.SpendHunter, card:item.card}
        }
      })

    return(

        <>

        <div css={[toAbsolute, setPercentDimension(23,16), discardZonePosition]}>

            {player.discard.map((card, index) =>
                <Card key={index}
                    color={player.color}
                    power={getColoredDeck(player.color)[card].power}
                    speed={getColoredDeck(player.color)[card].speed}
                    css={[toAbsolute, deckOffset(index), smoothAngles, shuffleDiscardAnimation && shufflingAnimation(index, shuffleDiscardAnimation.duration, player.discard.length)]}
                />
            )}

        </div>

        {canDropDiscard && <div css={[toAbsolute, setPercentDimension(23,16), discardZonePosition, canDropDiscard && canDropDiscardStyle, canDropDiscard && isOverDiscard && isOverDiscardStyle]} ref = {dropRefDiscard} >
        <span css={[toAbsolute, centerContainer, spanDropDisplay(canDropDiscard)]}>{t("Drag Here")}</span>
        </div>}

        </>
        
    )

}

const shufflingKeyFrames = (index:number) => keyframes`
    from{}
    50%,to{
        transform:rotateY(-180deg) ;
        left:${-500-index}%;  
    }
`

const shufflingAnimation = (index:number, duration:number, discardLength:number) => css`
    animation:${shufflingKeyFrames(discardLength - index)} ${duration-0.2}s linear ${(discardLength - index)/60}s forwards;
`

const deckOffset = (index:number) => css`
    top:${-index}%;
    left:${index}%;
`

const discardZonePosition = css`
    bottom:1%;
    right:1%;
    transform-style: preserve-3d;
    transform: perspective(200em);
    z-index:0;
`

const smoothAngles = css`
    border-radius:8%;
`

const spanDropDisplay = (canDrop:boolean) => css`
    ${canDrop ? `display:block;` : `display:none;`}
    font-size:4em;
    text-align:center;
`

const canDropDiscardStyle = css`
    background-color:rgba(131, 180, 65,0.8);
    border: 0.5em solid white;
    border-radius:8%;
    transition:all 0.2s linear;
`

const isOverDiscardStyle = css`
    background-color:rgba(131, 180, 65, 1);
    border: 0.4em solid white;
    border-radius:8%;
    transition:all 0.2s linear;
`


export default PlayerDiscard