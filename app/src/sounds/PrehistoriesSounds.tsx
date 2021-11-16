import FulfillObjective, {isFulfillObjective} from "@gamepark/prehistories/moves/FulfillObjective"
import DrawCards, {isDrawCards} from "@gamepark/prehistories/moves/DrawCards"
import PlaceTile, {isPlaceTile} from "@gamepark/prehistories/moves/PlaceTile"
import {isRevealHuntCards, RevealHuntCardsView} from "@gamepark/prehistories/moves/RevealHuntCards"
import {useAnimation} from "@gamepark/react-client"
import {FC, useEffect} from "react"
import {AudioLoader} from "./AudioLoader"
import cardFlipSound from "./cardFlip.mp3";
import cardMoveSound from "./cardMove.mp3";
import moveTileSound from "./moveTile.mp3";
import permObjectiveSound from "./permObjective.mp3";
import varObjectiveSound from "./varObjective.mp3";
import PlayHuntCard, {isPlayHuntCardView} from "@gamepark/prehistories/moves/PlayHuntCard"
import {permanentObjectives} from "@gamepark/prehistories/material/Objective";


type Props = {
    audioLoader: AudioLoader
}

const PrehistoriesSounds : FC<Props> = ({audioLoader}) => {

    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawCards>(animation => isDrawCards(animation.move))
    const playTile = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
    const objective = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))
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
        if (objective) {
          if (permanentObjectives.includes(objective.move.objective)) {
            audioLoader.play(permObjectiveSound, false, 0.5)
          } else {
            audioLoader.play(varObjectiveSound, false, 0.5)
          }
        }
      }, [objective])

    return null
}

export default PrehistoriesSounds