/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import GameView, { getPlayers } from "@gamepark/prehistories/GameView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
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
    const playSetSelectedPolyomino = usePlay<SetSelectedPolyomino>()

    return(

        <div css={[huntingZonePosition, huntingZoneStyle, numberOfPlayers < 4 ? bG23Players : bG45Players]}>

            {game.huntingBoard.map((polyomino, index) => 
            
                polyomino !== null && <Polyomino key = {index}
                           css = {[polyominoToHuntPosition(index, numberOfPlayers, polyomino), polyominoToHuntSize(index, numberOfPlayers, polyomino, game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0, 8,16)]}
                           polyomino={polyomino} 
                           side={game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0}
                           draggable={isPolyominoHuntable(game.players.find(p => p.color === playerId), game.phase, index, game.players.length,game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined)}
                           type={'PolyominoToHunt'}
                           draggableItem={{type:"PolyominoToHunt", huntSpot:index, polyomino, side:(game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0)}}
                           onClick = {() => playSetSelectedPolyomino(setSelectedPolyominoMove({polyomino, huntSpot:index, side:game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0, type:"PolyominoToHunt"}), {local:true})}
                           isAlreadyPlaced = {false}
                           phase = {game.phase}
                           huntPosition={index}
                           nbPlayers = {numberOfPlayers}
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

const polyominoToHuntPosition = (position:number, numberOfPlayers:number, polyomino:number) => css`
position:absolute;
top:${getTop(position, numberOfPlayers)}%;
left:${getLeft(position, numberOfPlayers)}%;
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

function getTop(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 6.5 : 3
        case 1 :
            return players < 4 ? 14 : 13
        case 2 :
            return players < 4 ? 37 : 8
        case 3 :
            return players < 4 ? 64 : 21
        case 4 :
            return players < 4 ? 80 : 38
        case 5 :
            return players < 4 ? 0 : 65
        case 6 :
            return players < 4 ? 0 : 80
        default :
            return 0
    } 
}

function getLeft(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 14.7 : 7
        case 1 :
            return players < 4 ? 60 : 4
        case 2 :
            return players < 4 ? 37 : 44
        case 3 :
            return players < 4 ? 6 : 65
        case 4 :
            return players < 4 ? 60 : 38
        case 5 :
            return players < 4 ? 0 : 5
        case 6 :
            return players < 4 ? 0 : 60
        default :
            return 0
    } 
}

const polyominoToHuntSize = (pos:number, players:number, polyomino:number, side:(0|1), sizeBaseH:number, sizeBaseW:number) => {
    return tileSize(polyomino, side, sizeBaseW, sizeBaseH)    
}



export default HuntingZone