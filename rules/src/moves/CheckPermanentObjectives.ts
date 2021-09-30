import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor from "../PlayerColor";
import Coordinates from "../types/Coordinates";
import { HuntPhase } from "../types/Phase";
import { getOccupiedSquares } from "../utils/getSquaresStartLeft";
import Move from "./Move";
import MoveType from "./MoveType";

type CheckPermanentObjectives = {
    type:MoveType.CheckPermanentObjectives
    playerId:PlayerColor
}

export default CheckPermanentObjectives

export function checkPermanentObjectives(state:GameState|GameView, move:CheckPermanentObjectives){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    const lastTilePlayed = player.cave[player.cave.length-1]
    const squaresPainted : Coordinates[] = []
    allPolyominos[lastTilePlayed.polyomino][0].coordinates.forEach(coord => {
        squaresPainted.push({x:coord.x+lastTilePlayed.x,y:coord.y+lastTilePlayed.y})
    }) 
    const linesChecked :number[] = []
    const columnsChecked :number[] = []
    const occupiedSquares :Coordinates[] = getOccupiedSquares(player.cave)
    squaresPainted.forEach(square => {      
        if(linesChecked.find(x => square.x === x) === undefined){               // Don't check same lines in the same loop !
            if ([0,1,2,3,4,5,6].every(y => occupiedSquares.find(occ => occ.x === square.x && occ.y === y) !== undefined)){
                player.totemTokens--
            }
            linesChecked.push(square.x)
        }
        if(columnsChecked.find(y => square.y === y) === undefined){
            if ([0,1,2,3,4,5,6].every(x => occupiedSquares.find(occ => occ.y === square.y && occ.x === x) !== undefined)){
                player.totemTokens--
            }
            columnsChecked.push(square.y)
        }
    })
    if (lastTilePlayed.polyomino >= 72){
        player.totemTokens--
    }
    player.huntPhase = HuntPhase.VariableObjectives

}