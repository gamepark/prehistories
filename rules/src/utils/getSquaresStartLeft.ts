import GameState from "../GameState";
import GameView from "../GameView";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor from "../PlayerColor";
import Animal from "../types/Animal";
import Coordinates from "../types/Coordinates";
import PlacedTile from "../types/PlacedTile";
import {PaintedSquare} from "../types/Polyomino"

function getSquaresStartLeft(cave:PlacedTile[]):Coordinates[]{
    if (isFirstColumnEmpty(cave)){
        return []
    } else {
        const coordOfFirstTile = {x:getOccupiedSquares(cave).find(polyo => polyo.y ===0)!.x, y:getOccupiedSquares(cave).find(polyo => polyo.y ===0)!.y}
        return [coordOfFirstTile].concat(getTilesFromTarget(coordOfFirstTile, [coordOfFirstTile], getOccupiedSquares(cave)))
    }
}

export default getSquaresStartLeft

export function getFreeSquaresFromPath(path:Coordinates[], cave:PlacedTile[]):Coordinates[]{
    const result:Coordinates[] = []
    const occupiedSquares:PaintedSquare[] = getOccupiedSquares(cave)
    if (path.length === 0){
        return [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0}]
    }
    path.forEach(tile => {
        [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}].forEach(coord => {
            const newCoord = {x:tile.x+coord.x,y:tile.y+coord.y}
            if (!isCoordOutOfBorders(newCoord) && isCoordFree(newCoord, occupiedSquares) && result.find(coord => coord.x === newCoord.x && coord.y === newCoord.y) === undefined){
                result.push(newCoord)
            }
        })
    })

    return result
}

export function isCoordOutOfBorders(coord:Coordinates):boolean{
    return coord.x < 0 || coord.x > 6 || coord.y < 0 || coord.y > 6
}

export function isCoordFree(coord:Coordinates, occupiedSquares:PaintedSquare[]):boolean{
    return occupiedSquares.every(square => square.x !== coord.x || square.y !== coord.y)
}

export function getTilesFromTarget(target:Coordinates,list:Coordinates[], occupiedSquares:PaintedSquare[]):Coordinates[]{
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

export function isFirstColumnEmpty(cave:PlacedTile[]):boolean{
    return getOccupiedSquares(cave).every(polyo => polyo.y !== 0)
}

export function getOccupiedSquares(cave:PlacedTile[]):PaintedSquare[]{
    const result:PaintedSquare[] = []
    cave.forEach(paint => {
        const polyo = allPolyominos[paint.tile][paint.side]
        polyo.coordinates.forEach(coord => {
            result.push({animal:polyo.animal, x:paint.x+coord.x,y:paint.y+coord.y})
        })
    })

    return result
}