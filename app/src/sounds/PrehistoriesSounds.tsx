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
import objectiveOpponentSound1 from './objectiveOpponent1.mp3';
import objectiveOpponentSound2 from './objectiveOpponent2.mp3';
import {playerWillDraw} from '@gamepark/prehistories/Prehistories';

import PlayHuntCard, {isPlayHuntCardView} from "@gamepark/prehistories/moves/PlayHuntCard"
import GameView from "@gamepark/prehistories/GameView"

type Props = {
    audioLoader: AudioLoader
    game:GameView
}

const PrehistoriesSounds : FC<Props> = ({audioLoader, game}) => {

    const playerId = usePlayerId()
    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawCards>(animation => isDrawCards(animation.move))
    const playTile = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
    const objective = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))
    const playCard = useAnimation<PlayHuntCard>(animation => isPlayHuntCardView(animation.move) && animation.move.player === playerId)

    useEffect(() => {
        if (revealCardsAnimation || (drawCards && playerWillDraw(game.players.find(p => p.color === drawCards.move.player)!) !== 0)) {
          audioLoader.play(cardFlipSound, false, 0.6)
        }
      }, [revealCardsAnimation?.move, drawCards?.move])

      useEffect(() => {
        if (playCard) {
          audioLoader.play(cardMoveSound, false, 0.6)
        }
      }, [playCard?.move])

      useEffect(() => {
        if (playTile) {
          audioLoader.play(moveTileSound, false, 0.4)
        }
      }, [playTile?.move])

      useEffect(() => {
        if (objective) {
          if(game.players.find(p => p.hunting !== undefined)!.color === playerId){
            audioLoader.play(objectiveSound, false, 0.2)
          } else {
            if(objective.move.objective < 4){
              audioLoader.play(objectiveOpponentSound1, false, 0.3)
            } else {
              audioLoader.play(objectiveOpponentSound2, false, 0.3)
            }
          }
        }
      }, [objective?.move])

    return null
}

export default PrehistoriesSounds