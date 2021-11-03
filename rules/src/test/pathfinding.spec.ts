import {allPolyominos} from "../material/Polyominos";
import PlacedTile from "../types/PlacedTile";
import {getOccupiedSquares} from "../utils/getSquaresStartLeft";

describe('Test Pathfinding', () => {

    const polyominosArray :number[] = Array.from(allPolyominos.keys())
    const cave1:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:1, y:1},
        {tile:polyominosArray[1],side:0, x:5, y:4},
        {tile:polyominosArray[0],side:0, x:3, y:2}
    ]
    const cave2:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:1, y:1},
        {tile:polyominosArray[1],side:0, x:5, y:4},
        {tile:polyominosArray[0],side:0, x:3, y:2},
        {tile:polyominosArray[2],side:0, x:1, y:0},
        {tile:polyominosArray[27],side:1, x:1, y:2},
        {tile:polyominosArray[28],side:0, x:1, y:5},
        {tile:polyominosArray[53],side:1, x:3, y:3},

    ]

    const cave3:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:1, y:1},
        {tile:polyominosArray[1],side:0, x:5, y:4},
        {tile:polyominosArray[0],side:0, x:3, y:2},
        {tile:polyominosArray[2],side:0, x:1, y:0},
        {tile:polyominosArray[3],side:0, x:6, y:2},
        {tile:polyominosArray[6],side:0, x:5, y:3},
        {tile:polyominosArray[32],side:1, x:1, y:2},
        {tile:polyominosArray[33],side:0, x:1, y:3},
        {tile:polyominosArray[55],side:0, x:4, y:1},
        {tile:polyominosArray[28],side:0, x:3, y:5},
    ]

    const cave4:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:1, y:1},
        {tile:polyominosArray[1],side:0, x:5, y:4},
        {tile:polyominosArray[0],side:0, x:3, y:2},
        {tile:polyominosArray[2],side:0, x:1, y:0},
        {tile:polyominosArray[3],side:0, x:3, y:6},
        {tile:polyominosArray[4],side:0, x:5, y:6},
        {tile:polyominosArray[27],side:1, x:1, y:4},
        {tile:polyominosArray[28],side:1, x:3, y:4},
        {tile:polyominosArray[52],side:0, x:4, y:2},
        {tile:polyominosArray[54],side:0, x:5, y:1},
        {tile:polyominosArray[57],side:1, x:1, y:2},
    ]

    const cave5:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:1, y:1},
        {tile:polyominosArray[1],side:0, x:5, y:4},
        {tile:polyominosArray[0],side:0, x:3, y:2},
        {tile:polyominosArray[62],side:1, x:5, y:0},
    ]

    const cave6:PlacedTile[] = [
        {tile:polyominosArray[1],side:0, x:5, y:1},
        {tile:polyominosArray[1],side:0, x:2, y:5},
        {tile:polyominosArray[0],side:0, x:3, y:3},
        {tile:polyominosArray[66],side:0, x:3, y:0},
    ]

    test('getOccupiedSquares', () => {
        expect(getOccupiedSquares(cave1).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:1, y:1},{x:5, y:4},{x:3, y:2}]))
        expect(getOccupiedSquares(cave1).length).toBe([{x:1, y:1},{x:5, y:4},{x:3, y:2}].length)
        expect(getOccupiedSquares(cave2).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:1,y:5},{x:1,y:6}]))
        expect(getOccupiedSquares(cave2).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:1,y:5},{x:1,y:6}].length)
        expect(getOccupiedSquares(cave3).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:3,y:5},{x:3,y:6}]))
        expect(getOccupiedSquares(cave3).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:3,y:5},{x:3,y:6}].length)
        expect(getOccupiedSquares(cave4).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:3,y:6},{x:5,y:6}]))
        expect(getOccupiedSquares(cave4).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:3,y:6},{x:5,y:6}].length)
        expect(getOccupiedSquares(cave5).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:1,y:1},{x:5,y:4},{x:3,y:2},{x:6,y:0},{x:6,y:1},{x:5,y:1},{x:5, y:2}]))
        expect(getOccupiedSquares(cave5).length).toBe([{x:1,y:1},{x:5,y:4},{x:3,y:2},{x:6,y:0},{x:6,y:1},{x:5,y:1},{x:5, y:2}].length)
        expect(getOccupiedSquares(cave6).map(square => ({x:square.x,y:square.y}))).toEqual(expect.arrayContaining([{x:5,y:1},{x:2,y:5},{x:3,y:3},{x:3,y:0},{x:3,y:1},{x:4,y:1},{x:4,y:2}]))
        expect(getOccupiedSquares(cave6).length).toBe([{x:5,y:1},{x:2,y:5},{x:3,y:3},{x:3,y:0},{x:3,y:1},{x:4,y:1},{x:4,y:2}].length)
    })
})
