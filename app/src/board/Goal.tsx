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
    goal:number
    players:(PlayerView | PlayerViewSelf)[]
} & HTMLAttributes<HTMLDivElement>

const Goal : FC<Props> = ({goal, players, ...props}) => {
    
    const playerNewArray = players.filter(p => p)
    const sortedPlayers = playerNewArray.sort((a,b) => -a.variableGoalsMade.filter(g => g === goal).length+b.variableGoalsMade.filter(g => g === goal).length)
    const {t} = useTranslation()

    return(

        <div css={[goalPosition, toFullSize, goalStyle, placingBackground(getGoalCardImage(goal), "cover")]} {...props}>

            {sortedPlayers.map((player, indexPlayer) => 
                [...Array(player.variableGoalsMade.filter(g => g === goal).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, setPercentDimension(12.3,17), totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
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

const goalPosition = css`
    position:relative;
`

const goalStyle = css`
    border-radius:8% / 5%;
    box-shadow:0 0 0.5em black;
`

function getGoalCardImage(goal:number):string{
    switch (goal){
        case 0 :
            return Images.goal1A
        case 1 : 
            return Images.goal2A
        case 2 :
            return Images.goal3A
        case 3 : 
            return Images.goal4A
        case 4 :
            return Images.goal5A
        case 5 : 
            return Images.goal6A
        case 6 :
            return Images.goal7A
        case 7 : 
            return Images.goal8A
        case 8 : 
            return Images.goal9A
        case 9 :
            return Images.goal1B
        case 10 : 
            return Images.goal2B
        case 11 :
            return Images.goal3B
        case 12 : 
            return Images.goal4B
        case 13 :
            return Images.goal5B
        case 14 : 
            return Images.goal6B
        case 15 :
            return Images.goal7B
        case 16 : 
            return Images.goal8B
        case 17 : 
            return Images.goal9B
        default :
            return Images.goal0
    }
}

export default Goal