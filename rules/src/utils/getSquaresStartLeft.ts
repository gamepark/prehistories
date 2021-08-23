import GameState from "../GameState";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor from "../PlayerColor";
import Coordinates from "../types/Coordinates";
import PaintedPolyominos from "../types/PaintedPolyominos";

function getSquaresStartLeft(state:GameState, color:PlayerColor):Coordinates[]{
    const cave:PaintedPolyominos[] = state.players.find(p => p.color === color)!.cave
    if (isFirstColumnEmpty(cave)){
        return [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0}]
    } else {
        const coordOfFirstTile = {x:cave.find(polyo => polyo.y === 0)!.x, y:cave.find(polyo => polyo.y === 0)!.y}
        return [coordOfFirstTile].concat(getTilesFromTarget(coordOfFirstTile, [coordOfFirstTile], getOccupiedSquares(state, color)))
    }
}

export default getSquaresStartLeft

function getTilesFromTarget(target:Coordinates,list:Coordinates[], occupiedSquares:Coordinates[]):Coordinates[]{
    const coordIterator:Coordinates[] = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}]
    const newList:Coordinates[] = []
    let result:Coordinates[] = []
    coordIterator.forEach(coord => {
        const newCoord = {x:target.x+coord.x,y:target.y+coord.y}
        if (occupiedSquares.find(tile => newCoord.x === tile.x && newCoord.y === tile.y) === undefined || (result.concat(list)).find(tile => newCoord.x === tile.x && newCoord.y === tile.y) !== undefined){
            // End 
        } else {
            newList.push(newCoord)
            result.push(newCoord)
            result = result.concat(getTilesFromTarget(newCoord,list.concat(newList),occupiedSquares))
        }
    })
    return result

}

export function isFirstColumnEmpty(cave:PaintedPolyominos[]):boolean{
    return cave.every(polyo => polyo.y !== 0)
}

export function getOccupiedSquares(state:GameState,color:PlayerColor):Coordinates[]{
    const result:Coordinates[] = []
    const cave = state.players.find(p => p.color === color)!.cave
    cave.forEach(paint => {
        const polyo = allPolyominos[paint.polyomino][paint.side]
        polyo.coordinates.forEach(coord => {
            result.push({x:paint.x+coord.x,y:paint.y+coord.y})
        })
    })

    return result
}