/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/prehistories/GameView'
import PlaceTile, {isPlaceTile} from '@gamepark/prehistories/moves/PlaceTile'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import Phase, {HuntPhase} from '@gamepark/prehistories/types/Phase'
import {isPlayerHuntView, isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf} from '@gamepark/prehistories/types/PlayerView'
import getPowerLevels from '@gamepark/prehistories/utils/powerLevels'
import teamPower from '@gamepark/prehistories/utils/teamPower'
import {useAnimation, usePlayerId, useSound} from '@gamepark/react-client'
import {FC, useState} from 'react'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import {placingBackground, setPercentDimension, toAbsolute} from '../utils/styles'
import MoveTileSound from '../sounds/moveTile.mp3'
import Images from '../utils/Images'
import {tileSize} from './Cave'
import Polyomino, {DraggedTile, HuntTile} from './Polyomino'
import {tiles} from "@gamepark/prehistories/material/Tile";

type Props = {
    game:GameView
    numberOfPlayers:number
    indexOfDisplayedPlayer:number
    indexListDisplayedPlayers:PlayerColor[]
}

const HuntingZone : FC<Props> = ({game, numberOfPlayers, indexOfDisplayedPlayer, indexListDisplayedPlayers}) => {

    const playerId = usePlayerId<PlayerColor>()
    const playPolyominoAnimation = useAnimation<PlaceTile>(animation => isPlaceTile(animation.move))
    const startHook:(0|1)[] = numberOfPlayers < 4 ? [0,0,0,0,0] : [0,0,0,0,0,0,0] 
    const moveTileSound = useSound(MoveTileSound)
    moveTileSound.volume = 0.5

    function createSideArray(index:number, side:number):(0|1)[]{
        moveTileSound.play()
        const array:(0|1)[] = numberOfPlayers < 4 ? [0,0,0,0,0] : [0,0,0,0,0,0,0] 
        array[index] = side === 0 ? 1 : 0
        return array
    }

    const [sideArray,setSideArray] = useState(startHook)

    const [{isDragging}] = useDrop({           // Only to check the item currently dragged
        accept: HuntTile,
        canDrop: (item: DraggedTile) => {
            return item !== null
        },
        collect: (monitor:DropTargetMonitor) => ({
          isDragging: monitor.getItem<DraggedTile>()
        }),
      })

    return(

        <div css={[toAbsolute, setPercentDimension(93,23.8), huntingZonePosition, placingBackground(numberOfPlayers < 4 ? Images.huntingBoard23Players : Images.huntingBoard45Players, "contain")]}>

            {game.huntingBoard.map((polyomino, index) => {
                let activePlayer = game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined
                return polyomino !== null && <Polyomino
                    key={index}
                    css={[ toAbsolute,
                           polyominoToHuntSize(polyomino, (playPolyominoAnimation !== undefined && playPolyominoAnimation?.move.huntSpot === index ? playPolyominoAnimation.move.side : sideArray[index]), 8, 16), polyominoToHuntPosition(index, numberOfPlayers, polyomino, sideArray[index]),
                           playPolyominoAnimation?.move.huntSpot === index && indexListDisplayedPlayers !== undefined && activePlayer !== undefined && playPolyominoAnimationStyle(playPolyominoAnimation.duration, indexOfDisplayedPlayer, indexListDisplayedPlayers, activePlayer, playPolyominoAnimation.move.coordinates.x, playPolyominoAnimation.move.coordinates.y),
                           displayHuntPolyomino(isDragging?.huntSpot === index, index, polyomino, numberOfPlayers, (sideArray[index]), playPolyominoAnimation?.move.huntSpot === index),
                    ]}
                    side={playPolyominoAnimation?.move.huntSpot === index ? playPolyominoAnimation.move.side : sideArray[index]}
                    tile={tiles[polyomino]}
                    canDrag={isPolyominoHuntable(game.players.find(p => p.color === playerId), game.phase, index, game.players.length, game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined)}
                    item={{huntSpot: index, polyomino, side: (sideArray[index])}}
                    onClick={() => setSideArray(createSideArray(index, sideArray[index]))}
                  />
              }
            )}

        </div>

    )

    

}

const displayHuntPolyomino = (isDragging:boolean, pos:number|undefined, polyomino:number, nbPlayers:number|undefined, side:0|1, isAnimation:boolean) => css`
    > div > div {
        &:nth-of-type(1){
            transform: scale(${pos === undefined ? 1 : 0.8}) rotateZ(${pos === undefined || nbPlayers === undefined || isDragging || isAnimation ? 0 : getRotate(pos, nbPlayers, side, polyomino)}deg) rotateY(0deg);
            transition:transform 0.2s linear;
        }
        &:nth-of-type(2){
            transform: scale(${pos === undefined ? 1 : 0.8}) rotateZ(${pos === undefined || nbPlayers === undefined || isDragging || isAnimation ? 0 : getRotate(pos, nbPlayers, side, polyomino)}deg) rotateY(180deg);
            transition:transform 0.2s linear;
        }
    }
`

function isPolyominoHuntable(player:(PlayerView|PlayerViewSelf|PlayerHuntView|undefined), phase:Phase|undefined, huntSpot:number, nbPlayers:number, firstPlayer:PlayerColor|undefined):boolean{
    return phase === Phase.Hunt 
    && player !== undefined 
    && firstPlayer !== undefined && player.color === firstPlayer
    && player.hunting?.huntPhase === HuntPhase.Hunt
    && (isPlayerHuntView(player) || isPlayerViewSelf(player)) 
    && teamPower(player.played) >= getPowerLevels(nbPlayers, huntSpot)[0]
}

const polyominoToHuntPosition = (position:number, numberOfPlayers:number, polyomino:number, side:0|1) => css`
    top:${getTop(position, numberOfPlayers, side, polyomino)}%;
    left:${getLeft(position, numberOfPlayers, side, polyomino)}%;
    transition:top 0.2s cubic-bezier(1,0,0,1), left 0.2s cubic-bezier(1,0,0,1), width 0.2s cubic-bezier(1,0,0,1), height 0.2s cubic-bezier(1,0,0,1);
`

const huntingZonePosition = css`
    top:7%;
    left:0.5%;
    border-radius:1em;
`
const polyominoToHuntSize = (polyomino:number, side:(0|1), sizeBaseH:number, sizeBaseW:number) => {
    return tileSize(polyomino, side, sizeBaseW, sizeBaseH)    
}

const playPolyominoKeyframes = (isGoodDisplayedCave: number | undefined, indexListDisplayedPlayers: PlayerColor[], player: PlayerColor, x: number, y: number) => keyframes`
    from {transform: scale(0.6);}
    20% {transform: scale(1.3);}
    80%,to {
        transform: scale(${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 0.92 : 0});
        top: ${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 28 + x * 5.2 : 32 + ((indexListDisplayedPlayers.findIndex(p => p === player) - 1)) * 15}em;
        left: ${isGoodDisplayedCave === indexListDisplayedPlayers.findIndex(p => p === player) ? 46.5 + y * 5.2 : 150}em;
    }
`

const playPolyominoAnimationStyle = (duration: number, isGoodDisplayedCave: number | undefined, indexListDisplayedPlayers: PlayerColor[], player: PlayerColor, x: number, y: number) => css`
    z-index: 10 !important;
    animation: ${playPolyominoKeyframes(isGoodDisplayedCave, indexListDisplayedPlayers, player, x, y)} ${duration}s ease-in infinite;
`

function getTop(pos:number, players:number, side:0|1, polyo:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 6.5 : 3
        case 1 :
            return players < 4 ? (side===0 ? 14 : 10) : 13
        case 2 :
            return players < 4 ? 37 : (side === 0 ? 8 : 4)
        case 3 :
            return players < 4 ? (polyo%2 === 0 ? getPosForSShape(polyo, side)[1] : getPosForTShape(polyo, side)[1]) : (side === 0 ? 21 : 17)
        case 4 :
            return players < 4 ? 80 : 38
        case 5 :
            return players < 4 ? 0 : (polyo%2 === 0 ? getPosForSShape(polyo, side)[1]+1.5 : getPosForTShape(polyo, side)[1]+1.5)
        case 6 :
            return players < 4 ? 0 : 80
        default :
            return 0
    } 
}

function getLeft(pos:number, players:number, side:0|1, polyo:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 14.7 : 7
        case 1 :
            return players < 4 ? (side === 0 ? 60 : 67) : 4
        case 2 :
            return players < 4 ? (side === 0 ? 37 : 38) : (side === 0 ? 44 : 52)
        case 3 :
            return players < 4 ? (polyo%2 === 0 ? getPosForSShape(polyo, side)[0] : getPosForTShape(polyo, side)[0]) : (side === 0 ? 65 : 73)
        case 4 :
            return players < 4 ? 60 : 38
        case 5 :
            return players < 4 ? 0 : (polyo%2 === 0 ? getPosForSShape(polyo, side)[0]-2 : getPosForTShape(polyo, side)[0]-2)
        case 6 :
            return players < 4 ? 0 : 60
        default :
            return 0
    } 
}

function getPosForTShape(polyo:number, side:0|1):number[]{
    if (polyo === 63){
        return side === 0 ? [12,59] : [14,59.5]
    }
    else if (polyo === 65){
        return side === 0 ? [12,59] : [14,59.5]
    }
    else if (polyo === 67){
        return side === 0 ? [6.5,64] : [6.5,63]
    }
    else if (polyo === 69){
        return side === 0 ? [12,59] : [6.5,63]
    }
    else if (polyo === 71){
        return side === 0 ? [6.5,64] : [6.5,63]
    } else return [0,0] 
}

function getPosForSShape(polyo:number, side:0|1):number[]{
    if (polyo === 62){
        return side === 0 ? [5,64] : [5,64]
    }
    else if (polyo === 64){
        return side === 0 ? [14,60] : [14,59.5]
    }
    else if (polyo === 66){
        return side === 0 ? [5,64] : [5,64]
    }
    else if (polyo === 68){
        return side === 0 ? [16.5,60] : [16,60]
    }
    else if (polyo === 70){
        return side === 0 ? [16.5,60] : [16,60]
    } else return [0,0] 
}

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


export default HuntingZone