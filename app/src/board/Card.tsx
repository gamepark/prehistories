/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react"
import { getColoredDeck } from "@gamepark/prehistories/material/Hunters"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import { FC, HTMLAttributes } from "react"
import Images, { BlueHunters, GreenHunters, RedHunters, WhiteHunters, YellowHunters } from "../utils/Images"
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed"
import CardInHand from "@gamepark/prehistories/types/appTypes/CardInHand"
import { usePlay } from "@gamepark/react-client"
import Move from "@gamepark/prehistories/moves/Move"
import PlayHuntCard from "@gamepark/prehistories/moves/PlayHuntCard"
import { Draggable } from "@gamepark/react-components"


type Props = {
    color:PlayerColor
    power?:number
    speed?:number
    draggable?:boolean
    type?:'CardInHand' | 'CardPlayed'
    draggableItem?: CardInHand | CardPlayed
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const Card : FC<Props> = ({color, power, speed, draggable=false, type='', draggableItem, ...props}) => {

    const play = usePlay<Move>()
    const item = {...draggableItem}
    const onDrop = (move:PlayHuntCard) => {
        play(move)
    }

    return(

        <Draggable canDrag={draggable}
                   type={type}
                   item={item}
                   drop={onDrop}
                   {...props}
                   css={[cardPosition, cardStyle(getCardImage(color, power, speed))]}>
        </Draggable>

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

function getCardImage(color:PlayerColor, power:number|undefined, speed:number|undefined):string{
    switch(color){
        case PlayerColor.Blue :
            return power === undefined || speed === undefined ? Images.cardBackBlue : (speed <= ((6-power)*10)+5 ? BlueHunters[(power-1)*2] : BlueHunters[(power*2)-1])
        case PlayerColor.Green :
            return power === undefined || speed === undefined ? Images.cardBackGreen : (speed <= ((6-power)*10)+5 ? GreenHunters[(power-1)*2] : GreenHunters[(power*2)-1])
        case PlayerColor.Red :
            return power === undefined || speed === undefined ? Images.cardBackRed : (speed <= ((6-power)*10)+5 ? RedHunters[(power-1)*2] : RedHunters[(power*2)-1])
        case PlayerColor.White :
            return power === undefined || speed === undefined ? Images.cardBackWhite : (speed <= ((6-power)*10)+5 ? WhiteHunters[(power-1)*2] : WhiteHunters[(power*2)-1])
        case PlayerColor.Yellow :
            return power === undefined || speed === undefined ? Images.cardBackYellow : (speed <= ((6-power)*10)+5 ? YellowHunters[(power-1)*2] : YellowHunters[(power*2)-1])

    }
}

export default Card