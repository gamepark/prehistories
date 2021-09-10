import GameState from "../GameState"
import { getGoalsArray } from "../material/Goals"
import { allPolyominos } from "../material/Polyominos"
import PlayerColor, { playerColors } from "../PlayerColor"
import PlayerState from "../PlayerState"
import PaintedPolyominos from "../types/PaintedPolyominos"
import Phase from "../types/Phase"

describe('Test Objectives', () => {

    const polyominosArray :number[] = Array.from(allPolyominos.keys())
    const startCave:PaintedPolyominos[] = [
        {polyomino:polyominosArray[1],side:0, x:1, y:1},
        {polyomino:polyominosArray[1],side:0, x:5, y:4},
        {polyomino:polyominosArray[0],side:0, x:3, y:2}
    ]

    test('Objective1', () => {          // PathFinding between two totems

        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[72],side:0, x:3, y:3}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[72],side:0, x:2, y:3}
        ])

        expect(getGoalsArray(true)[0].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[0].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[0].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective2", () => {          // 3x3 central square filled
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[72],side:0, x:3, y:3},
            {polyomino:polyominosArray[67],side:0, x:1, y:2},
            {polyomino:polyominosArray[60],side:0, x:4, y:2}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[72],side:0, x:3, y:4},
            {polyomino:polyominosArray[67],side:0, x:1, y:2},
            {polyomino:polyominosArray[60],side:0, x:4, y:2}
        ])

        expect(getGoalsArray(true)[1].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[1].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[1].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective3", () => {          // column of 5 animals
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[72],side:0, x:5, y:0},
            {polyomino:polyominosArray[67],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:0, x:3, y:0}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[61],side:1, x:5, y:1},
            {polyomino:polyominosArray[67],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:0, x:3, y:0}
        ])

        expect(getGoalsArray(true)[2].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[2].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[2].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective4", () => {          // group of 8 same animals (no legend)
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:5, y:0},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:2, y:3},
            {polyomino:polyominosArray[60],side:0, x:3, y:0}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:5, y:0},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:5, y:2},
            {polyomino:polyominosArray[60],side:0, x:3, y:0}
        ])

        expect(getGoalsArray(true)[3].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[3].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[3].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective5", () => {          // surround hunter tile
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:3, y:2},
            {polyomino:polyominosArray[60],side:0, x:3, y:0}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:3, y:2},
            {polyomino:polyominosArray[60],side:0, x:5, y:3}
        ])

        expect(getGoalsArray(true)[4].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[4].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[4].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective6", () => {          // Column of 5 same animal no legend
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:5, y:1},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:3, y:2},
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:4},
            {polyomino:polyominosArray[58],side:0, x:1, y:2},
            {polyomino:polyominosArray[59],side:0, x:3, y:2},
        ])

        expect(getGoalsArray(true)[5].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[5].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[5].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)  
    })

    test("Objective7", () => {          // Pathfinding betwenn top left corner and bottom right corner
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:4, y:2},
            {polyomino:polyominosArray[58],side:0, x:5, y:5},
            {polyomino:polyominosArray[3],side:0, x:0, y:0}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:4, y:2},
            {polyomino:polyominosArray[58],side:0, x:5, y:5},
        ])

        expect(getGoalsArray(true)[6].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[6].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[6].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective8", () => {          // 5 tiles 1x1 built  
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            {polyomino:polyominosArray[4],side:1, x:0, y:1},
            {polyomino:polyominosArray[5],side:0, x:0, y:2},
            {polyomino:polyominosArray[6],side:1, x:0, y:3},
            {polyomino:polyominosArray[7],side:0, x:0, y:4}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            {polyomino:polyominosArray[4],side:1, x:0, y:1},
            {polyomino:polyominosArray[5],side:0, x:0, y:2},
            {polyomino:polyominosArray[6],side:1, x:0, y:3}
        ])

        expect(getGoalsArray(true)[7].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[7].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[7].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective9", () => {          // Surround a legendary tile
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:4, y:2},
            {polyomino:polyominosArray[58],side:0, x:3, y:5},
            {polyomino:polyominosArray[3],side:0, x:6, y:4},
            {polyomino:polyominosArray[73],side:0, x:5, y:5}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:0, x:3, y:2},
            {polyomino:polyominosArray[58],side:0, x:3, y:5},
            {polyomino:polyominosArray[3],side:0, x:6, y:4},
            {polyomino:polyominosArray[73],side:0, x:5, y:5}
        ])

        expect(getGoalsArray(true)[8].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[8].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[8].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective10", () => {          // Surround two totems
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:1, x:2, y:2},
            {polyomino:polyominosArray[67],side:1, x:4, y:2},
            {polyomino:polyominosArray[59],side:0, x:5, y:4},
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            {polyomino:polyominosArray[4],side:0, x:4, y:5},
            {polyomino:polyominosArray[5],side:0, x:6, y:3},
            
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:1, x:2, y:2},
            {polyomino:polyominosArray[67],side:1, x:4, y:2},
            {polyomino:polyominosArray[59],side:0, x:5, y:4},
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            {polyomino:polyominosArray[4],side:0, x:4, y:5},
        ])

        expect(getGoalsArray(true)[9].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[9].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[9].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)  
    })

    test("Objective11", () => {          // Fill the right column
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:4, y:5},
            {polyomino:polyominosArray[69],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:1, x:3, y:5},
            {polyomino:polyominosArray[67],side:1, x:0, y:4},
            {polyomino:polyominosArray[59],side:0, x:1, y:5},
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[69],side:1, x:0, y:1},
            {polyomino:polyominosArray[60],side:1, x:3, y:5},
            {polyomino:polyominosArray[67],side:1, x:0, y:4},
            {polyomino:polyominosArray[59],side:0, x:1, y:5},
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
        ])

        expect(getGoalsArray(true)[10].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[10].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[10].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective12", () => {          // Line of 5 different animals
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[60],side:1, x:0, y:4},
            {polyomino:polyominosArray[67],side:0, x:0, y:1},
            {polyomino:polyominosArray[3],side:0, x:1, y:6},
            
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:2},
            {polyomino:polyominosArray[60],side:1, x:0, y:4},
            {polyomino:polyominosArray[67],side:0, x:0, y:1},
        ])

        expect(getGoalsArray(true)[11].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[11].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[11].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective13", () => {          // Group of 10 same animal
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:2},
            {polyomino:polyominosArray[59],side:0, x:4, y:0}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:2},
            {polyomino:polyominosArray[59],side:0, x:4, y:1}
        ])

        expect(getGoalsArray(true)[12].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[12].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[12].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective14", () => {          // surround hunter with 4 different animals
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[3],side:0, x:2, y:2},
            {polyomino:polyominosArray[73],side:0, x:2, y:3},
            {polyomino:polyominosArray[67],side:1, x:4, y:1},
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:2},
            {polyomino:polyominosArray[59],side:0, x:4, y:1}
        ])

        expect(getGoalsArray(true)[13].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[13].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[13].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective15", () => {          // line of 5 same animals (no Legendary)
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:2, y:2},
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:3, y:3},
        ])

        expect(getGoalsArray(true)[14].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[14].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[14].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective16", () => {          // fill 4 corners
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:3, y:3},
            {polyomino:polyominosArray[64],side:0, x:4, y:0},
            {polyomino:polyominosArray[65],side:0, x:0, y:5},
            {polyomino:polyominosArray[63],side:0, x:4, y:5},
            {polyomino:polyominosArray[3],side:0, x:0, y:0},
            {polyomino:polyominosArray[4],side:0, x:3, y:6},
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:3, y:3},
            {polyomino:polyominosArray[64],side:0, x:4, y:0},
            {polyomino:polyominosArray[65],side:0, x:0, y:5},
            {polyomino:polyominosArray[63],side:0, x:4, y:5},
            {polyomino:polyominosArray[4],side:0, x:3, y:6},
        ])

        expect(getGoalsArray(true)[15].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[15].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[15].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
    })

    test("Objective18", () => {          // 2 legendary side by side
        const goodCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:3, y:3},
            {polyomino:polyominosArray[73],side:0, x:1, y:2},
            {polyomino:polyominosArray[74],side:0, x:1, y:4}
        ])
        const wrongCave:PaintedPolyominos[] = startCave.concat([
            {polyomino:polyominosArray[68],side:1, x:1, y:0},
            {polyomino:polyominosArray[69],side:1, x:3, y:3},
            {polyomino:polyominosArray[73],side:0, x:1, y:2},
            {polyomino:polyominosArray[74],side:0, x:0, y:4}
        ])

        expect(getGoalsArray(true)[17].rule(withCave(startCave, PlayerColor.Yellow))).toBe(false) 
        expect(getGoalsArray(true)[17].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true) 
        expect(getGoalsArray(true)[17].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false) 
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