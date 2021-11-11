import ResolvePermanentGoals, {isResolvePermanentGoals} from "@gamepark/prehistories/moves/CheckPermanentGoals"
import ResolveVariableGoals, {isResolveVariableGoals} from "@gamepark/prehistories/moves/CheckVariableGoals"
import DrawCards, {isDrawCards} from "@gamepark/prehistories/moves/DrawCards"
import PlaceTile, {isPlaceTile} from "@gamepark/prehistories/moves/PlaceTile"
import {isRevealHuntCards, RevealHuntCardsView} from "@gamepark/prehistories/moves/RevealHuntCards"
import {useAnimation} from "@gamepark/react-client"
import {FC, useEffect} from "react"
import {AudioLoader} from "./AudioLoader"
import cardFlipSound from "./cardFlip.mp3";
import cardMoveSound from "./cardMove.mp3";
import moveTileSound from "./moveTile.mp3";
import permGoalSound from "./permGoal.mp3";
import varGoalSound from "./varGoal.mp3";
import PlayHuntCard, {isPlayHuntCardView} from "@gamepark/prehistories/moves/PlayHuntCard"


type Props = {
    audioLoader: AudioLoader
}

const PrehistoriesSounds : FC<Props> = ({audioLoader}) => {

    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawCards>(animation => isDrawCards(animation.move))
    const playTile = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
    const permGoal = useAnimation<ResolvePermanentGoals>(animation => isResolvePermanentGoals(animation.move))
    const varGoal = useAnimation<ResolveVariableGoals>(animation => isResolveVariableGoals(animation.move))
    const playCard = useAnimation<PlayHuntCard>(animation => isPlayHuntCardView(animation.move))

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
        if (permGoal) {
          audioLoader.play(permGoalSound, false, 0.5)
        }
      }, [permGoal?.move])

      useEffect(() => {
        if (varGoal) {
          audioLoader.play(varGoalSound, false, 0.5)
        }
      }, [varGoal?.move])

    return null
}

export default PrehistoriesSounds