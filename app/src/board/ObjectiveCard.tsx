/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react"
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView"
import {Picture} from "@gamepark/react-components"
import {FC, HTMLAttributes} from "react"
import {Trans, useTranslation} from "react-i18next/"
import {placingBackground, toAbsolute, toFullSize} from "../utils/styles"
import Images from "../utils/Images"
import {getTotem} from "./PlayerPanel"
import Objective from "@gamepark/prehistories/material/Objective";
import {useAnimation, usePlayerId} from "@gamepark/react-client"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import FulfillObjective, {isFulfillObjective} from "@gamepark/prehistories/moves/FulfillObjective"

type Props = {
    objective: Objective
    players:(PlayerView | PlayerViewSelf)[]
    isWelcomePopUp:boolean
} & HTMLAttributes<HTMLDivElement>

const ObjectiveCard : FC<Props> = ({objective, players, isWelcomePopUp, ...props}) => {
    
    const playerNewArray = players.filter(p => p)
    const sortedPlayers = playerNewArray.sort((a,b) => -a.totemTokens.filter(g => g === objective).length+b.totemTokens.filter(g => g === objective).length)
    const playerId = usePlayerId<PlayerColor>()
    const {t} = useTranslation()

    const fulfillObjectiveAnimation = useAnimation<FulfillObjective>(animation => isFulfillObjective(animation.move))


    return(

        <div css={[objectivePosition, toFullSize, objectiveStyle, fulfillObjectiveAnimation && fulfillObjectiveAnimation.move.objective === objective && fulfillingEffect(objective > 20)]} {...props}>

            <div css={[toFullSize, objectiveStyle, placingBackground(getObjectiveCardImage(objective), "cover"), sortedPlayers.find(p => p.color === playerId)?.totemTokens.filter(g => g === objective).length !== 0 && desaturate]}>

            </div>

            {isWelcomePopUp === false && sortedPlayers.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(g => g === objective).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle(indexPlayer,i)]} draggable={false} />)
            )}

        </div>

    )

}

const fulfillingEffect = (isExpert:boolean) => css`
  box-shadow:0 0 0.5em 1em ${isExpert ? `#1991d3` : `#f7ab01` };
  transition:box-shadow 0.5s linear;
  z-index:2;
`

const desaturate = css`
    transition:filter 1s linear;
    filter:saturate(40%);
`

const totemStyle = (iPlayer:number, iToken:number) => css`
    top:${iPlayer === 0 ? 2 : 2 + (iPlayer - 1)*10}%;
    left:${iPlayer === 0 ? 5.5+iToken*10 : 73.5-iToken*10}%;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:0.5em auto;
    width:4em;
    height:4em;
`

const objectivePosition = css`
    position:relative;
    transition:box-shadow 0.5s linear;
`

const objectiveStyle = css`
    border-radius:8% / 5%;
    box-shadow:0 0 0.5em black;
`

function getObjectiveCardImage(objective: Objective): string {
    switch (objective) {
        case Objective.ConnectTotemAnimals:
            return Images.objectiveSunTotems
        case Objective.PaintMiddle9:
            return Images.objectiveSunMiddle
        case Objective.Column5Different:
            return Images.objectiveSunDiffAnimals
        case Objective.AnimalArea8:
            return Images.objectiveSunAnimalArea
        case Objective.SurroundHunter:
            return Images.objectiveSunHunter
        case Objective.Column5Same:
            return Images.objectiveSunSameAnimal
        case Objective.ConnectDiagonalCorners:
            return Images.objectiveSunCorners
        case Objective.Paint5SmallestTiles:
            return Images.objectiveSunSmallTiles
        case Objective.SurroundLegendary:
            return Images.objectiveSunLegendary
        case Objective.SurroundTotemAnimals:
            return Images.objectiveMoonTotems
        case Objective.PaintLastColumn:
            return Images.objectiveMoonLastColumn
        case Objective.Line5Different:
            return Images.objectiveMoonDiffAnimals
        case Objective.AnimalArea10:
            return Images.objectiveMoonAnimalArea
        case Objective.SurroundHunterDifferent:
            return Images.objectiveMoonHunter
        case Objective.Line5Same:
            return Images.objectiveMoonSameAnimal
        case Objective.PaintAllCorners:
            return Images.objectiveMoonCorners
        case Objective.Collect3Tiles:
            return Images.objectiveMoonCollect
        case Objective.PaintAdjacentLegendary:
            return Images.objectiveMoonLegendary
        default :
            return Images.permanentObjectives
    }
}

export function getObjectiveText(objective: Objective) {
    switch (objective) {
        case Objective.ConnectTotemAnimals:
            return <Trans defaults="objectiveA1" components={[<strong/>]}/>
        case Objective.PaintMiddle9:
            return <Trans defaults="objectiveA2" components={[<strong/>]}/>
        case Objective.Column5Different:
            return <Trans defaults="objectiveA3" components={[<strong/>]}/>
        case Objective.AnimalArea8:
            return <Trans defaults="objectiveA4" components={[<strong/>]}/>
        case Objective.SurroundHunter:
            return <Trans defaults="objectiveA5" components={[<strong/>]}/>
        case Objective.Column5Same:
            return <Trans defaults="objectiveA6" components={[<strong/>]}/>
        case Objective.ConnectDiagonalCorners:
            return <Trans defaults="objectiveA7" components={[<strong/>]}/>
        case Objective.Paint5SmallestTiles:
            return <Trans defaults="objectiveA8" components={[<strong/>]}/>
        case Objective.SurroundLegendary:
            return <Trans defaults="objectiveA9" components={[<strong/>]}/>
        case Objective.SurroundTotemAnimals:
            return <Trans defaults="objectiveB1" components={[<strong/>]}/>
        case Objective.PaintLastColumn:
            return <Trans defaults="objectiveB2" components={[<strong/>]}/>
        case Objective.Line5Different:
            return <Trans defaults="objectiveB3" components={[<strong/>]}/>
        case Objective.AnimalArea10:
            return <Trans defaults="objectiveB4" components={[<strong/>]}/>
        case Objective.SurroundHunterDifferent:
            return <Trans defaults="objectiveB5" components={[<strong/>]}/>
        case Objective.Line5Same:
            return <Trans defaults="objectiveB6" components={[<strong/>]}/>
        case Objective.PaintAllCorners:
            return <Trans defaults="objectiveB7" components={[<strong/>]}/>
        case Objective.Collect3Tiles:
            return <Trans defaults="objectiveB8" components={[<strong/>]}/>
        case Objective.PaintAdjacentLegendary:
            return <Trans defaults="objectiveB9" components={[<strong/>]}/>
        default:
            return ''
    }
}

export default ObjectiveCard