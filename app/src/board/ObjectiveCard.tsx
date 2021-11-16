/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react"
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView"
import {Picture} from "@gamepark/react-components"
import {FC, HTMLAttributes} from "react"
import {useTranslation} from "react-i18next/"
import {placingBackground, setPercentDimension, toAbsolute, toFullSize} from "../utils/styles"
import Images from "../utils/Images"
import {getTotem} from "./PlayerPanel"
import Objective from "@gamepark/prehistories/material/Objective";
import {TFunction} from "i18next";

type Props = {
    objective: Objective
    players:(PlayerView | PlayerViewSelf)[]
} & HTMLAttributes<HTMLDivElement>

const ObjectiveCard : FC<Props> = ({objective, players, ...props}) => {
    
    const playerNewArray = players.filter(p => p)
    const sortedPlayers = playerNewArray.sort((a,b) => -a.totemTokens.filter(g => g === objective).length+b.totemTokens.filter(g => g === objective).length)
    const {t} = useTranslation()

    return(

        <div css={[objectivePosition, toFullSize, objectiveStyle, placingBackground(getObjectiveCardImage(objective), "cover")]} {...props}>

            {sortedPlayers.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(g => g === objective).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, setPercentDimension(12.3,17), totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
            )}

        </div>

    )

}

const incomingKeyframes = keyframes`
    from{bottom:150%;}
    to{}
`

const incomingAnimation = css`
    animation:${incomingKeyframes} 1s linear;
`

const totemStyle = (iPlayer:number, iToken:number) => css`
    bottom:${iPlayer === 0 ? 2 : 2 + (iPlayer - 1)*10}%;
    left:${iPlayer === 0 ? 9.5+iToken*10 : 73.5-iToken*10}%;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:0.5em auto;
`

const objectivePosition = css`
    position:relative;
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

export function getObjectiveText(objective: Objective, t: TFunction) {
    switch (objective) {
        case Objective.ConnectTotemAnimals:
            return t('objectiveA1')
        case Objective.PaintMiddle9:
            return t('objectiveA2')
        case Objective.Column5Different:
            return t('objectiveA3')
        case Objective.AnimalArea8:
            return t('objectiveA4')
        case Objective.SurroundHunter:
            return t('objectiveA5')
        case Objective.Column5Same:
            return t('objectiveA6')
        case Objective.ConnectDiagonalCorners:
            return t('objectiveA7')
        case Objective.Paint5SmallestTiles:
            return t('objectiveA8')
        case Objective.SurroundLegendary:
            return t('objectiveA9')
        case Objective.SurroundTotemAnimals:
            return t('objectiveB1')
        case Objective.PaintLastColumn:
            return t('objectiveB2')
        case Objective.Line5Different:
            return t('objectiveB3')
        case Objective.AnimalArea10:
            return t('objectiveB4')
        case Objective.SurroundHunterDifferent:
            return t('objectiveB5')
        case Objective.Line5Same:
            return t('objectiveB6')
        case Objective.PaintAllCorners:
            return t('objectiveB7')
        case Objective.Collect3Tiles:
            return t('objectiveB8')
        case Objective.PaintAdjacentLegendary:
            return t('objectiveB9')
        default:
            return ''
    }
}

export default ObjectiveCard