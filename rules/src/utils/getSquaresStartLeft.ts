import {allPolyominos} from "../material/Polyominos";
import PlacedTile from "../types/PlacedTile";
import {PaintedSquare} from "../types/Polyomino"

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