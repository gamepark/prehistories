/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react";
import {FC, useState} from "react";
import {useTranslation} from "react-i18next";
import Cave from "./Cave";
import Card from './Card'
import {getColoredDeck} from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {isPlayerView, isPlayerViewSelf, PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {useDrop} from "react-dnd";
import CardInHand, {isCardInHand} from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import {useAnimation, useAnimations, usePlay, usePlayerId, useSound} from "@gamepark/react-client";
import {Hand, Picture} from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import {isPlayHuntCardView, PlayHuntCardView} from "@gamepark/prehistories/moves/PlayHuntCard";
import {isRevealHuntCards, RevealHuntCardsView} from "@gamepark/prehistories/moves/RevealHuntCards";
import SpendHunter, {isSpendHunter} from "@gamepark/prehistories/moves/SpendHunter";
import {isShuffleDiscardPile, ShuffleDiscardPileView} from "@gamepark/prehistories/moves/ShuffleDiscardPile";
import DrawCards, {DrawCardsView, isDrawCards, isDrawCardsView} from "@gamepark/prehistories/moves/DrawCards";
import {getCardBack, getPlayerColor} from "../utils/getterFunctions";
import SetSelectedHunters, {setSelectedHunterMove} from "../localMoves/setSelectedHunters";
import MoveCardSound from "../sounds/cardMove.mp3"
import ButtonClickSound from "../sounds/buttonClick.mp3"
import {centerContainer, setPercentDimension, toAbsolute, toFullSize} from "../utils/styles";
import ButtonsTab from "./ButtonsTab";
import TakeBackPlayedCards, {isTakeBackPlayedCards} from "@gamepark/prehistories/moves/TakeBackPlayedCards";
import {playerWillDraw} from "@gamepark/prehistories/Prehistories";
import Tile from "@gamepark/prehistories/material/Tile";
import FocusedCardOptions from "./FocusedCardOptions";

type Props = {
    player:PlayerView | PlayerViewSelf,
    huntPhase?:boolean,
    selectedHunters:number[]|undefined
    isTutorial:boolean
    huntBoard:(Tile|null)[]
    isWinner:boolean
}

const PlayerBoard : FC<Props> = ({player, huntPhase, selectedHunters, isTutorial, huntBoard, isWinner}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.8
    const clickSound = useSound(ButtonClickSound)
    clickSound.volume = 0.8

    const playHuntCardAnimation = useAnimation<PlayHuntCardView>(animation => isPlayHuntCardView(animation.move) && animation.move.player === playerId)
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move) && player.hunting !== undefined)
    const shuffleDiscardAnimation = useAnimation<ShuffleDiscardPileView>(animation => isShuffleDiscardPile(animation.move) && player.hunting !== undefined)
    const drawCardsAnimation = useAnimation<DrawCards|DrawCardsView>(animation => isDrawCards(animation.move) && animation.move.player === player.color)
    const takeBackCardsAnimation = useAnimation<TakeBackPlayedCards>(animation => isTakeBackPlayedCards(animation.move) && player.hunting !== undefined )
    let playerHand:number|number[] = isPlayerViewSelf(player) ? [...player.hand] : player.hand
    let playerPlayed:number[] = player.played
    const [focusedCard, setFocusedCard] = useState<number>()

    if(drawCardsAnimation){
        if (isDrawCardsView(drawCardsAnimation.move) && Array.isArray(playerHand)){
            playerHand.push(...drawCardsAnimation.move.cards)
        } else if (!isDrawCardsView(drawCardsAnimation.move) && typeof playerHand === 'number'){
            playerHand += playerWillDraw(player)
        }
    }
    if(takeBackCardsAnimation){
        if (Array.isArray(playerHand)){
            playerHand.push(...player.played)
            playerPlayed = []
        } else {
            playerHand += player.played.length
            playerPlayed = []
        }
    }

    const isDisplayValidationButton:boolean = !huntPhase && playerId === player.color && player.isReady !== true
    const isDisplayEndTurnButton:boolean = player.hunting !== undefined && !player.hunting.hunt && player.isReady !== true
    const isDisplayHuntingButtons:boolean = player.hunting?.hunt !== undefined

    const playSelectHunter = usePlay<SetSelectedHunters>()

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
                moveCardSound.play()
                return {type:MoveType.PlayHuntCard, card:item.card, playerId:player.color }
            } else {
                return
            }
        }
      })

      const getItemProps = (index: number) => {
        const card:number = player.hand[index]      // if playerView ==> undefined
        return ({
          ignore:isPlayerView(player) ? ((playHuntCardAnimation && index === 0) || (playerCardsInRevealAnimation && index < playerCardsInRevealAnimation.length)) : (revealCardsAnimation && Array.isArray(playerHand) && index >= playerHand.length - player.played.length ),
          hoverStyle: isPlayerViewSelf(player) ? css`transform: translateY(-25%) scale(1.7);` : undefined,
          drag: {
            type: "CardInHand",
            item: {type:"CardInHand", card},
            canDrag: player.color === playerId && !huntPhase,
            drop: () => play({type:MoveType.PlayHuntCard, card:card, player:player.color})
          },
          animation:(revealCardsAnimation) ? {
            seconds:revealCardsAnimation.duration,
            delay:0,
            fromNeutralPosition:false
          } : ( drawCardsAnimation ? {
            seconds:drawCardsAnimation.duration,
            delay:0,
            fromNeutralPosition:(isDrawCardsView(drawCardsAnimation.move) && Array.isArray(playerHand))
                ? index > playerHand.length - drawCardsAnimation.move.cards.length -1
                : !isDrawCardsView(drawCardsAnimation.move) && typeof playerHand ==='number' && index > playerHand - playerWillDraw(player) -1
          } : ( takeBackCardsAnimation  
              ? {seconds:takeBackCardsAnimation.duration,
                 delay:0,
                 fromNeutralPosition: Array.isArray(playerHand)
                    ? index >= playerHand.length - player.played.length 
                    : index >= playerHand - player.played.length
                }
              : undefined)),
              onClick: () => player.color === playerId && setFocusedCard(card)
        })
      }

    const playerCardsInRevealAnimation = revealCardsAnimation ? revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards : undefined
  return (
    <>

      {focusedCard !== undefined &&
      <>
        <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        <Card color={player.color} 
              css={[focusCardStyle]} 
              power={getColoredDeck(player.color)[focusedCard].power}
              speed={getColoredDeck(player.color)[focusedCard].speed} />
        <FocusedCardOptions onClose={() => setFocusedCard(undefined)} />
      </>
      }

      <Cave player={player} isTutorial={isTutorial}/>

      <div css={[toAbsolute, setPercentDimension(93, 56), playerBoardPosition]}>

        <div css={[toAbsolute, setPercentDimension(24, 65), cardHandPanelPosition]}>

                <Hand css={[toAbsolute, handPosition, setPercentDimension(100,25.5)]} rotationOrigin={10} gapMaxAngle={3.8} maxAngle={20} sizeRatio={8/11} getItemProps={getItemProps} >

                    {(isPlayerViewSelf(player) && Array.isArray(playerHand))
                        ? playerHand.map((card, index) =>
                            <Card key={index}
                            color={player.color}
                            css={[smoothAngles,
                                  playHuntCardAnimation && index === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration,player.played.length),
                                  drawCardsAnimation && isDrawCardsView(drawCardsAnimation.move) && drawCardsAnimation.move.cards.find(c => c === card) && drawCardsAnimStyle(drawCardsAnimation.duration, false),
                                  takeBackCardsAnimation && Array.isArray(playerHand) && index >= playerHand.length - player.played.length && takeBackCardsAnimationStyle(index - player.hand.length, takeBackCardsAnimation.duration)
                                ]}
                            power={getColoredDeck(player.color)[card].power}
                            speed={getColoredDeck(player.color)[card].speed}
                            draggable={player.isReady !== true}
                            draggableItem={{type:"CardInHand", card:card}}
                            type={"CardInHand"}
                            />
                    )

                        : typeof playerHand === 'number' && [...Array(playerHand)].map((_, i) =>
                            <Card key={i}
                            css = {[smoothAngles,
                                    playerCardsInRevealAnimation && playerCardsInRevealAnimation.length > i && revealCardsAnimationStyle(i, revealCardsAnimation!.duration) ,
                                    takeBackCardsAnimation && typeof playerHand === 'number' && typeof player.hand === 'number' && i >= playerHand - player.played.length && takeBackCardsAnimationStyle(i - player.hand, takeBackCardsAnimation.duration)
                                ]}
                            color={player.color}
                            power={(playerCardsInRevealAnimation && i < playerCardsInRevealAnimation.length) ? getColoredDeck(player.color)[playerCardsInRevealAnimation[i]].power : (takeBackCardsAnimation && typeof playerHand === 'number' && typeof player.hand === 'number' && i >= playerHand - player.played.length ? getColoredDeck(player.color)[player.played[i-player.hand]].power : undefined)}
                            speed={(playerCardsInRevealAnimation && i < playerCardsInRevealAnimation.length) ? getColoredDeck(player.color)[playerCardsInRevealAnimation[i]].speed : (takeBackCardsAnimation && typeof playerHand === 'number' && typeof player.hand === 'number' && i >= playerHand - player.played.length ? getColoredDeck(player.color)[player.played[i-player.hand]].speed : undefined)}
                            isTakeBackAnimation={takeBackCardsAnimation && typeof playerHand === 'number' && typeof player.hand === 'number' && i >= playerHand - player.played.length}
                            />
                        )
                    }

                </Hand>

            </div>

            <div css={[toAbsolute, setPercentDimension(45,53), cardPlayedPanelPosition(player.color), canDropPlayed && canDropStyle, canDropPlayed && isOverPlayed && isOverStyle]} ref = {dropRefPlayed}>

            {(isDisplayHuntingButtons || isDisplayValidationButton || isDisplayEndTurnButton) && player.color === playerId && !isWinner && 
                <ButtonsTab color={player.color}
                            hunting={player.hunting}
                            isDisplayEndTurnButton={isDisplayEndTurnButton}
                            isDisplayValidationButton={isDisplayValidationButton}
                            selectedHunters={selectedHunters}
                            playedPower={player.played.reduce((pv, cv) => pv + cv,0)}
                            huntBoard={huntBoard}
                />
            }

            <span css={[toAbsolute, centerContainer, spanDropDisplay(canDropPlayed)]}>{t("Drag Here")}</span>

            {playerPlayed.map((card, index) => {
                const spendCardAnimation = spendCardAnimations.find(a => a.move.card === card)
                return <Card key={index}
                css = {[toAbsolute, setPercentDimension(52,30), cardPlayedPosition(index), smoothAngles,
                        spendCardAnimation && index === (playerPlayed as number[]).findIndex(card => card === spendCardAnimation.move.card) && spendAnimation(player.discard.length, spendCardAnimation.duration),
                        selectedHunters?.find(c => c === card) !== undefined && selectedCard
                    ]}
                color={player.color}
                power={getColoredDeck(player.color)[card].power}
                speed={getColoredDeck(player.color)[card].speed}
                onClick={() => player.color === playerId && player.hunting?.hunt !== undefined && playSelectHunter(setSelectedHunterMove(card), {local:true})}

                />

           })}

        </div>

            <div css={[toAbsolute, setPercentDimension(23,16), discardZonePosition]}>

                {player.discard.map((card, index) =>
                    <Card key={index}
                          color={player.color}
                          power={getColoredDeck(player.color)[card].power}
                          speed={getColoredDeck(player.color)[card].speed}
                          css={[toAbsolute, deckOffset(index), smoothAngles, shuffleDiscardAnimation && shufflingAnimation(index, shuffleDiscardAnimation.duration, player.discard.length)]}
                    />)}

            </div>

            <div css={[toAbsolute, setPercentDimension(24,16), deckZonePosition]}>

                {[...Array(player.deck - (drawCardsAnimation ? ((isDrawCardsView(drawCardsAnimation.move) && player.color === playerId) ? drawCardsAnimation.move.cards.length : 0) : 0))].map((_, i) => <Picture key={i} alt={t('token')} src={getCardBack(player.color)} css={[toAbsolute, smoothAngles, deckOffset(i), toFullSize, deckCardShadow]} draggable={false} />)}

            </div>

        </div>

    </>
  )

}

const focusCardStyle = css`
  position: absolute;
  width: ${26}%;
  height: ${63}%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;

  h3 {
    font-size: 2.55em;
  }
`

export const popupBackgroundStyle = css`
  position: fixed;
  top: -100%;
  bottom: -100%;
  left: -100%;
  right: -100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
`

const takeBackCardsKeyframes = (index:number) => keyframes`
from{transform:translate(${38+Math.floor(index/3)*68.5 }%,${-195+(index%3)*43.5}%) scale(0.94);}
to{}
`

const takeBackCardsAnimationStyle = (index:number, duration:number) => css`
animation: ${takeBackCardsKeyframes(index)} ${duration}s ease-in-out;
`

const revealCardsKeyframes = (index:number) => keyframes`
from{}
to{transform:translate(${38+Math.floor(index/3)*68.5 }%,${-195+(index%3)*43.5}%) scale(0.94);}
`

const revealCardsAnimationStyle = (index:number, duration:number) => css`
    animation: ${revealCardsKeyframes(index)} ${duration}s ease-in-out;
`

const drawHuntCardKeyframes = (isHidden:boolean) => keyframes`
    from{transform:translate(-230%,-7%) rotateY(${isHidden ? 0 : -180}deg);}
    50%{transform:translate(-230%,-7%) rotateY(${isHidden ? 0 : -180}deg);}
    to{}
`

const drawCardsAnimStyle = (duration:number, isHidden:boolean) => css`
    transform-style:preserve-3d;
    animation:${drawHuntCardKeyframes(isHidden)} ${duration}s ease-in-out forwards;
`

const selectedCard = css`
    box-shadow:0 0 1em 0.2em lime;
    transform-origin:bottom left;
    transform:rotateZ(-20deg);
`

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

const spendHunterKeyFrames = (discardLength:number) => keyframes`
    to{
        transform:rotateZ(0) scale(1.02);
        top:${108-discardLength*0.5}%;
        left:${71+discardLength*0.5}%;
    }
`

const spendAnimation = (discardLength:number, duration:number) => css`
    animation: ${spendHunterKeyFrames(discardLength)} ${duration}s ease-in forwards;
`

const playHuntCardKeyframes = (lengthPlayed:number) => keyframes`
    from{}
    to{transform:translate(${38+Math.floor(lengthPlayed/3)*68.5 }%,${-195+(lengthPlayed%3)*43.5}%) scale(0.94);}
`

const playHuntCardAnimationStyle = (duration:number, lengthPlayed:number) => css`
    animation:${playHuntCardKeyframes(lengthPlayed)} ${duration}s linear;
`

const deckCardShadow = css`
    box-shadow:0 0 0.5em black;
`

const deckOffset = (index:number) => css`
    top:${-index}%;
    left:${index}%;
`

const handPosition = css`
    top:0;
    left:40%;
`

const spanDropDisplay = (canDrop:boolean) => css`
    ${canDrop ? `display:block;` : `display:none;`}
    font-size:4em;
    text-align:center;
`

const canDropStyle = css`
    background-color:rgba(131, 180, 65,0.5);
    transition:all 0.2s linear;
`

const isOverStyle = css`
    background-color:rgba(131, 180, 65,0.8);
`

const cardPlayedPanelPosition = (color:PlayerColor) => css`
    top:28%;
    left:46%;
    z-index:1;
    background-color:rgba(131, 180, 65,0.1);
    border:solid 0.6em ${getPlayerColor(color)};
    border-radius:2em;
`

const deckZonePosition = css`
    bottom:1%;
    left:2%;
`

const discardZonePosition = css`
    bottom:1%;
    right:1%;
    transform-style: preserve-3d;
    transform: perspective(200em);
    z-index:0;
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

const cardHandPanelPosition = css`
    bottom:1%;
    right:20%;
    z-index:2;
`

const playerBoardPosition = css`
    top:7%;
    left:24%;
    pointer-events: none; // TODO: remove this div
    
    & > * {
      pointer-events: auto;
    }
`

export default PlayerBoard