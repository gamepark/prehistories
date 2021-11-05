/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Cave from "./Cave";
import Card from './Card'
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { isPlayerViewSelf, PlayerHuntView, PlayerView, isPlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import { useDrop } from "react-dnd";
import CardInHand, {isCardInHand} from "@gamepark/prehistories/types/appTypes/CardInHand";
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import { useAnimation, useAnimations, usePlay, usePlayerId, useSound } from "@gamepark/react-client";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { Hand, Picture } from "@gamepark/react-components";
import Move from "@gamepark/prehistories/moves/Move";
import { isPlayHuntCard, PlayHuntCardView } from "@gamepark/prehistories/moves/PlayHuntCard";
import { RevealHuntCardsView, isRevealHuntCards } from "@gamepark/prehistories/moves/RevealHuntCards";
import SpendHunter, { isSpendHunter } from "@gamepark/prehistories/moves/SpendHunter";
import { isShuffleDiscardPile, ShuffleDiscardPileView } from "@gamepark/prehistories/moves/ShuffleDiscardPile";
import DrawXCards, { DrawXCardsView, isDrawXCards, isDrawXCardsView } from "@gamepark/prehistories/moves/DrawXCards";
import { getCardBack, getPlayerColor } from "../utils/getterFunctions";
import SetSelectedHunters, { setSelectedHunterMove } from "../localMoves/setSelectedHunters";
import MoveCardSound from "../sounds/cardMove.mp3"
import ButtonClickSound from "../sounds/buttonClick.mp3"
import { centerContainer, setPercentDimension, toAbsolute, toFullSize } from "../utils/styles";
import ButtonsTab from "./ButtonsTab";

type Props = {
    player:PlayerView | PlayerViewSelf | PlayerHuntView,
    phase:Phase | undefined,
    players:(PlayerView | PlayerViewSelf | PlayerHuntView)[]
    isActiveHuntingPlayer:boolean
    goals:number[]
    selectedHunters:number[]|undefined
    caveDisplayed:PlayerColor
}

const PlayerBoard : FC<Props> = ({player, phase, selectedHunters, caveDisplayed}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.5
    const clickSound = useSound(ButtonClickSound)
    clickSound.volume = 0.5

    const playHuntCardAnimation = useAnimation<PlayHuntCardView>(animation => isPlayHuntCard(animation.move))
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const spendCardAnimations = useAnimations<SpendHunter>(animation => isSpendHunter(animation.move))
    const shuffleDiscardAnimation = useAnimation<ShuffleDiscardPileView>(animation => isShuffleDiscardPile(animation.move))
    const drawXCardsAnimation = useAnimation<DrawXCards|DrawXCardsView>(animation => isDrawXCards(animation.move))
    let playerHand:number|number[] = isPlayerViewSelf(player) ? [...player.hand] : player.hand

    if(drawXCardsAnimation){
        if(!isDrawXCardsView(drawXCardsAnimation.move) && Array.isArray(playerHand)){
            playerHand.push(...drawXCardsAnimation.move.cards)
        } else if(isDrawXCardsView(drawXCardsAnimation.move) && typeof playerHand === 'number'){
            playerHand +=drawXCardsAnimation.move.cards
        }
    }

    const isDisplayValidationButton:boolean = phase === Phase.Initiative && playerId === player.color && player.isReady !== true
    const isDisplayEndTurnButton:boolean = phase === Phase.Hunt && playerId === player.color && player.hunting?.huntPhase === HuntPhase.Hunt
    const isDisplayHuntingButtons:boolean = phase === Phase.Hunt && playerId === player.color && player.hunting?.huntPhase === HuntPhase.Pay

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
            fromNeutralPosition:(!isDrawXCardsView(drawXCardsAnimation.move) && Array.isArray(playerHand)) 
                ? index > playerHand.length - drawXCardsAnimation.move.cards.length -1
                : isDrawXCardsView(drawXCardsAnimation.move) && typeof playerHand ==='number' && index > playerHand - drawXCardsAnimation.move.cards -1
          } : undefined)
        })
      }

    return(

        <div css={[toAbsolute, setPercentDimension(93,56), playerBoardPosition]}>

            <Cave player={player} />

            <div css={[toAbsolute, setPercentDimension(24,65), cardHandPanelPosition]}> 

                <Hand css={[toAbsolute, handPosition, setPercentDimension(100,25.5)]} rotationOrigin={10} gapMaxAngle={3.8} maxAngle={20} sizeRatio={8/11} getItemProps={getItemProps} >
            
                    {(isPlayerViewSelf(player) && Array.isArray(playerHand))
                        ? playerHand.map((card, index) => 
                            <Card key={index}
                            color={player.color}
                            css={[smoothAngles, 
                                  playHuntCardAnimation && index === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration,player.played.length),
                                  drawXCardsAnimation && !isDrawXCardsView(drawXCardsAnimation.move) && drawXCardsAnimation.move.cards.find(c => c === card) && drawXCardsAnimStyle(drawXCardsAnimation.duration, false)]}
                            power={getColoredDeck(player.color)[card].power}
                            speed={getColoredDeck(player.color)[card].speed}
                            draggable={player.isReady !== true}
                            draggableItem={{type:"CardInHand", card:card}}
                            type={"CardInHand"}
                            />
                    )

                        : typeof playerHand === 'number' && [...Array(playerHand)].map((_, i) => 
                            <Card key={i}
                            css = {[smoothAngles,playHuntCardAnimation && i === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration, (player.played as number)), drawXCardsAnimation && isDrawXCardsView(drawXCardsAnimation.move) && i >= (playerHand as number) - drawXCardsAnimation.move.cards && drawXCardsAnimStyle(drawXCardsAnimation.duration, true) ]}
                            color={player.color}   
                            />
                        )
                    }

                </Hand>

            </div>

            <div css={[toAbsolute, setPercentDimension(45,53), cardPlayedPanelPosition(player.color), canDropPlayed && canDropStyle, canDropPlayed && isOverPlayed && isOverStyle]} ref = {dropRefPlayed}> 

            {(isDisplayHuntingButtons || isDisplayValidationButton || isDisplayEndTurnButton) && 
                <ButtonsTab color={player.color}
                            hunting={player.hunting}
                            isDisplayEndTurnButton={isDisplayEndTurnButton}
                            isDisplayHuntingButtons={isDisplayHuntingButtons}
                            isDisplayValidationButton={isDisplayValidationButton}
                            selectedHunters={selectedHunters}
                />
            }

            <span css={[toAbsolute, centerContainer, spanDropDisplay(canDropPlayed)]}>{t("Drag Here")}</span>
            
            {Array.isArray(player.played) ? player.played.map((card, index) => {
                const spendCardAnimation = spendCardAnimations.find(a => a.move.card === card)
                return <Card key={index}
                css = {[toAbsolute, setPercentDimension(52,30), cardPlayedPosition(index), smoothAngles,
                        spendCardAnimation && index === (player.played as number[]).findIndex(card => card === spendCardAnimation.move.card) && spendAnimation(player.discard.length, spendCardAnimation.duration),
                        selectedHunters?.find(c => c === card) !== undefined && selectedCard
                    ]}
                color={player.color}
                power={getColoredDeck(player.color)[card].power}
                speed={getColoredDeck(player.color)[card].speed}
                onClick={() => player.color === playerId && player.hunting?.huntPhase === HuntPhase.Pay && playSelectHunter(setSelectedHunterMove(card), {local:true})}
                
                />
            
           } ) : [...Array(player.played)].map((_, i) => 
                <Card key={i}
                 css = {[toAbsolute, setPercentDimension(52,30), cardPlayedPosition(i), smoothAngles]}
                 color={player.color}   
                 power={revealCardsAnimation ? getColoredDeck(player.color)[revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards[i]].power : undefined}
                 speed={revealCardsAnimation ? getColoredDeck(player.color)[revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards[i]].speed : undefined}
                />
            )}

        </div>

            <div css={[toAbsolute, setPercentDimension(23,16), discardZonePosition]}>

                {player.discard.map((card, index) =>  
                    <Card key={index}
                          color={player.color}
                          power={getColoredDeck(player.color)[card].power}
                          speed={getColoredDeck(player.color)[card].speed}
                          css={[toAbsolute, deckOffset(index), smoothAngles, shuffleDiscardAnimation && player.color === caveDisplayed && shufflingAnimation(index, shuffleDiscardAnimation.duration, player.discard.length)]}
                    />)}

            </div>

            <div css={[toAbsolute, setPercentDimension(24,16), deckZonePosition]}> 
            
                {[...Array(player.deck - (drawXCardsAnimation ? ((!isDrawXCardsView(drawXCardsAnimation.move) && player.color === playerId) ? drawXCardsAnimation.move.cards.length : 0) : 0))].map((_, i) => <Picture key={i} alt={t('token')} src={getCardBack(player.color)} css={[toAbsolute, smoothAngles, deckOffset(i), toFullSize, deckCardShadow]} draggable={false} />)}
            
            </div>
            
        </div>

    )
    
}

const drawHuntCardKeyframes = (isHidden:boolean) => keyframes`
    from{transform:translate(-230%,-7%) rotateY(${isHidden ? 0 : -180}deg);}
    50%{transform:translate(-230%,-7%) rotateY(${isHidden ? 0 : -180}deg);}
    to{}
`

const drawXCardsAnimStyle = (duration:number, isHidden:boolean) => css`
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
    top:${-index*1}%;
    left:${index*1}%;
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
    z-index:1;
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
`

export default PlayerBoard