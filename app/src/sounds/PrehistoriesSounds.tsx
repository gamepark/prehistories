import FulfillObjective, {isFulfillObjective} from "@gamepark/prehistories/moves/FulfillObjective"
import DrawCards, {isDrawCards} from "@gamepark/prehistories/moves/DrawCards"
import PlaceTile, {isPlaceTile} from "@gamepark/prehistories/moves/PlaceTile"
import {isRevealHuntCards, RevealHuntCardsView} from "@gamepark/prehistories/moves/RevealHuntCards"
import {useAnimation, usePlayerId} from "@gamepark/react-client"
import {FC, useEffect} from "react"
import {AudioLoader} from "./AudioLoader"
import cardFlipSound from "./cardFlip.mp3";
import cardMoveSound from "./cardMove.mp3";
import moveTileSound from "./moveTile.mp3";
import objectiveSound from "./objective.mp3"
import PlayHuntCard, {isPlayHuntCardView} from "@gamepark/prehistories/moves/PlayHuntCard"

type Props = {
    audioLoader: AudioLoader
}

const PrehistoriesSounds : FC<Props> = ({audioLoader}) => {

    const playerId = usePlayerId()
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawCards>(animation => isDrawCards(animation.move))
    const playTile = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
    const objective = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))
    const playCard = useAnimation<PlayHuntCard>(animation => isPlayHuntCardView(animation.move) && animation.move.playerId === playerId)

    useEffect(() => {
        if (revealCardsAnimation || drawCards) {
          audioLoader.play(cardFlipSound, false, 0.8)
        }
      }, [revealCardsAnimation?.move, drawCards?.move])

      useEffect(() => {
        if (playCard) {
          audioLoader.play(cardMoveSound, false, 0.8)
        }
      }, [playCard?.move])

      useEffect(() => {
        if (playTile) {
          audioLoader.play(moveTileSound, false, 0.8)
        }
      }, [playTile?.move])

      useEffect(() => {
        if (objective) {
            audioLoader.play(objectiveSound, false, 0.8)
        }
      }, [objective])

    return null
}

export default PrehistoriesSounds