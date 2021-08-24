import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import PlayerColor from "../PlayerColor";
import Coordinates from "../types/Coordinates";
import {PlayerHuntView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type PlayPolyomino = {
    type:MoveType.PlayPolyomino
    polyomino:number
    side:0|1
    square:Coordinates
    huntSpot:number
    playerId:PlayerColor
}

export default PlayPolyomino

export function playPolyomino(state:GameState | GameView, move:PlayPolyomino){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    const polyomino :number| null = state.huntingBoard[move.huntSpot]
    if (polyomino === null){
        throw("error : trying to paint a null polyomino !")
    } else {
        player.cave.push({polyomino, side:move.side, x:move.square.x, y:move.square.y})
        player.tilesInHand = true
    }
    state.huntingBoard[move.huntSpot] = null
}