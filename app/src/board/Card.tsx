/** @jsxImportSource @emotion/react */
import {css, keyframes} from "@emotion/react"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import {FC, HTMLAttributes} from "react"
import {BlueHunters, GreenHunters, RedHunters, WhiteHunters, YellowHunters} from "../utils/Images"
import CardPlayed from "@gamepark/prehistories/types/appTypes/CardPlayed"
import CardInHand from "@gamepark/prehistories/types/appTypes/CardInHand"
import {useAnimation, usePlay, useSound} from "@gamepark/react-client"
import Move from "@gamepark/prehistories/moves/Move"
import PlayHuntCard from "@gamepark/prehistories/moves/PlayHuntCard"
import {Draggable} from "@gamepark/react-components"
import {isRevealHuntCards, RevealHuntCardsView} from "@gamepark/prehistories/moves/RevealHuntCards"
import MoveCardSound from "../sounds/cardMove.mp3"
import {placingBackground, toAbsolute, toFullSize} from "../utils/styles"
import {getCardBack} from "../utils/getterFunctions"
import TakeBackPlayedCards, {isTakeBackPlayedCards} from "@gamepark/prehistories/moves/TakeBackPlayedCards"

type Props = {
    color:PlayerColor
    power?:number
    speed?:number
    draggable?:boolean
    type?:'CardInHand' | 'CardPlayed'
    draggableItem?: CardInHand | CardPlayed
    isTakeBackAnimation?:boolean
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const Card : FC<Props> = ({color, power, speed, draggable=false, type='', draggableItem, isTakeBackAnimation, ...props}) => {

    const play = usePlay<Move>()
    const moveCardSound = useSound(MoveCardSound)
    const item = {...draggableItem}
    const onDrop = (move:PlayHuntCard) => {
        moveCardSound.volume = 0.8
        moveCardSound.play()
        play(move)
    }

    const revealCardsAnimation = useAnimation<RevealHuntCardsView>(animation => isRevealHuntCards(animation.move))
    const takeBackCardsAnimation = useAnimation<TakeBackPlayedCards>(animation => isTakeBackPlayedCards(animation.move))


    return(

        <Draggable canDrag={draggable}
                   type={type}
                   item={item}
                   drop={onDrop}
                   {...props}
                   css={[toAbsolute, toFullSize, cardPosition]}>

            <div css={[toAbsolute, toFullSize, cardPosition, faceToShow(power, revealCardsAnimation !== undefined, revealCardsAnimation?.duration ?? 0), isTakeBackAnimation && rotateAnimation(takeBackCardsAnimation?.duration ?? 0)]}>

                <div css={[toAbsolute, toFullSize, cardPosition, front, placingBackground(getCardImage(color, power, speed), "cover")]}></div>
                <div css={[toAbsolute, toFullSize, cardPosition, back, placingBackground(getCardImage(color, undefined, undefined), "cover")]}></div>

            </div>

        </Draggable>

    )

}

const rotateKeyframes = keyframes`
    from{transform:rotateY(0deg);}
    to{transform:rotateY(180deg);}
`

const rotateAnimation = (duration:number) => css`
    animation:${rotateKeyframes} ${duration}s linear;
`

const faceToShow = (power:undefined|number, isAnimation:boolean, duration:number) => css`
    box-shadow:0 0 0.5em black;
    transform:rotateY(${power === undefined ? 180 : 0}deg);
    ${isAnimation ? `transition:transform ${duration}s linear;` : `transition:none;`}
`

const front = css`
    transform-style: preserve-3d;
    backface-visibility:hidden;
`

const back = css`
    transform-style: preserve-3d;
    backface-visibility:hidden;
    transform:rotateY(180deg);
`

const cardPosition = css`
    transform-style:preserve-3d;
    border-radius:8%;
`

function getCardImage(color:PlayerColor, power:number|undefined, speed:number|undefined):string{
    if(power === undefined || speed === undefined){
        return getCardBack(color)
    } else {
        switch(color){
            case PlayerColor.Blue :
                return (speed <= ((6-power)*10)+5 ? BlueHunters[(power-1)*2] : BlueHunters[(power*2)-1])
            case PlayerColor.Green :
                return (speed <= ((6-power)*10)+5 ? GreenHunters[(power-1)*2] : GreenHunters[(power*2)-1])
            case PlayerColor.Red :
                return (speed <= ((6-power)*10)+5 ? RedHunters[(power-1)*2] : RedHunters[(power*2)-1])
            case PlayerColor.White :
                return (speed <= ((6-power)*10)+5 ? WhiteHunters[(power-1)*2] : WhiteHunters[(power*2)-1])
            case PlayerColor.Yellow :
                return (speed <= ((6-power)*10)+5 ? YellowHunters[(power-1)*2] : YellowHunters[(power*2)-1])
        }
    }
}

export default Card