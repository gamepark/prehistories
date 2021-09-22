/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import { FC } from "react"
import Images from "../utils/Images"
import Goal from "./Goal"

type Props = {
    goals:number[],
}

const Objectives : FC<Props> = ({goals}) => {

    return(

        <>

        <div css={[variableObjectivesPosition]}>
            {goals.map((goal, index) => 
                <div key={index} css={goalPosition(index)}>  
                    <Goal goal={goal}/>
                </div>
            )}
        </div>

        <div css={[permanentObjectivePosition, permanentObjectiveStyle]}>

        </div>


        </>


    )

    
}

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