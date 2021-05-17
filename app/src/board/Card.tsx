/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import { FC, HTMLAttributes } from "react"
import { BlueHunters, GreenHunters, RedHunters, WhiteHunters, YellowHunters } from "../utils/Images"

type Props = {
    color:PlayerColor
    power:number
    speed:number
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const Card : FC<Props> = ({color, power, speed, ...props}) => {

    return(

        <div {...props} css={[cardPosition, cardStyle(getCardImage(color, power, speed))]}></div>

    )

}

const cardPosition = css`
width:100%;
height:100%;
`
const cardStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

function getCardImage(color:PlayerColor, power:number, speed:number):string{
    switch(color){
        case PlayerColor.Blue :
            return speed <= ((6-power)*10)+5 ? BlueHunters[(power-1)*2] : BlueHunters[(power*2)-1]
        case PlayerColor.Green :
            return speed <= ((6-power)*10)+5 ? GreenHunters[(power-1)*2] : GreenHunters[(power*2)-1]
        case PlayerColor.Red :
            return speed <= ((6-power)*10)+5 ? RedHunters[(power-1)*2] : RedHunters[(power*2)-1]
        case PlayerColor.White :
            return speed <= ((6-power)*10)+5 ? WhiteHunters[(power-1)*2] : WhiteHunters[(power*2)-1]
        case PlayerColor.Yellow :
            return speed <= ((6-power)*10)+5 ? YellowHunters[(power-1)*2] : YellowHunters[(power*2)-1]

    }
}

export default Card