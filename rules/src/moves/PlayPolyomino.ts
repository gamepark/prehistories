import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import Coordinates from "../types/Coordinates";
import { HuntPhase } from "../types/Phase";
import powerLevels from "../utils/powerLevels";
import Move from "./Move";
import MoveType from "./MoveType";

type PlayPolyomino = {
    type:MoveType.PlayPolyomino
    polyomino:number
    side:0|1
    square:Coordinates
    huntSpot:number
}

export default PlayPolyomino

export function playPolyomino(state:GameState | GameView, move:PlayPolyomino){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === state.sortedPlayers![0])! : state.players.find(p => p.color === state.sortedPlayers![0])!
    const polyomino :number| null = state.huntingBoard[move.huntSpot]
    if (polyomino === null){
        throw("error : trying to paint a null polyomino !")
    } else {
        player.cave.push({polyomino, side:move.side, x:move.square.x, y:move.square.y})
        player.huntSpotTakenLevels = powerLevels(state.players.length,move.huntSpot)
        player.huntPhase = HuntPhase.Pay
        player.tilesHunted = player.tilesHunted === undefined ? 1 : player.tilesHunted++
    }
    state.huntingBoard[move.huntSpot] = null
}

export function isPlayPolyomino(move: Move):move is PlayPolyomino{
    return move.type === MoveType.PlayPolyomino
}