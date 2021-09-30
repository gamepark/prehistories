/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView, { getPlayers } from "@gamepark/prehistories/GameView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt";
import Phase, { HuntPhase } from "@gamepark/prehistories/types/Phase";
import { isPlayerHuntView, isPlayerViewSelf, PlayerHuntView, PlayerView, PlayerViewSelf } from "@gamepark/prehistories/types/PlayerView";
import powerLevels from "@gamepark/prehistories/utils/powerLevels";
import teamPower from "@gamepark/prehistories/utils/teamPower";
import { usePlay, usePlayerId } from "@gamepark/react-client";
import { FC } from "react";
import SetSelectedPolyomino, { setSelectedPolyominoMove } from "../localMoves/setSelectedPolyomino";
import Images from "../utils/Images";
import { tileSize } from "./Cave";
import Polyomino from "./Polyomino";

type Props = {
    game:GameView
    numberOfPlayers:number
}

const HuntingZone : FC<Props> = ({game, numberOfPlayers}) => {

    const playerId = usePlayerId<PlayerColor>()

    return(

        <div css={[huntingZonePosition, huntingZoneStyle, numberOfPlayers < 4 ? bG23Players : bG45Players]}>

            {game.huntingBoard.map((polyomino, index) => 
            
                polyomino !== null && <Polyomino 
                           key = {index}
                           css = {[polyominoToHuntSize(index, numberOfPlayers, polyomino, (game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0), 8,16), polyominoToHuntPosition(index, numberOfPlayers, polyomino, (game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0))]}
                           polyomino={polyomino} 
                           draggable={isPolyominoHuntable(game.players.find(p => p.color === playerId), game.phase, index, game.players.length,game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined)}
                           type={'PolyominoToHunt'}
                           draggableItem={{type:"PolyominoToHunt", huntSpot:index, polyomino, side:(game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0)}}
                           isAlreadyPlaced = {false}
                           phase = {game.phase}
                           huntPosition={index}
                           nbPlayers = {numberOfPlayers}
                           polyominoSelected = {game.polyominoSelected}
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
    && teamPower(player.played) >= powerLevels(nbPlayers, huntSpot)[0]
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

const huntingZoneStyle = css`

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