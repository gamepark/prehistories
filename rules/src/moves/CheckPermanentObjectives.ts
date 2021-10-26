import GameState from "../GameState";
import GameView from "../GameView";
import { allPolyominos } from "../material/Polyominos";
import PlayerState from "../PlayerState";
import Coordinates from "../types/Coordinates";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer, PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import { getOccupiedSquares } from "../utils/getSquaresStartLeft";
import Move from "./Move";
import MoveType from "./MoveType";

type ResolvePermanentObjectives = {
    type:MoveType.ResolvePermanentObjectives
    objectivesCompleted:[number[], number[], boolean];
}

export default ResolvePermanentObjectives

export function resolvePermanentObjectives(state:GameState|GameView, move:ResolvePermanentObjectives){
    const player = getFirstOfSortedPlayer(state)
    player.totemTokens = Math.max(0,player.totemTokens - (move.objectivesCompleted[0].length+move.objectivesCompleted[1].length+(move.objectivesCompleted[2] === true ? 1 : 0))) 
    player.huntingProps!.huntPhase = HuntPhase.CheckVariableObjectives
}

export function checkPermanentObjectives(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView): [number[],number[],boolean] {
    const lastTilePlayed = player.cave[player.cave.length-1]
    const squaresPainted : Coordinates[] = []
    const occupiedSquares :Coordinates[] = getOccupiedSquares(player.cave)
    
    allPolyominos[lastTilePlayed.polyomino][0].coordinates.forEach(coord => {
        squaresPainted.push({x:coord.x+lastTilePlayed.x,y:coord.y+lastTilePlayed.y})
    }) 
    
    const checked : {lines:number[], columns:number[]} = {lines:[],columns:[]}
    const completed : {lines:number[], columns:number[]} = {lines:[],columns:[]}

    squaresPainted.forEach((square, index) => {      
        if(!isLineAlreadyChecked(checked, square)){
            if (isEverySquareOfLinePainted(occupiedSquares, square)){
                completed.lines.push(index)
            }
            checked.lines.push(square.x)
        }
        if(!isColumnAlreadyChecked(checked, square)){
            if (isEverySquareOfColumnPainted(occupiedSquares, square)){
                checked.columns.push(square.x)
            }
            checked.columns.push(square.y)
        }
    })

    return [completed.lines, completed.columns, lastTilePlayed.polyomino >= 72] 

}

function isEverySquareOfColumnPainted(occupiedSquares: Coordinates[], square: Coordinates) {
    return [0, 1, 2, 3, 4, 5, 6].every(x => occupiedSquares.find(occ => occ.y === square.y && occ.x === x) !== undefined);
}

function isEverySquareOfLinePainted(occupiedSquares: Coordinates[], square: Coordinates) {
    return [0, 1, 2, 3, 4, 5, 6].every(y => occupiedSquares.find(occ => occ.x === square.x && occ.y === y) !== undefined);
}

function isColumnAlreadyChecked(checked: { lines: number[]; columns: number[]; }, square: Coordinates) {
    return checked.columns.find(y => square.y === y) !== undefined;
}

function isLineAlreadyChecked(checked: { lines: number[]; columns: number[]; }, square: Coordinates) {
    return checked.lines.find(x => square.x === x) !== undefined;
}

export function isResolvePermanentObjectives(move: Move):move is ResolvePermanentObjectives{
    return move.type === MoveType.ResolvePermanentObjectives
}