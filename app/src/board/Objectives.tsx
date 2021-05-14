/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { FC } from "react"
import Images from "../utils/Images"
import Goal from "./Goal"

type Props = {
    goals:number[],
}

const Objectives : FC<Props> = ({goals}) => {

    return(

        <>

        <div css={[variableObjectivesPosition, variableObjectivesStyle]}>
            {goals.map((goal, index) => 
                <div key={index} css={goalPosition(index)}>  
                    <Goal goal={goal} />
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
background-color:orange;

background-image: url(${Images.objective0});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const goalPosition = (index:number) => css`
width:20%;
height:100%;
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
background-color:orange;
`

export default Objectives