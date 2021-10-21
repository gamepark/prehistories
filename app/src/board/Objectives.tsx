/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react"
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { Picture } from "@gamepark/react-components"
import { FC, HTMLAttributes } from "react"
import { useTranslation } from "react-i18next";
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

        <div css={[variableObjectivesPosition]} {...props}>
            {goals.map((goal, index) => 
                <div key={index} css={goalPosition(index)}>  
                    <Goal goal={goal}
                          players={players}/>
                </div>
            )}
        </div>

        <div css={[permanentObjectivePosition, permanentObjectiveStyle]}>
            {players.map((player, indexPlayer) => 
                [...Array(8-player.goalsMade.length-player.totemTokens)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={[totemStyle(indexPlayer,i), incomingAnimation]} draggable={false} />)
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
    position:absolute;
    top:${-0.2+iPlayer*2.8 + ((iPlayer === 0 || iPlayer === 3) ? (iToken%2)*1.2 : (iPlayer === 1 || iPlayer === 4) ? (-iToken%2)*1.2: 0)}em;
    left:${iPlayer%2 === 1 ? 85 - iToken*7 : 2 + iToken * 7}%;
    height:4em;
    width:4em;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:0.5em auto;
`

const permanentObjectivePosition = css`
position:absolute;
top:7%;
right:0%;
width:20%;
height:15.9%;
`

const permanentObjectiveStyle = css`
background-image: url(${Images.objective0});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const goalPosition = (index:number) => css`
width:18%;
height:88%;
margin:0 0.5em;
`

const variableObjectivesPosition = css`
position:absolute;
top:8%;
left:24%;
width:56%;
height:27.8%;
z-index:1;
cursor:pointer;

display:flex;
flex-direction: row;
justify-content: center;
`
export default Objectives