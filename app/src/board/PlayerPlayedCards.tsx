/** @jsxImportSource @emotion/react */

import { css, keyframes } from "@emotion/react";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import CardInHand from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import { PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { useAnimation, useAnimations, useNumberOfPlayers, usePlay, usePlayerId, useSound } from "@gamepark/react-client";
import { FC } from "react";
import { useDrop } from "react-dnd";
import { useTranslation } from "react-i18next";
import { getPlayerColor } from "../utils/getterFunctions";
import { centerContainer, glowingCardAnimation, setPercentDimension, toAbsolute } from "../utils/styles";
import ButtonsTab from "./ButtonsTab";
import MoveCardSound from "../sounds/cardMove.mp3"
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import Tile from "@gamepark/prehistories/material/Tile";
import TakeBackPlayedCards, { isTakeBackPlayedCards } from "@gamepark/prehistories/moves/TakeBackPlayedCards";
import SpendHunter, { isSpendHunter } from "@gamepark/prehistories/moves/SpendHunter";
import Card from './Card';
import SetSelectedHunters, { setSelectedHunterMove } from "../localMoves/setSelectedHunters";
import getBoardZones from "@gamepark/prehistories/material/BoardZones";


type Props = {
    player:PlayerView|PlayerViewSelf
    huntPhase?:boolean
    huntBoard:(Tile|null)[]
    selectedHunters:number[]|undefined
    isWinner:boolean
}

const PlayerPlayedCards : FC<Props> = ({player, huntPhase, huntBoard, selectedHunters, isWinner}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.8
    const nbPlayers = useNumberOfPlayers()
    const playSelectHunter = usePlay<SetSelectedHunters>()

    const isDisplayValidationButton:boolean = !huntPhase && playerId === player.color && player.isReady !== true
    const isDisplayEndTurnButton:boolean = player.hunting !== undefined && !player.hunting.hunt && player.isReady !== true

    const takeBackCardsAnimation = useAnimation<TakeBackPlayedCards>(animation => isTakeBackPlayedCards(animation.move) && player.hunting !== undefined )
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move) && player.hunting !== undefined)

    const isDisplayHuntingButtons:boolean = player.hunting?.hunt !== undefined
    
    function canDragUnselectedHunter(card:number):boolean{
        if(selectedHunters === undefined){
            return true
        } else if (player.hunting === undefined || player.hunting.hunt === undefined){
            return false
        } else {
            return getBoardZones(nbPlayers)[player.hunting.hunt.zone].safe > selectedHunters.reduce((acc, cv) => acc + getColoredDeck(player.color)[cv].power, player.hunting.hunt.huntersValue)
        }
    }

    const [{canDropPlayed, isOverPlayed}, dropRefPlayed] = useDrop({
        accept: "CardInHand",
        collect: monitor => ({
          canDropPlayed: monitor.canDrop(),
          isOverPlayed: monitor.isOver()
        }),
        drop: (item: CardInHand | CardPlayed) => {
            moveCardSound.play()
            return {type:MoveType.PlayHuntCard, card:item.card, playerId:player.color }
        }
      })

    let playerPlayed:number[] = player.played
    if(takeBackCardsAnimation){
        playerPlayed = []
    }

    return(

        <div css={[toAbsolute, setPercentDimension(45,53), cardPlayedPanelPosition(player.color), canDropPlayed && canDropStyle, canDropPlayed && isOverPlayed && isOverStyle]} ref = {dropRefPlayed}>

        {(isDisplayHuntingButtons || isDisplayValidationButton || isDisplayEndTurnButton) && player.color === playerId && !isWinner &&
            <ButtonsTab color={player.color}
                        hunting={player.hunting}
                        isDisplayEndTurnButton={isDisplayEndTurnButton}
                        isDisplayValidationButton={isDisplayValidationButton}
                        selectedHunters={selectedHunters}
                        playedPower={player.played.reduce((pv, cv) => getColoredDeck(player.color)[pv].power + getColoredDeck(player.color)[cv].power,0)}
                        huntBoard={huntBoard}
            />
        }

        <span css={[toAbsolute, centerContainer, spanDropDisplay(canDropPlayed)]}>{t("Drag Here")}</span>

        {playerPlayed.map((card, index) => {
            const spendCardAnimation = spendCardAnimations.find(a => a.move.card === card)
            return <Card key={index}
            css = {[toAbsolute, setPercentDimension(52,30), cardPlayedPosition(index),
                    smoothAngles,
                    huntPhase === true && player.hunting?.hunt !== undefined && !selectedHunters?.includes(card) && glowingCardAnimation,
                    spendCardAnimation && index === (playerPlayed as number[]).findIndex(card => card === spendCardAnimation.move.card) && spendAnimation(player.discard.length, spendCardAnimation.duration),
                    selectedHunters?.find(c => c === card) !== undefined && selectedCard
                ]}
            color={player.color}
            power={getColoredDeck(player.color)[card].power}
            speed={getColoredDeck(player.color)[card].speed}
            draggable={player.color === playerId && player.hunting?.hunt !== undefined && player.isReady !== true && (selectedHunters?.find(c => card === c) !== undefined ? true : canDragUnselectedHunter(card))}
            draggableItem={{type:"CardPlayed", card:card}}
            type={"CardPlayed"}
            selectedHunters={selectedHunters}
            onClick={() => player.color === playerId && player.hunting?.hunt !== undefined && playSelectHunter(setSelectedHunterMove(card), {local:true})}

            />

        })}

        </div>

    )

}

const spendHunterKeyFrames = (discardLength:number) => keyframes`
    to{
        transform:rotateZ(0) scale(1.02);
        top:${108-discardLength*0.5}%;
        left:${71+discardLength*0.5}%;
    }
`

const spendAnimation = (discardLength:number, duration:number) => css`
    animation: ${spendHunterKeyFrames(discardLength)} ${duration}s ease-in-out forwards;
`


const canDropStyle = css`
    background-color:rgba(131, 180, 65,0.5);
    transition:all 0.2s linear;
`

const isOverStyle = css`
    background-color:rgba(131, 180, 65,0.8);
    transition:all 0.2s linear;
`

const cardPlayedPanelPosition = (color:PlayerColor) => css`
    top:28%;
    left:46%;
    z-index:1;
    background-color:rgba(131, 180, 65,0.1);
    border:solid 0.6em ${getPlayerColor(color)};
    border-radius:2em;
`

const spanDropDisplay = (canDrop:boolean) => css`
    ${canDrop ? `display:block;` : `display:none;`}
    font-size:4em;
    text-align:center;
`

const cardPlayedPosition = (key:number) => css`
    top:${(key%3)*24}%;
    left:${2+Math.floor(key/3)*22}%;
    transform-origin:bottom left;
    cursor:pointer;
`

const smoothAngles = css`
    border-radius:8%;
`

const selectedCard = css`
    box-shadow:0 0 2em gold, 0 0 2em gold, 0 0 2em gold, 0 0 2em gold;
    transform-origin:bottom left;
    transform:rotateZ(-20deg);
`

export default PlayerPlayedCards