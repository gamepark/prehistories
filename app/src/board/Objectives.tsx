/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react"
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { Picture } from "@gamepark/react-components"
import { FC, HTMLAttributes } from "react"
import { useTranslation } from "react-i18next";
import { centerContent, placingBackground, setPercentDimension, toAbsolute } from "../utils/styles";
import Images from "../utils/Images"
import Goal from "./Goal"
import { getTotem } from "./PlayerPanel"

type Props = {
    goals:number[],
    players:(PlayerView | PlayerViewSelf | PlayerHuntView)[]
} & HTMLAttributes<HTMLDivElement>

const Objectives : FC<Props> = ({goals,players, ...props}) => {

    const {t} = useTranslation()

    return(

        <>

        <div css={[toAbsolute, variableObjectivesPosition, setPercentDimension(24.4,56), centerContent]} {...props}>
            {goals.map((goal, index) => 
                <div key={index} css={[setPercentDimension(100,18), goalMargin]}>  
                    <Goal goal={goal}
                          players={players}/>
                </div>
            )}
        </div>

        <div css={[toAbsolute, permanentObjectivePosition, setPercentDimension(15.9,20), placingBackground(Images.objective0, "cover")]}>
            {players.map((player, indexPlayer) => 
                [...Array(8-player.variableGoalsMade.length-player.totemTokens)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[toAbsolute, totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
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

const goalMargin = css`
    margin:0 0.5em;
`

const variableObjectivesPosition = css`
    top:7.5%;
    left:24%;
    z-index:1;
    cursor:pointer;
`
export default Objectives