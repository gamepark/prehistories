/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { FC } from "react"
import Goal from "./Goal"

type Props = {
    goals:number[],
    numberOfPlayers:number
}

const VariableObjectives : FC<Props> = ({goals, numberOfPlayers}) => {

    return(

        <div css={[variableObjectivesPosition, variableObjectivesStyle]}>
            {goals.map((goal, index) => 
                <div key={index} css={goalPosition(index)}>  
                    <Goal goal={goal} />
                </div>
            )}
        </div>

    )

    
}

const goalPosition = (index:number) => css`
position:absolute;
top:0%;
left:${index*20}%;
width:20%;
height:100%;
`

const variableObjectivesPosition = css`
position:absolute;
top:7%;
left:25%;
width:45%;
height:20%;
`
const variableObjectivesStyle = css`
background-color:orange;
border: 0.2em solid black;
`

export default VariableObjectives