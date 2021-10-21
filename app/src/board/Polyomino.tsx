/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import Move from "@gamepark/prehistories/moves/Move";
import PlayPolyomino, { isPlayPolyomino } from "@gamepark/prehistories/moves/PlayPolyomino";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { useAnimation, usePlay } from "@gamepark/react-client";
import { FC, HTMLAttributes } from "react";
import Images from "../utils/Images";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt"
import { Draggable } from "@gamepark/react-components";
import Phase from "@gamepark/prehistories/types/Phase";
import { DropTargetMonitor, useDrop } from "react-dnd";
import SetSelectedPolyomino, { setSelectedPolyominoMove } from "../localMoves/setSelectedPolyomino";

type Props = {
    polyomino:number
    side?:0|1
    color?:PlayerColor
    draggable?:boolean
    type?:'PolyominoToHunt'
    draggableItem?:PolyominoToHunt
    isAlreadyPlaced:boolean
    phase:Phase | undefined
    huntPosition?:number
    nbPlayers?:number
    polyominoSelected?:PolyominoToHunt
    indexOfDisplayedPlayer?:number
    indexListDisplayedPlayers?:PlayerColor[]
} & Omit<HTMLAttributes<HTMLDivElement>, 'color'>

const Polyomino : FC<Props> = ({polyomino, side, color, draggable = false, type='', draggableItem, isAlreadyPlaced, phase, huntPosition, nbPlayers, polyominoSelected, indexOfDisplayedPlayer, indexListDisplayedPlayers, ...props}) => {

    const play = usePlay<Move>()
    const item = {...draggableItem}
    const onDrop = (move:PlayPolyomino) => {
        play(move)
    }
    const playSetSelectedPolyomino = usePlay<SetSelectedPolyomino>()

    const [{isDragging}, ref] = useDrop({           // Only to check the item currently dragged
        accept: ["PolyominoToHunt"],
        canDrop: (item: PolyominoToHunt) => {
            return item.polyomino === polyomino && item.huntSpot === huntPosition
        },
        collect: (monitor:DropTargetMonitor) => ({
          isDragging: monitor.canDrop(),
        }),
      })

      const playPolyominoAnimation = useAnimation<PlayPolyomino>(animation => isPlayPolyomino(animation.move))
      

    return(
        <Draggable canDrag={draggable}
                   type={type}
                   item={item}
                   drop={onDrop}
                   {...props}
                   css={[polyominoSize, playPolyominoAnimation !== undefined && huntPosition !== undefined && playPolyominoAnimation.move.huntSpot === huntPosition && nbPlayers !== undefined && indexListDisplayedPlayers !== undefined && playPolyominoAnimationStyle(playPolyominoAnimation.duration, indexOfDisplayedPlayer, indexListDisplayedPlayers, playPolyominoAnimation.move.playerId,playPolyominoAnimation.move.square.x,playPolyominoAnimation.move.square.y)]}
                   onClick = {() => huntPosition !== undefined && side === undefined && playSetSelectedPolyomino(setSelectedPolyominoMove({polyomino, huntSpot:huntPosition, side:polyominoSelected?.polyomino === polyomino ? polyominoSelected.side : 0, type:"PolyominoToHunt"}), {local:true})}
                   >

                <div css={[css`position:absolute;width:100%;height:100%;`, flipTile(polyominoSelected, polyomino, playPolyominoAnimation?.move.side, playPolyominoAnimation?.move.polyomino) ]}> 

                    <div ref={ref} 
                         css={[
                             css`position:absolute;width:100%;height:100%;`,
                             frontSide,
                             huntPosition !== undefined && nbPlayers !== undefined && displayHuntPolyomino(isDragging, huntPosition, polyomino, nbPlayers, side ?? 0, "front", playPolyominoAnimation !== undefined && playPolyominoAnimation.move.huntSpot === huntPosition),
                             polyominoStyle(color ? getColoredPolyominoImage(polyomino, color!): getPolyominoImage(polyomino, side ?? 0)),
                             dragStyle(draggable, isAlreadyPlaced, phase === Phase.Hunt, polyomino === polyominoSelected?.polyomino),
                             ]}>

                    </div>

                    {side === undefined && <div ref={ref} css={[css`position:absolute;width:100%;height:100%;`, backSide, huntPosition !== undefined && nbPlayers !== undefined && displayHuntPolyomino(isDragging, huntPosition, polyomino, nbPlayers, 1, "back", playPolyominoAnimation !== undefined && playPolyominoAnimation.move.huntSpot === huntPosition), polyominoStyle(color ? getColoredPolyominoImage(polyomino, color!): getPolyominoImage(polyomino, 1)), dragStyle(draggable, isAlreadyPlaced, phase === Phase.Hunt, polyomino === polyominoSelected?.polyomino)]}>

                    </div>}

                </div>

        </Draggable>
    )

}

const playPolyominoKeyframes = (isGoodDisplayedCave:number|undefined, indexListDisplayedPlayers:PlayerColor[], player:PlayerColor,x:number,y:number) => keyframes`
from{
    transform:scale(0.6);
}
20%{
    transform:scale(1.3);
}
80%,to{
    transform:scale(${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 1 : 0});
    top:${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 26.5 + x*5.3: 32+((indexListDisplayedPlayers.findIndex(p => p === player)-1))*15 }em;
    left:${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 47.5 +y*5.2: 150}em;
}
`

const playPolyominoAnimationStyle = (duration:number, isGoodDisplayedCave:number|undefined, indexListDisplayedPlayers:PlayerColor[], player:PlayerColor,x:number,y:number) => css`
z-index:10!important;
animation: ${playPolyominoKeyframes(isGoodDisplayedCave, indexListDisplayedPlayers, player,x,y)} ${duration}s ease-in;
`

const frontSide = css`
transform-style: preserve-3d;
backface-visibility:hidden;
`

const backSide = css`
transform-style: preserve-3d;
backface-visibility:hidden;
`

const flipTile = (select:PolyominoToHunt|undefined, polyomino:number|null, animationSide:0|1|undefined, animationPolyo:number|undefined) => css`
transform-style:preserve-3d;
transform:rotateY(${animationSide !== undefined && animationPolyo === polyomino ? 180*animationSide : select !== undefined && select.polyomino === polyomino && select?.side === 1 ? 180 : 0}deg);
transition:transform 0.2s linear, top 0.2s linear, left 0.2s linear;
`

const displayHuntPolyomino = (isDragging:boolean, pos:number, polyomino:number, nbPlayers:number, side:0|1, face:"front"|"back", isAnimation:boolean) => css`
transform:scale(0.8) rotateZ(${isDragging ||isAnimation ? 0 : getRotate(pos, nbPlayers, side, polyomino)}deg) rotateY(${face === "front" ? 0 : 180}deg);
transition:transform 0.1s linear;
`

const dragStyle = (draggable:boolean, isAlreadyPlaced: boolean, huntPhase:boolean, selected:boolean) => css`
${(huntPhase === false || isAlreadyPlaced === true) && `filter:drop-shadow(0 0 0.2em black);`}
${(huntPhase === true && isAlreadyPlaced === false && draggable === false) && `filter:drop-shadow(0 0 0.3em red);`}
${(huntPhase === true && isAlreadyPlaced === false && draggable === true) && `filter:drop-shadow(0 0 0.3em green);`}
${(huntPhase === true && isAlreadyPlaced === false && selected === true) && `filter:drop-shadow(0 0 0.3em white);`}
`

const polyominoSize = css`
width:100%;
height:100%;
`

const polyominoStyle = (image:string) => css`
background-image: url(${image});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
filter:drop-shadow(0 0 0.2em black);
`

function getRotate(pos:number, players:number, side:0|1, polyomino:number):number{
    switch (pos){
    case 0 :
        return players < 4 ? -40 - side*15 : -20 + side*40
    case 1 :
        return players < 4 ? (side === 0 ? 30 : 60) : 8 - side*20
    case 2 :
        return players < 4 ? getLRotation(polyomino, side) + (side === 0 ? -7 : 7) : (side === 0 ? 100 : -15)
    case 3 :
        return players < 4 ? (polyomino%2 === 0 ? getSRotation(polyomino, side) + (side === 0 ? 17 : -17) : getTRotation(polyomino, side) + (side === 0 ? 17 : -17) ) : (side === 0 ? -15 : -75)
    case 4 :
        return players < 4 ? (side === 0 ? -22 : 22) : getLRotation(polyomino, side) + (side === 0 ? -8 : 8)
    case 5 :
        return players < 4 ? 0 : (polyomino%2 === 0 ? getSRotation(polyomino, side) + (side === 0 ? 17 : -17) : getTRotation(polyomino, side) + (side === 0 ? 17 : -17) )
    case 6 :
        return players < 4 ? 0 : (side === 0 ? -22 : 22)
    default :
        return 0
    } 
}

function getSRotation(polyomino:number, side:0|1):number{
    if (polyomino === 62){
        return side === 0 ? 0 : 0
    }
    else if (polyomino === 64){
        return side === 0 ? -90 : 90
    }
    else if (polyomino === 66){
        return side === 0 ? -5 : 175
    }
    else if (polyomino === 68){
        return side === 0 ? -90 : 90
    }
    else if (polyomino === 70){
        return side === 0 ? -90 : 85
    } else return 0 
}

function getTRotation(polyomino:number, side:0|1):number{
    if (polyomino === 63){
        return side === 0 ? 90 : 88
    }
    else if (polyomino === 65){
        return side === 0 ? 90 : 90
    }
    else if (polyomino === 67){
        return side === 0 ? 0 : 180
    }
    else if (polyomino === 69){
        return side === 0 ? 90 : 180
    }
    else if (polyomino === 71){
        return side === 0 ? 0 : 180
    } else return 0 
}

function getLRotation(polyomino:number, side:0|1):number{
    if(polyomino%2 === 0){
        return side === 0 ? 0 : (polyomino === 56 || polyomino === 60 ? -180 : 90)
    } else {
        return side === 0 ? 90 : ((polyomino === 53 || polyomino === 55 || polyomino === 59) ? 180 : 90)
    }
}

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