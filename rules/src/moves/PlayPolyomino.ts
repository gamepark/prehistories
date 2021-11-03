import GameState from "../GameState";
import GameView from "../GameView";
import Coordinates from "../types/Coordinates";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer } from "../types/PlayerView";
import getPowerLevels from "../utils/powerLevels";
import Move from "./Move";
import MoveType from "./MoveType";

type PlayPolyomino = {
    type:MoveType.PlayPolyomino
    polyomino:number        // TODO
    side:0|1
    square:Coordinates
    huntSpot:number
}

export default PlayPolyomino

export function playPolyomino(state:GameState | GameView, move:PlayPolyomino){
    const player = getFirstOfSortedPlayer(state)
    const polyomino :number| null = state.huntingBoard[move.huntSpot]
    if (polyomino === null){
        throw("error : trying to paint a null polyomino !")
    } else {
        player.cave.push({polyomino, side:move.side, x:move.square.x, y:move.square.y})
        player.hunting = {huntPhase:HuntPhase.Pay,
                               huntSpotTakenLevels:getPowerLevels(state.players.length,move.huntSpot),
                               injuries:player.hunting!.injuries,
                               tilesHunted:(player.hunting!.tilesHunted ?? 0)+1,
                              }
    }
    state.huntingBoard[move.huntSpot] = null
}

export function isPlayPolyomino(move: Move):move is PlayPolyomino{
    return move.type === MoveType.PlayPolyomino
}