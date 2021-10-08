/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView"
import { Picture } from "@gamepark/react-components"
import { FC } from "react"
import { useTranslation } from "react-i18next";
import Images from "../utils/Images"
import Goal from "./Goal"
import { getTotem } from "./PlayerPanel"

type Props = {
    goals:number[],
    players:(PlayerView | PlayerViewSelf | PlayerHuntView)[]
}

const Objectives : FC<Props> = ({goals,players}) => {

    const {t} = useTranslation()

    return(

        <>

        <div css={[variableObjectivesPosition]}>
            {goals.map((goal, index) => 
                <div key={index} css={goalPosition(index)}>  
                    <Goal goal={goal}
                          players={players}/>
                </div>
            )}
        </div>

        <div css={[permanentObjectivePosition, permanentObjectiveStyle]}>
            {players.map((player, indexPlayer) => 
                [...Array(8-player.goalsMade.length-player.totemTokens)].map((_, i) => <Picture key={i} alt={t('token')} src={getTotem(player.color)} css={totemStyle(indexPlayer,i)} draggable={false} />)
            )}

        </div>


        </>


    )

    
}

const totemStyle = (iPlayer:number, iToken:number) => css`
    position:absolute;
    left:${0.8+iPlayer*3 + ((iPlayer === 0 || iPlayer === 3) ? (iToken%2)*2 : (iPlayer === 1 || iPlayer === 4) ? (-iToken%2)*2: 0)}em;
    top:${iPlayer%2 === 1 ? 85 - iToken*8 : 0 + iToken * 8}%;
    height:4em;
    width:4em;
    box-shadow:0 0 0.5em black;
    border-radius:100%;
    margin:0.5em auto;
`

const permanentObjectivePosition = css`
position:absolute;
top:7%;
left:64%;
width:10%;
height:38%;
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
top:7%;
left:24%;
width:40%;
height:20%;

display:flex;
flex-direction: row;
justify-content: center;
`
const variableObjectivesStyle = css`
border-radius:10%;
box-shadow:0 0 0.5em black;
`

export default Objectives