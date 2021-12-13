/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react"
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters"
import DrawCards, { DrawCardsView, isDrawCards, isDrawCardsView } from "@gamepark/prehistories/moves/DrawCards"
import Move from "@gamepark/prehistories/moves/Move"
import MoveType from "@gamepark/prehistories/moves/MoveType"
import { isPlayHuntCardView, PlayHuntCardView } from "@gamepark/prehistories/moves/PlayHuntCard"
import { isRevealHuntCards, RevealHuntCardsView } from "@gamepark/prehistories/moves/RevealHuntCards"
import TakeBackPlayedCards, { isTakeBackPlayedCards } from "@gamepark/prehistories/moves/TakeBackPlayedCards"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import { playerWillDraw } from "@gamepark/prehistories/Prehistories"
import { isPlayerView, isPlayerViewSelf, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { useAnimation, usePlay, usePlayerId } from "@gamepark/react-client"
import { Hand } from "@gamepark/react-components"
import { FC, useEffect, useState } from "react"
import { glowingCardAnimation, setPercentDimension, toAbsolute } from "../utils/styles"
import Card from './Card';

type Props = {
    player:PlayerView|PlayerViewSelf,
    huntPhase?:boolean,
    setFocusedCard:(card:number) => void,
}

const PlayerHand : FC<Props> = ({player, huntPhase, setFocusedCard}) => {

    let playerHand:number|number[] = isPlayerViewSelf(player) ? [...player.hand] : player.hand
    const playerId = usePlayerId<PlayerColor>()
    const play = usePlay<Move>()

    
    const drawCardsAnimation = useAnimation<DrawCards|DrawCardsView>(animation => isDrawCards(animation.move) && animation.move.player === player.color)
    const takeBackCardsAnimation = useAnimation<TakeBackPlayedCards>(animation => isTakeBackPlayedCards(animation.move) && player.hunting !== undefined )
    const playHuntCardAnimation = useAnimation<PlayHuntCardView>(animation => isPlayHuntCardView(animation.move) && animation.move.player === playerId)
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))

    const playerCardsInRevealAnimation = revealCardsAnimation ? revealCardsAnimation.move.cardsPlayed.find(obj => obj.color === player.color)!.cards : undefined

    const [temporizeDrawCards, setTemporizeDrawCards] = useState(true)
    useEffect(() => {
        setTemporizeDrawCards(!drawCardsAnimation)
    }, [drawCardsAnimation])

    if(drawCardsAnimation && !temporizeDrawCards){
        if (isDrawCardsView(drawCardsAnimation.move) && Array.isArray(playerHand)){
            playerHand.push(...drawCardsAnimation.move.cards)
        } else if (!isDrawCardsView(drawCardsAnimation.move) && typeof playerHand === 'number'){
            playerHand += playerWillDraw(player)
        }
    }
    if(takeBackCardsAnimation){
        if (Array.isArray(playerHand)){
            playerHand.push(...player.played)
        } else {
            playerHand += player.played.length
        }
    }

    const getItemProps = (index: number) => {
        const card:number = player.hand[index]      // if playerView ==> undefined
        return ({
          ignore:isPlayerView(player) ? ((playHuntCardAnimation && index === 0) || (playerCardsInRevealAnimation && index < playerCardsInRevealAnimation.length)) : (revealCardsAnimation && Array.isArray(playerHand) && index >= playerHand.length - player.played.length ),
          hoverStyle: isPlayerViewSelf(player) ? css`transform: translateY(-25%) scale(1.7);` : undefined,
          drag: {
            type: "CardInHand",
            item: {card},
            canDrag: player.color === playerId && !huntPhase && player.isReady !== true,
            drop: () => play({type:MoveType.PlayHuntCard, card:card, player:player.color})
          },
          animation:(revealCardsAnimation) ? {
            seconds:revealCardsAnimation.duration,
            delay:0,
            fromNeutralPosition:false
          } : ( drawCardsAnimation && !temporizeDrawCards ? {
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

    return(

        <div css={[toAbsolute, setPercentDimension(24, 65), cardHandPanelPosition]}>

                <Hand css={[toAbsolute, handPosition, setPercentDimension(100,25.5)]} rotationOrigin={10} gapMaxAngle={3.8} maxAngle={20} sizeRatio={8/11} getItemProps={getItemProps} >

                    {(isPlayerViewSelf(player) && Array.isArray(playerHand))
                        ? playerHand.map((card, index) =>
                            <Card key={card}
                            color={player.color}
                            css={[smoothAngles,
                                  huntPhase === false && player.isReady !== true && glowingCardAnimation,
                                  playHuntCardAnimation && index === 0 && playHuntCardAnimationStyle(playHuntCardAnimation.duration,player.played.length),
                                  drawCardsAnimation && !temporizeDrawCards && isDrawCardsView(drawCardsAnimation.move) && drawCardsAnimation.move.cards.find(c => c === card) && drawCardsAnimStyle(drawCardsAnimation.duration, false),
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

    )

}

const smoothAngles = css`
    border-radius:8%;
`

const cardHandPanelPosition = css`
    bottom:1%;
    right:20%;
    z-index:2;
`

const handPosition = css`
    top:0;
    left:40%;
`

const playHuntCardKeyframes = (lengthPlayed:number) => keyframes`
    from{}
    to{transform:translate(${38+Math.floor(lengthPlayed/3)*68.5 }%,${-195+(lengthPlayed%3)*43.5}%) scale(0.94);}
`

const playHuntCardAnimationStyle = (duration:number, lengthPlayed:number) => css`
    animation:${playHuntCardKeyframes(lengthPlayed)} ${duration}s linear;
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

export default PlayerHand