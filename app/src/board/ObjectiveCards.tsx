/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react"
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView"
import {Picture} from "@gamepark/react-components"
import {FC, HTMLAttributes} from "react"
import {useTranslation} from "react-i18next"
import {centerContent, placingBackground, setPercentDimension, toAbsolute} from "../utils/styles"
import Images from "../utils/Images"
import ObjectiveCard from "./ObjectiveCard"
import {getTotem} from "./PlayerPanel"
import {permanentObjectives} from "@gamepark/prehistories/material/Objective";

type Props = {
    objectives:number[],
    players:(PlayerView | PlayerViewSelf)[]
} & HTMLAttributes<HTMLDivElement>

const ObjectiveCards : FC<Props> = ({objectives,players, ...props}) => {

    const {t} = useTranslation()

    return(

        <>

        <div css={[toAbsolute, variableObjectivesPosition, setPercentDimension(24.4,56), centerContent]} {...props}>
            {objectives.map((objective, index) => 
                <div key={index} css={[setPercentDimension(100,18), objectiveMargin]}>  
                    <ObjectiveCard objective={objective}
                                   players={players}/>
                </div>
            )}
        </div>

        <div css={[toAbsolute, permanentObjectivePosition, setPercentDimension(15.9,20), placingBackground(Images.permanentObjectives, "cover")]}>
            {players.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(o => permanentObjectives.includes(o)).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
            )}

        </div>

        </>

    )    
}

const incomingKeyframes = keyframes`
    from,20%{top:-150%;}
    to{}
`

const incomingAnimation = css`
    animation:${incomingKeyframes} 1s linear ;
`

const totemStyle = (iPlayer:number, iToken:number) => css`
    top:${-0.2+iPlayer*2.8 + ((iPlayer === 0 || iPlayer === 3) ? (iToken%2)*1.2 : (iPlayer === 1 || iPlayer === 4) ? (-iToken%2)*1.2: 0)}em;
    left:${iPlayer%2 === 1 ? 85 - iToken*7 : 2 + iToken * 7}%;
    height:4em;
    width:4em;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:0.5em auto;
`

const permanentObjectivePosition = css`
    top:7%;
    right:0%;
    border-radius:0.8em;
    border:0.1em solid black;
`

const objectiveMargin = css`
    margin:0 0.5em;
`

const variableObjectivesPosition = css`
    top:7.5%;
    left:24%;
    z-index:0;
    cursor:pointer;
`
export default ObjectiveCards