import ResolvePermanentObjectives, { isResolvePermanentObjectives } from "@gamepark/prehistories/moves/CheckPermanentObjectives"
import ResolveVariableObjectives, { isResolveVariableObjectives } from "@gamepark/prehistories/moves/CheckVariableObjectives"
import DrawXCards, { isDrawXCards } from "@gamepark/prehistories/moves/DrawXCards"
import MoveType from "@gamepark/prehistories/moves/MoveType"
import PlayPolyomino, { isPlayPolyomino } from "@gamepark/prehistories/moves/PlayPolyomino"
import RevealHuntCards, { isRevealHuntCards, RevealHuntCardsView } from "@gamepark/prehistories/moves/RevealHuntCards"
import ValidateSpentHunters from "@gamepark/prehistories/moves/ValidateSpentHunters"
import { useAnimation, useAnimations } from "@gamepark/react-client"
import { FC } from "react"
import { AudioLoader } from "./AudioLoader"

type Props = {
    audioLoader: AudioLoader
}

const PrehistoriesSounds : FC<Props> = ({audioLoader}) => {

    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const drawCards = useAnimation<DrawXCards>(animation => isDrawXCards(animation.move))
    const playTile = useAnimation<PlayPolyomino>(animation => isPlayPolyomino(animation.move))
    const permObjective = useAnimation<ResolvePermanentObjectives>(animation => isResolvePermanentObjectives(animation.move))
    const varObjective = useAnimation<ResolveVariableObjectives>(animation => isResolveVariableObjectives(animation.move))

    return null

}

export default PrehistoriesSounds