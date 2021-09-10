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
                           css = {[polyominoToHuntPosition(index, numberOfPlayers, polyomino), polyominoToHuntSize(index, numberOfPlayers, polyomino, game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0, 6,12)]}
                           polyomino={polyomino} 
                           side={game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0}
                           draggable={isPolyominoHuntable(game.players.find(p => p.color === playerId), game.phase, index, game.players.length,game.sortedPlayers !== undefined ? game.sortedPlayers[0] : undefined)}
                           type={'PolyominoToHunt'}
                           draggableItem={{type:"PolyominoToHunt", huntSpot:index, polyomino, side:(game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0)}}
                           onClick = {() => playSetSelectedPolyomino(setSelectedPolyominoMove({polyomino, huntSpot:index, side:game.polyominoSelected?.polyomino === polyomino ? game.polyominoSelected.side : 0, type:"PolyominoToHunt"}), {local:true})}
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
    width:24%;
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
            return players < 4 ? 7 : 4
        case 1 :
            return players < 4 ? 14 : 15
        case 2 :
            return players < 4 ? 38 : 5.5
        case 3 :
            return players < 4 ? 64 : 21
        case 4 :
            return players < 4 ? 80 : 41
        case 5 :
            return players < 4 ? 0 : 67
        case 6 :
            return players < 4 ? 0 : 82
        default :
            return 0
    } 
}

function getLeft(pos:number, players:number):number{
    switch (pos){
        case 0 :
            return players < 4 ? 20 : 10
        case 1 :
            return players < 4 ? 53 : 4
        case 2 :
            return players < 4 ? 44 : 43
        case 3 :
            return players < 4 ? 6 : 72
        case 4 :
            return players < 4 ? 68 : 45
        case 5 :
            return players < 4 ? 0 : 5
        case 6 :
            return players < 4 ? 0 : 68
        default :
            return 0
    } 
}

const polyominoToHuntSize = (pos:number, players:number, polyomino:number, side:(0|1), sizeBaseH:number, sizeBaseW:number) => {
    return tileSize(polyomino, side, sizeBaseW, sizeBaseH)    
}

function getRotate(pos:number, players:number):number{
        switch (pos){
        case 0 :
            return players < 4 ? -40 : -20
        case 1 :
            return players < 4 ? 30 : 8
        case 2 :
            return players < 4 ? -10 : 100
        case 3 :
            return players < 4 ? 20 : -15
        case 4 :
            return players < 4 ? -22 : -10
        case 5 :
            return players < 4 ? 0 : 20
        case 6 :
            return players < 4 ? 0 : -22
        default :
            return 0
    } 
}

export default HuntingZone