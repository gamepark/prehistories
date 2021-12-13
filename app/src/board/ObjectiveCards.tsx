/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react"
import {PlayerView, PlayerViewSelf} from "@gamepark/prehistories/types/PlayerView"
import {Picture} from "@gamepark/react-components"
import {FC, HTMLAttributes} from "react"
import {useTranslation} from "react-i18next"
import {centerContent, placingBackground, setPercentDimension, toAbsolute} from "../utils/styles"
import Images from "../utils/Images"
import ObjectiveCard from "./ObjectiveCard"
import {getTotem} from "./PlayerPanel"

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
                                   players={players}
                                   isWelcomePopUp={false} />
                </div>
            )}
        </div>

        <div css={[toAbsolute, permanentObjectivePosition, setPercentDimension(15.9,20), placingBackground(Images.permanentObjectives, "cover")]}>
            {players.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(o => o === 1).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle, totemColumnPosition(indexPlayer,i, player.totemTokens.filter(o => o === 1).length, players.length)]} draggable={false} />)
            )}
            {players.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(o => o === 2).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle,  totemLinePosition(indexPlayer,i, player.totemTokens.filter(o => o === 2).length, players.length)]} draggable={false} />)
            )}
            {players.map((player, indexPlayer) => 
                [...Array(player.totemTokens.filter(o => o === 3).length)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle, totemLegendaryPosition(indexPlayer,i,player.totemTokens.filter(o => o === 3).length, players.length)]} draggable={false} />)
            )}

        </div>

        </>

    )    
}

const totemColumnPosition = (iPlayer:number, iToken:number, maxTokens:number, nbPlayers:number) => css`
top:${iPlayer*(80/nbPlayers)}%;
left:${1+iToken*(21/maxTokens)}%;
`

const totemLinePosition = (iPlayer:number, iToken:number, maxTokens:number, nbPlayers:number) => css`
top:${iPlayer*(80/nbPlayers)}%;
left:${36+iToken*(21/maxTokens)}%;
`

const totemLegendaryPosition = (iPlayer:number, iToken:number, maxTokens:number, nbPlayers:number) => css`
top:${iPlayer*(80/nbPlayers)}%;
left:${71+iToken*(21/maxTokens)}%;
`

const totemStyle = css`
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