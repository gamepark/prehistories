/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { FC } from "react"
import Images from "../utils/Images"

type Props = {
    goal:number
}

const Goal : FC<Props> = ({goal}) => {

    return(

        <div css={[goalStyle(goal), goalPosition]}>



        </div>

    )

}

const goalPosition = css`
    width:100%;
    height:100%;
`

const goalStyle = (goal:number) => css`
    background-image: url(${getGoalCardImage(goal)});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: top;

    border-radius:8% / 5%;
    box-shadow:0 0 0.5em black;
`

function getGoalCardImage(goal:number):string{
    switch (goal){
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

export default Goal