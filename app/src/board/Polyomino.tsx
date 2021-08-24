/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import Move from "@gamepark/prehistories/moves/Move";
import PlayPolyomino from "@gamepark/prehistories/moves/PlayPolyomino";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { usePlay } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt"
import { Draggable } from "@gamepark/react-components";

type Props = {
    polyomino:number
    color?:PlayerColor
    side:0|1
    draggable?:boolean
    type?:'PolyominoToHunt'
    draggableItem?:PolyominoToHunt
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const Polyomino : FC<Props> = ({polyomino, side, color, draggable = false, type='', draggableItem, ...props}) => {

    const play = usePlay<Move>()
    const item = {...draggableItem}
    const onDrop = (move:PlayPolyomino) => {
        play(move)
    }

    return(
        <Draggable canDrag={draggable}
                   type={type}
                   item={item}
                   drop={onDrop}
                   {...props}
                   css={[polyominoSize, polyominoStyle(color ? getColoredPolyominoImage(polyomino, color!): getPolyominoImage(polyomino, side))]}>

        </Draggable>
    )

}

const polyominoSize = css`
width:100%;
height:100%;
`

const polyominoStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

function getColoredPolyominoImage(polyomino:number, color:PlayerColor):string{
switch (color){
    case (PlayerColor.Blue) :
        return polyomino === 0 ? Images.polyominoType0HunterBlue : Images.polyominoType0TotemBlue
    case (PlayerColor.Green) :
            return polyomino === 0 ? Images.polyominoType0HunterGreen : Images.polyominoType0TotemGreen
    case (PlayerColor.Red) :
        return polyomino === 0 ? Images.polyominoType0HunterRed : Images.polyominoType0TotemRed
    case (PlayerColor.White) :
        return polyomino === 0 ? Images.polyominoType0HunterWhite : Images.polyominoType0TotemWhite
    case (PlayerColor.Yellow) :
        return polyomino === 0 ? Images.polyominoType0HunterYellow : Images.polyominoType0TotemYellow
}
        
}

function getPolyominoImage(polyomino:number, side:number):string{
    if (polyomino>=2 && polyomino <=6){
        return Images.polyominoType1_1
    } else if (polyomino >=7 && polyomino <=11){
        return Images.polyominoType1_2
    } else if (polyomino >= 12 && polyomino <=16){
        return Images.polyominoType1_3
    } else if (polyomino>=17 && polyomino <=21){
        return Images.polyominoType1_4
    } else if (polyomino>=22 && polyomino <=26){
        return Images.polyominoType1_5

    } else if (polyomino>=27 && polyomino<=31){
        return side === 0 ? Images.polyominoType2_1A : Images.polyominoType2_1B
    } else if (polyomino >=32 && polyomino <=36){
        return side === 0 ? Images.polyominoType2_2A : Images.polyominoType2_2B
    } else if (polyomino >= 37 && polyomino <=41){
        return side === 0 ? Images.polyominoType2_3A : Images.polyominoType2_3B
    } else if (polyomino>=42 && polyomino <=46){
        return side === 0 ? Images.polyominoType2_4A : Images.polyominoType2_4B
    } else if (polyomino>=47 && polyomino <=51){
        return side === 0 ? Images.polyominoType2_5A : Images.polyominoType2_5B

    } else if (polyomino === 52){
        return side === 0 ? Images.polyominoType3_1A : Images.polyominoType3_1B
    } else if (polyomino === 53){
        return side === 0 ? Images.polyominoType3_2A : Images.polyominoType3_2B
    } else if (polyomino === 54){
        return side === 0 ? Images.polyominoType3_3A : Images.polyominoType3_3B
    } else if (polyomino === 55){
        return side === 0 ? Images.polyominoType3_4A : Images.polyominoType3_4B
    } else if (polyomino === 56){
        return side === 0 ? Images.polyominoType3_5A : Images.polyominoType3_5B
    } else if (polyomino === 57){
        return side === 0 ? Images.polyominoType3_6A : Images.polyominoType3_6B
    } else if (polyomino === 58){
        return side === 0 ? Images.polyominoType3_7A : Images.polyominoType3_7B
    } else if (polyomino === 59){
        return side === 0 ? Images.polyominoType3_8A : Images.polyominoType3_8B
    } else if (polyomino === 60){
        return side === 0 ? Images.polyominoType3_9A : Images.polyominoType3_9B
    } else if (polyomino === 61){
        return side === 0 ? Images.polyominoType3_10A : Images.polyominoType3_10B

    } else if (polyomino === 62){
        return side === 0 ? Images.polyominoType4_1A : Images.polyominoType4_1B
    } else if (polyomino === 63){
        return side === 0 ? Images.polyominoType4_2A : Images.polyominoType4_2B
    } else if (polyomino === 64){
        return side === 0 ? Images.polyominoType4_3A : Images.polyominoType4_3B
    } else if (polyomino === 65){
        return side === 0 ? Images.polyominoType4_4A : Images.polyominoType4_4B
    } else if (polyomino === 66){
        return side === 0 ? Images.polyominoType4_5A : Images.polyominoType4_5B
    } else if (polyomino === 67){
        return side === 0 ? Images.polyominoType4_6A : Images.polyominoType4_6B
    } else if (polyomino === 68){
        return side === 0 ? Images.polyominoType4_7A : Images.polyominoType4_7B
    } else if (polyomino === 69){
        return side === 0 ? Images.polyominoType4_8A : Images.polyominoType4_8B
    } else if (polyomino === 70){
        return side === 0 ? Images.polyominoType4_9A : Images.polyominoType4_9B
    } else if (polyomino === 71){
        return side === 0 ? Images.polyominoType4_10A : Images.polyominoType4_10B
    
    } else if (polyomino === 72){
        return Images.polyominoType5_1
    } else if (polyomino === 73){
        return Images.polyominoType5_2
    } else if (polyomino === 74){
        return Images.polyominoType5_3
    } else if (polyomino === 75){
        return Images.polyominoType5_4
    } else if (polyomino === 76){
        return Images.polyominoType5_5

    } else {
        return ''
    }

}

export default Polyomino