import GameState from "../GameState";
import { getColoredDeck } from "../material/Hunters";
import { allPolyominos } from "../material/Polyominos";
import PlayerColor, { playerColors } from "../PlayerColor";
import PlayerState from "../PlayerState";
import PaintedPolyominos from "../types/PaintedPolyominos";
import Phase from "../types/Phase";
import getSquaresStartLeft, { getOccupiedSquares } from "../utils/getSquaresStartLeft";
import {YellowHunters} from '../material/Hunters'
import Coordinates from "../types/Coordinates";

describe('Test getSquaresStartLeft.ts', () => {

    const polyominosArray :number[] = Array.from(allPolyominos.keys())
    const cave1:PaintedPolyominos[] = [
        {polyomino:polyominosArray[1],side:0, x:1, y:1},
        {polyomino:polyominosArray[1],side:0, x:5, y:4},
        {polyomino:polyominosArray[0],side:0, x:3, y:2}
    ]
    const cave2:PaintedPolyominos[] = [
        {polyomino:polyominosArray[1],side:0, x:1, y:1},
        {polyomino:polyominosArray[1],side:0, x:5, y:4},
        {polyomino:polyominosArray[0],side:0, x:3, y:2},
        {polyomino:polyominosArray[2],side:0, x:1, y:0},
        {polyomino:polyominosArray[27],side:1, x:1, y:2},
        {polyomino:polyominosArray[28],side:0, x:1, y:5},
        {polyomino:polyominosArray[53],side:0, x:3, y:3},

    ]

    const cave3:PaintedPolyominos[] = [
        {polyomino:polyominosArray[1],side:0, x:1, y:1},
        {polyomino:polyominosArray[1],side:0, x:5, y:4},
        {polyomino:polyominosArray[0],side:0, x:3, y:2},
        {polyomino:polyominosArray[2],side:0, x:1, y:0},
        {polyomino:polyominosArray[3],side:0, x:6, y:2},
        {polyomino:polyominosArray[6],side:0, x:5, y:3},
        {polyomino:polyominosArray[32],side:1, x:1, y:2},
        {polyomino:polyominosArray[33],side:0, x:1, y:3},
        {polyomino:polyominosArray[55],side:0, x:4, y:1},
        {polyomino:polyominosArray[28],side:0, x:3, y:5},
    ]

    const cave4:PaintedPolyominos[] = [
        {polyomino:polyominosArray[1],side:0, x:1, y:1},
        {polyomino:polyominosArray[1],side:0, x:5, y:4},
        {polyomino:polyominosArray[0],side:0, x:3, y:2},
        {polyomino:polyominosArray[2],side:0, x:1, y:0},
        {polyomino:polyominosArray[3],side:0, x:3, y:6},
        {polyomino:polyominosArray[4],side:0, x:5, y:6},
        {polyomino:polyominosArray[27],side:1, x:1, y:4},
        {polyomino:polyominosArray[28],side:1, x:3, y:4},
        {polyomino:polyominosArray[52],side:0, x:4, y:2},
        {polyomino:polyominosArray[54],side:0, x:5, y:1},
        {polyomino:polyominosArray[57],side:1, x:1, y:2},

    ]

    const answer1:Coordinates[] = [{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0},{x:4,y:0},{x:5,y:0},{x:6,y:0}]
    const answer2:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4}]
    const answer3:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4}]
    const answer4:Coordinates[] = [{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4}]

    test('getOccupiedSquares', () => {   
        expect(getOccupiedSquares(createGameWithCave(cave1, cave1), PlayerColor.Yellow)).toEqual(expect.arrayContaining([{x:1, y:1},{x:5, y:4},{x:3, y:2}]))
        expect(getOccupiedSquares(createGameWithCave(cave1, cave1), PlayerColor.Yellow).length).toBe([{x:1, y:1},{x:5, y:4},{x:3, y:2}].length)
        expect(getOccupiedSquares(createGameWithCave(cave2, cave2), PlayerColor.Yellow)).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:1,y:5},{x:1,y:6}]))
        expect(getOccupiedSquares(createGameWithCave(cave2, cave2), PlayerColor.Yellow).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:2,y:2},{x:3,y:2},{x:3,y:3},{x:3,y:4},{x:4,y:4},{x:5,y:4},{x:1,y:5},{x:1,y:6}].length)
        expect(getOccupiedSquares(createGameWithCave(cave3, cave3), PlayerColor.Yellow)).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:3,y:5},{x:3,y:6}]))
        expect(getOccupiedSquares(createGameWithCave(cave3, cave3), PlayerColor.Yellow).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:3,y:5},{x:3,y:6}].length)
        expect(getOccupiedSquares(createGameWithCave(cave4, cave4), PlayerColor.Yellow)).toEqual(expect.arrayContaining([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:3,y:6},{x:5,y:6}]))
        expect(getOccupiedSquares(createGameWithCave(cave4, cave4), PlayerColor.Yellow).length).toBe([{x:1,y:0},{x:1,y:1},{x:1,y:2},{x:1,y:3},{x:1,y:4},{x:2,y:2},{x:3,y:2},{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:1},{x:5,y:3},{x:5,y:4},{x:6,y:1},{x:2,y:4},{x:3,y:4},{x:4,y:4},{x:3,y:6},{x:5,y:6}].length)

    })

    test('getSquaresStartLeft', () => {
        expect(getSquaresStartLeft(createGameWithCave(cave1, cave1), PlayerColor.Yellow)).toEqual(expect.arrayContaining(answer1))
        expect(getSquaresStartLeft(createGameWithCave(cave1, cave1), PlayerColor.Yellow).length).toBe(answer1.length)
        expect(getSquaresStartLeft(createGameWithCave(cave2, cave2), PlayerColor.Yellow)).toEqual(expect.arrayContaining(answer2))
        expect(getSquaresStartLeft(createGameWithCave(cave2, cave2), PlayerColor.Yellow).length).toBe(answer2.length)
        expect(getSquaresStartLeft(createGameWithCave(cave3, cave3), PlayerColor.Yellow)).toEqual(expect.arrayContaining(answer3))
        expect(getSquaresStartLeft(createGameWithCave(cave3, cave3), PlayerColor.Yellow).length).toBe(answer3.length)
        expect(getSquaresStartLeft(createGameWithCave(cave4, cave4), PlayerColor.Yellow)).toEqual(expect.arrayContaining(answer4))
        expect(getSquaresStartLeft(createGameWithCave(cave4, cave4), PlayerColor.Yellow).length).toBe(answer4.length)
    })

})



const anyState: GameState = {
    goals:[],
    huntingBoard:[],
    phase:Phase.Initiative,
    tilesDeck:[],
    players:[]
}

function withCave(cave:PaintedPolyominos[], color:PlayerColor ):PlayerState{
    return {cave,color,deck:[],discard:[], goalsMade:[], hand:[], played:[], totemTokens:8}
}

function createGameWithCave(...caves:PaintedPolyominos[][]):GameState{
    return {
        ...anyState,
        players:caves.map((cave, index) => withCave(cave, playerColors[index]))
    }
}

function sum(a:number, b:number) {
    return a + b;
}