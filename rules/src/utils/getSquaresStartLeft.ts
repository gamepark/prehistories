import {allPolyominos} from "../material/Polyominos";
import Coordinates from "../types/Coordinates";
import PlacedTile from "../types/PlacedTile";
import {PaintedSquare} from "../types/Polyomino"

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