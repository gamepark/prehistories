import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import Coordinates from "../types/Coordinates";
import { HuntPhase } from "../types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import { getOccupiedSquares } from "../utils/getSquaresStartLeft";
import Move from "./Move";
import MoveType from "./MoveType";

type ResolvePermanentObjectives = {
    type:MoveType.ResolvePermanentObjectives
    playerId:PlayerColor
    objectivesCompleted:[number[], number[], boolean];
}

export default ResolvePermanentObjectives

export function resolvePermanentObjectives(state:GameState|GameView, move:ResolvePermanentObjectives){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    player.totemTokens = Math.max(0,player.totemTokens - (move.objectivesCompleted[0].length+move.objectivesCompleted[1].length+(move.objectivesCompleted[2] === true ? 1 : 0))) 
    player.huntPhase = HuntPhase.CheckVariableObjectives
}

export function checkPermanentObjectives(state:GameState|GameView, player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): [number[],number[],boolean] {
    const lastTilePlayed = player.cave[player.cave.length-1]
    const squaresPainted : Coordinates[] = []
    allPolyominos[lastTilePlayed.polyomino][0].coordinates.forEach(coord => {
        squaresPainted.push({x:coord.x+lastTilePlayed.x,y:coord.y+lastTilePlayed.y})
    }) 
    const linesChecked :number[] = []
    const linesCompleted :number[] = []
    const columnsChecked :number[] = []
    const columnsCompleted :number[] = []

    const occupiedSquares :Coordinates[] = getOccupiedSquares(player.cave)
    squaresPainted.forEach((square, index) => {      
        if(linesChecked.find(x => square.x === x) === undefined){               // Don't check same lines in the same loop !
            if ([0,1,2,3,4,5,6].every(y => occupiedSquares.find(occ => occ.x === square.x && occ.y === y) !== undefined)){
                linesCompleted.push(index)
            }
            linesChecked.push(square.x)
        }
        if(columnsChecked.find(y => square.y === y) === undefined){
            if ([0,1,2,3,4,5,6].every(x => occupiedSquares.find(occ => occ.y === square.y && occ.x === x) !== undefined)){
                columnsCompleted.push(square.x)
            }
            columnsChecked.push(square.y)
        }
    })
    let result:[number[],number[],boolean] = [[],[],false] 
    if (lastTilePlayed.polyomino >= 72){
        result = [linesCompleted, columnsCompleted, true]
    } else {
        result = [linesCompleted, columnsCompleted, false]
    }
    return result

}

export function isResolvePermanentObjectives(move: Move):move is ResolvePermanentObjectives{
    return move.type === MoveType.ResolvePermanentObjectives
}