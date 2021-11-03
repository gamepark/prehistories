import GameState from "../GameState";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor, { playerColors } from "../PlayerColor";
import PlayerState from "../PlayerState";
import PlacedTile from "../types/PlacedTile";
import Phase from "../types/Phase";
import getSquaresStartLeft, { getFreeSquaresFromPath, getOccupiedSquares } from "../utils/getSquaresStartLeft";
import Coordinates from "../types/Coordinates";

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

    const answer1_1:Coordinates[] = []
    const answer2_1:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4}]
    const answer3_1:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4}]
    const answer4_1:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4}]
    const answer5_1:Coordinates[] = [{x:6,y:0},{x:6,y:1},{x:5,y:1},{x:5, y:2}]
    const answer6_1:Coordinates[] = [{x:3,y:0},{x:3,y:1},{x:4,y:1},{x:5,y:1},{x:4,y:2}]

    test('getSquaresStartLeft', () => {
        expect(getSquaresStartLeft(cave1)).toEqual(expect.arrayContaining(answer1_1))
        expect(getSquaresStartLeft(cave1).length).toBe(answer1_1.length)
        expect(getSquaresStartLeft(cave2)).toEqual(expect.arrayContaining(answer2_1))
        expect(getSquaresStartLeft(cave2).length).toBe(answer2_1.length)
        expect(getSquaresStartLeft(cave3)).toEqual(expect.arrayContaining(answer3_1))
        expect(getSquaresStartLeft(cave3).length).toBe(answer3_1.length)
        expect(getSquaresStartLeft(cave4)).toEqual(expect.arrayContaining(answer4_1))
        expect(getSquaresStartLeft(cave4).length).toBe(answer4_1.length)
        expect(getSquaresStartLeft(cave5)).toEqual(expect.arrayContaining(answer5_1))
        expect(getSquaresStartLeft(cave5).length).toBe(answer5_1.length)
        expect(getSquaresStartLeft(cave6)).toEqual(expect.arrayContaining(answer6_1))
        expect(getSquaresStartLeft(cave6).length).toBe(answer6_1.length)

    })
    
    const answer1_2:Coordinates[] = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0}]
    const answer2_2:Coordinates[] = [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:1,y:3},{x:2,y:3},{x:2,y:4},{x:3,y:5},{x:4,y:5},{x:5,y:5},{x:6,y:4},{x:5,y:3},{x:4,y:3},{x:4,y:2},{x:3,y:1},{x:2,y:1},{x:2,y:0}]
    const answer3_2:Coordinates[] = [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:1,y:5},{x:2,y:4},{x:2,y:3},{x:3,y:3},{x:4,y:3},{x:4,y:4},{x:5,y:5},{x:6,y:4},{x:6,y:3},{x:6,y:1},{x:5,y:0},{x:4,y:1},{x:3,y:1},{x:2,y:1},{x:2,y:0}]
    const answer4_2:Coordinates[] = [{x:0,y:0},{x:0,y:1},{x:0,y:2},{x:0,y:3},{x:0,y:4},{x:1,y:5},{x:2,y:5},{x:3,y:5},{x:4,y:5},{x:5,y:5},{x:6,y:4},{x:6,y:3},{x:6,y:0},{x:5,y:0},{x:4,y:1},{x:3,y:1},{x:2,y:1},{x:2,y:0},{x:4,y:3},{x:3,y:3},{x:2,y:3}]
    const answer6_2:Coordinates[] = [{x:2,y:0},{x:2,y:1},{x:3,y:2},{x:4,y:3},{x:5,y:2},{x:6,y:1},{x:5,y:0},{x:4,y:0}]

    test('getFreeSquaresFromPath', () => {
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave1), cave1)).toEqual(expect.arrayContaining(answer1_2))
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave1), cave1).length).toBe(answer1_2.length)
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave2), cave2)).toEqual(expect.arrayContaining(answer2_2))
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave2), cave2).length).toBe(answer2_2.length)
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave3), cave3)).toEqual(expect.arrayContaining(answer3_2))
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave3), cave3).length).toBe(answer3_2.length)
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave4), cave4)).toEqual(expect.arrayContaining(answer4_2))
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave4), cave4).length).toBe(answer4_2.length)
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave6), cave6)).toEqual(expect.arrayContaining(answer6_2))
        expect(getFreeSquaresFromPath(getSquaresStartLeft(cave6), cave6).length).toBe(answer6_2.length)
    })

})

const anyState: GameState = {
    goals:[],
    huntingBoard:[],
    phase:Phase.Initiative,
    tilesDeck:[],
    players:[]
}
