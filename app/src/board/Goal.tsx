/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react"
import { PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { Picture } from "@gamepark/react-components"
import { FC, HTMLAttributes } from "react"
import { useTranslation } from "react-i18next/"
import { placingBackground, setPercentDimension, toAbsolute, toFullSize } from "../utils/styles"
import Images from "../utils/Images"
import { getTotem } from "./PlayerPanel"

type Props = {
    objective:number
    players:(PlayerView | PlayerViewSelf)[]
} & HTMLAttributes<HTMLDivElement>

const Objective : FC<Props> = ({objective, players, ...props}) => {
    
    const playerNewArray = players.filter(p => p)
    const sortedPlayers = playerNewArray.sort((a,b) => -a.variableObjectivesMade.filter(g => g === objective).length+b.variableObjectivesMade.filter(g => g === objective).length)
    const {t} = useTranslation()

    return(

        <div css={[objectivePosition, toFullSize, objectiveStyle, placingBackground(getObjectiveCardImage(objective), "cover")]} {...props}>

            {sortedPlayers.map((player, indexPlayer) => 
                [...Array(player.variableObjectivesMade.filter(g => g === objective).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, setPercentDimension(12.3,17), totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
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

function getObjectiveCardImage(objective:number):string{
    switch (objective){
        case 0 :
            return Images.objective1A
        case 1 : 
            return Images.objective2A
        case 2 :
            return Images.objective3A
        case 3 : 
            return Images.objective4A
        case 4 :
            return Images.objective5A
        case 5 : 
            return Images.objective6A
        case 6 :
            return Images.objective7A
        case 7 : 
            return Images.objective8A
        case 8 : 
            return Images.objective9A
        case 9 :
            return Images.objective1B
        case 10 : 
            return Images.objective2B
        case 11 :
            return Images.objective3B
        case 12 : 
            return Images.objective4B
        case 13 :
            return Images.objective5B
        case 14 : 
            return Images.objective6B
        case 15 :
            return Images.objective7B
        case 16 : 
            return Images.objective8B
        case 17 : 
            return Images.objective9B
        default :
            return Images.objective0
    }
}

export default Objective