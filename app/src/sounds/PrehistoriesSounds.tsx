import ResolvePermanentObjectives, { isResolvePermanentObjectives } from "@gamepark/prehistories/moves/CheckPermanentObjectives"
import ResolveVariableObjectives, { isResolveVariableObjectives } from "@gamepark/prehistories/moves/CheckVariableObjectives"
import DrawXCards, { isDrawXCards } from "@gamepark/prehistories/moves/DrawXCards"
import PlayPolyomino, { isPlayPolyomino } from "@gamepark/prehistories/moves/PlayPolyomino"
import { isRevealHuntCards, RevealHuntCardsView } from "@gamepark/prehistories/moves/RevealHuntCards"
import { useAnimation } from "@gamepark/react-client"
import { FC, useEffect } from "react"
import { AudioLoader } from "./AudioLoader"
import buttonClick from './buttonClick.mp3'
import cardFlipSound from "./cardFlip.mp3";
import cardMoveSound from "./cardMove.mp3";
import moveTileSound from "./moveTile.mp3";
import permObjectiveSound from "./permObjective.mp3";
import varObjectiveSound from "./varObjective.mp3";
import playerTurnSound from "./playerTurn.mp3";
import PlayHuntCard, { isPlayHuntCard } from "@gamepark/prehistories/moves/PlayHuntCard"



type Props = {
    audioLoader: AudioLoader
}

const PrehistoriesSounds : FC<Props> = ({audioLoader}) => {

    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawXCards>(animation => isDrawXCards(animation.move))
    const playTile = useAnimation<PlayPolyomino>(animation => isPlayPolyomino(animation.move))
    const permObjective = useAnimation<ResolvePermanentObjectives>(animation => isResolvePermanentObjectives(animation.move))
    const varObjective = useAnimation<ResolveVariableObjectives>(animation => isResolveVariableObjectives(animation.move))
    const playCard = useAnimation<PlayHuntCard>(animation => isPlayHuntCard(animation.move))

    useEffect(() => {
        if (revealCardsAnimation || drawCards) {
          audioLoader.play(cardFlipSound, false, 0.5)
        }
      }, [revealCardsAnimation?.move, drawCards?.move])

      useEffect(() => {
        if (playCard) {
          audioLoader.play(cardMoveSound, false, 0.5)
        }
      }, [playCard?.move])

      useEffect(() => {
        if (playTile) {
          audioLoader.play(moveTileSound, false, 0.5)
        }
      }, [playTile?.move])

      useEffect(() => {
        if (permObjective) {
          audioLoader.play(permObjectiveSound, false, 0.5)
        }
      }, [permObjective?.move])

      useEffect(() => {
        if (varObjective) {
          audioLoader.play(varObjectiveSound, false, 0.5)
        }
      }, [varObjective?.move])

    return null
}

export default PrehistoriesSounds