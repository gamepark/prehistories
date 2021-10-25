/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView from "@gamepark/prehistories/GameView";
import PlayPolyomino, { isPlayPolyomino } from "@gamepark/prehistories/moves/PlayPolyomino";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { isPlayerHuntView, isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import getPowerLevels from "@gamepark/prehistories/utils/powerLevels";
import teamPower from "@gamepark/prehistories/utils/teamPower";
import { useAnimation, usePlayerId } from "@gamepark/react-client";
import { FC, useState } from "react";
import Images from "../utils/Images";
import { tileSize } from "./Cave";
import Polyomino from "./Polyomino";

type Props = {
    game:GameView
    numberOfPlayers:number
    indexOfDisplayedPlayer:number
    indexListDisplayedPlayers:PlayerColor[]
}

const HuntingZone : FC<Props> = ({game, numberOfPlayers, indexOfDisplayedPlayer, indexListDisplayedPlayers}) => {

    const playerId = usePlayerId<PlayerColor>()
    const playPolyominoAnimation = useAnimation<PlayPolyomino>(animation => isPlayPolyomino(animation.move))
    const startHook:(0|1)[] = numberOfPlayers < 4 ? [0,0,0,0,0] : [0,0,0,0,0,0,0] 

    function createSideArray(index:number, side:number):(0|1)[]{
        const array:(0|1)[] = numberOfPlayers < 4 ? [0,0,0,0,0] : [0,0,0,0,0,0,0] 
        array[index] = side === 0 ? 1 : 0
        return array
    }

    const [sideArray,setSideArray] = useState(startHook)

    return(

        <div css={[huntingZonePosition, numberOfPlayers < 4 ? bG23Players : bG45Players]}>

            {game.huntingBoard.map((polyomino, index) => 
            
                polyomino !== null && <Polyomino 
                           key = {index}
                           css = {[polyominoToHuntSize(index, numberOfPlayers, polyomino, (playPolyominoAnimation !== undefined && playPolyominoAnimation.move.huntSpot === index ? 1 : sideArray[index]), 8,16), polyominoToHuntPosition(index, numberOfPlayers, polyomino, sideArray[index])]}
                           side = {sideArray[index]}
                           polyomino={polyomino} 
                           draggable={isPolyominoHuntable(game.players.find(p => p.color === playerId), game.phase, index, game.players.length,game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined)}
                           type={'PolyominoToHunt'}
                           draggableItem={{type:"PolyominoToHunt", huntSpot:index, polyomino, side:(sideArray[index])}}
                           isAlreadyPlaced = {false}
                           phase = {game.phase}
                           huntPosition={index}
                           nbPlayers = {numberOfPlayers}
                           activePlayer = {game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined}
                           indexOfDisplayedPlayer={indexOfDisplayedPlayer}
                           indexListDisplayedPlayers={indexListDisplayedPlayers}

                           onClick={() => setSideArray(createSideArray(index, sideArray[index]))}
                />

            )}

        </div>

    )

    

}

function isPolyominoHuntable(player:(PlayerView|PlayerViewSelf|PlayerHuntView|undefined), phase:Phase|undefined, huntSpot:number, nbPlayers:number, firstPlayer:PlayerColor|undefined):boolean{

    return phase === Phase.Hunt 
    && player !== undefined 
    && firstPlayer !== undefined && player.color === firstPlayer
    && player.huntPhase === HuntPhase.Hunt
    && (isPlayerHuntView(player) || isPlayerViewSelf(player)) 
    && teamPower(player.played) >= getPowerLevels(nbPlayers, huntSpot)[0]
}

const polyominoToHuntPosition = (position:number, numberOfPlayers:number, polyomino:number, side:0|1) => css`
position:absolute;
top:${getTop(position, numberOfPlayers, side, polyomino)}%;
left:${getLeft(position, numberOfPlayers, side, polyomino)}%;
transition:top 0.1s linear, left 0.1s linear;
`

const huntingZonePosition = css`
    position:absolute;
    top:7%;
    left:0;
    width:24.5%;
    height:93%;
`

const bG23Players = css`
background-image: url(${Images.huntingBoard23Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
`

const bG45Players = css`
background-image: url(${Images.huntingBoard45Players});
background-size: contain;
background-repeat: no-repeat;
background-position: top;
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

const polyominoToHuntSize = (pos:number, players:number, polyomino:number, side:(0|1), sizeBaseH:number, sizeBaseW:number) => {
        return tileSize(polyomino, side, sizeBaseW, sizeBaseH)    
}



export default HuntingZone