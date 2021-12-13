/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {FC, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Cave from "./Cave";
import Card from './Card'
import {getColoredDeck} from "@gamepark/prehistories/material/Hunters";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView";
import {useAnimation, usePlayerId, useSound} from "@gamepark/react-client";
import {Picture} from "@gamepark/react-components";
import DrawCards, {DrawCardsView, isDrawCards, isDrawCardsView} from "@gamepark/prehistories/moves/DrawCards";
import {getCardBack} from "../utils/getterFunctions";
import MoveCardSound from "../sounds/cardMove.mp3"
import {setPercentDimension, toAbsolute, toFullSize} from "../utils/styles";
import Tile from "@gamepark/prehistories/material/Tile";
import FocusedCardOptions from "./FocusedCardOptions";
import PlayerHand from "./PlayerHand";
import PlayerPlayedCards from "./PlayerPlayedCards";
import PlayerDiscard from "./PlayerDiscard";

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
    const moveCardSound = useSound(MoveCardSound)
    moveCardSound.volume = 0.8
    const drawCardsAnimation = useAnimation<DrawCards|DrawCardsView>(animation => isDrawCards(animation.move) && animation.move.player === player.color)
    const [focusedCard, setFocusedCard] = useState<number>()

    // drawCardsAnimation is not applied immediately: we force react to "redraw" once before applying it to prevent the cards taken back
    // inside takeBackCardsAnimation to "jump" instead of moving smoothly during the drawCardsAnimation
    const [temporizeDrawCards, setTemporizeDrawCards] = useState(true)
    useEffect(() => {
        setTemporizeDrawCards(!drawCardsAnimation)
    }, [drawCardsAnimation])

    return (
    <>

      {focusedCard !== undefined &&
      <>
        <div css={popupBackgroundStyle} onClick={() => setFocusedCard(undefined)}/>
        <Card color={player.color}
              css={[focusCardStyle]}
              power={getColoredDeck(player.color)[focusedCard].power}
              speed={getColoredDeck(player.color)[focusedCard].speed} />
        <FocusedCardOptions onClose={() => setFocusedCard(undefined)} card={focusedCard} playerColor={playerId} />
      </>
      }

      <Cave player={player} isTutorial={isTutorial}/>

        <div css={[toAbsolute, setPercentDimension(93, 56), playerBoardPosition]}>

            <PlayerHand player={player} setFocusedCard={setFocusedCard} huntPhase={huntPhase} />

            <PlayerPlayedCards player={player} huntBoard={huntBoard} isWinner={isWinner} selectedHunters={selectedHunters} huntPhase={huntPhase} />

            <PlayerDiscard player={player} />

            <div css={[toAbsolute, setPercentDimension(24,16), deckZonePosition]}>
                {[...Array(player.deck - (drawCardsAnimation && !temporizeDrawCards ? ((isDrawCardsView(drawCardsAnimation.move) && player.color === playerId) ? drawCardsAnimation.move.cards.length : 0) : 0))].map((_, i) => <Picture key={i} alt={t('token')} src={getCardBack(player.color)} css={[toAbsolute, smoothAngles, deckOffset(i), toFullSize, deckCardShadow]} draggable={false} />)}
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

const deckCardShadow = css`
    box-shadow:0 0 0.5em black;
`

const deckOffset = (index:number) => css`
    top:${-index}%;
    left:${index}%;
`

const deckZonePosition = css`
    bottom:1%;
    left:2%;
`

const smoothAngles = css`
    border-radius:8%;
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