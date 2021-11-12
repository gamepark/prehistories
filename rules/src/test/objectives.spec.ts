import {goals} from "../material/Goals"
import PlayerColor from "../PlayerColor"
import PlayerState from "../PlayerState"
import PlacedTile from "../types/PlacedTile"
import Tile from "../material/Tile";

describe('Test Objectives', () => {

  test('Objective1', () => {          // PathFinding between two totems

    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 3}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 2}
    ]

    expect(goals[0].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[0].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[0].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective2", () => {          // 3x3 central square filled
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 3},
      {tile: Tile.Ibex4B, side: 0, x: 2, y: 1},
      {tile: Tile.Boar3A, side: 0, x: 2, y: 4}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 4, y: 3},
      {tile: Tile.Ibex4B, side: 0, x: 2, y: 1},
      {tile: Tile.Boar3A, side: 0, x: 2, y: 4}
    ]

    expect(goals[1].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[1].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[1].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective3", () => {          // column of 5 animals
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 0, y: 5},
      {tile: Tile.Ibex4B, side: 1, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Boar3B, side: 1, x: 1, y: 5},
      {tile: Tile.Ibex4B, side: 1, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]

    expect(goals[2].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[2].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[2].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective4", () => {          // group of 8 same animals (no legend)
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 0, y: 5},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 3, y: 2},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 0, y: 5},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 5},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]

    expect(goals[3].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[3].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[3].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective5", () => {          // surround hunter tile
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
      {tile: Tile.Boar3A, side: 0, x: 3, y: 5}
    ]

    expect(goals[4].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[4].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[4].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective6", () => {          // Column of 5 same animal no legend
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 5},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 4, y: 2},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
    ]

    expect(goals[5].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[5].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[5].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective7", () => {          // Pathfinding betwenn top left corner and bottom right corner
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 5},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 5},
    ]

    expect(goals[6].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[6].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[6].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective8", () => {          // 5 tiles 1x1 built
    const goodCave: PlacedTile[] = [
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 1, x: 1, y: 0},
      {tile: Tile.Fish1, side: 0, x: 2, y: 0},
      {tile: Tile.Fish1, side: 1, x: 3, y: 0},
      {tile: Tile.Mammoth1, side: 0, x: 4, y: 0}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 1, x: 1, y: 0},
      {tile: Tile.Fish1, side: 0, x: 2, y: 0},
      {tile: Tile.Fish1, side: 1, x: 3, y: 0}
    ]

    expect(goals[7].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[7].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[7].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective9", () => {          // Surround a legendary tile
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 3},
      {tile: Tile.Fish1, side: 0, x: 4, y: 6},
      {tile: Tile.Legendary2, side: 0, x: 5, y: 5}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 1, x: 2, y: 3},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 3},
      {tile: Tile.Fish1, side: 0, x: 4, y: 6},
      {tile: Tile.Legendary2, side: 0, x: 5, y: 5}
    ]

    expect(goals[8].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[8].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[8].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective10", () => {          // Surround two totems
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 2, y: 2},
      {tile: Tile.Ibex4B, side: 1, x: 2, y: 4},
      {tile: Tile.Buffalo3B, side: 0, x: 4, y: 5},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 0, x: 5, y: 4},
      {tile: Tile.Fish1, side: 0, x: 3, y: 6},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 2, y: 2},
      {tile: Tile.Ibex4B, side: 1, x: 2, y: 4},
      {tile: Tile.Buffalo3B, side: 0, x: 4, y: 5},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 0, x: 5, y: 4},
    ]

    expect(goals[9].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[9].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[9].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective11", () => {          // Fill the right column
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 5, y: 4},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 5, y: 3},
      {tile: Tile.Ibex4B, side: 1, x: 4, y: 0},
      {tile: Tile.Buffalo3B, side: 0, x: 5, y: 1},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 5, y: 3},
      {tile: Tile.Ibex4B, side: 1, x: 4, y: 0},
      {tile: Tile.Buffalo3B, side: 0, x: 5, y: 1},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
    ]

    expect(goals[10].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[10].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[10].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective12", () => {          // Line of 5 different animals
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Boar3A, side: 1, x: 4, y: 0},
      {tile: Tile.Ibex4B, side: 0, x: 2, y: 0},
      {tile: Tile.Fish1, side: 0, x: 6, y: 1},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
      {tile: Tile.Boar3A, side: 1, x: 4, y: 0},
      {tile: Tile.Ibex4B, side: 0, x: 1, y: 0},
    ]

    expect(goals[11].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[11].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[11].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective13", () => {          // Group of 10 same animal
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
      {tile: Tile.Buffalo3B, side: 0, x: 0, y: 4}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
      {tile: Tile.Buffalo3B, side: 0, x: 1, y: 4}
    ]

    expect(goals[12].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[12].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[12].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective14", () => {          // surround hunter with 4 different animals
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Fish1, side: 0, x: 2, y: 2},
      {tile: Tile.Legendary2, side: 0, x: 3, y: 2},
      {tile: Tile.Ibex4B, side: 1, x: 1, y: 4},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
      {tile: Tile.Buffalo3B, side: 0, x: 1, y: 4}
    ]

    expect(goals[13].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[13].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[13].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective15", () => {          // line of 5 same animals (no Legendary)
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
    ]

    expect(goals[14].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[14].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[14].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective16", () => {          // fill 4 corners
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Mammoth4A, side: 0, x: 0, y: 4},
      {tile: Tile.Mammoth4B, side: 0, x: 5, y: 0},
      {tile: Tile.Fish4B, side: 0, x: 5, y: 4},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 0, x: 6, y: 3},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Mammoth4A, side: 0, x: 0, y: 4},
      {tile: Tile.Mammoth4B, side: 0, x: 5, y: 0},
      {tile: Tile.Fish4B, side: 0, x: 5, y: 4},
      {tile: Tile.Fish1, side: 0, x: 6, y: 3},
    ]

    expect(goals[15].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[15].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[15].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

  test("Objective18", () => {          // 2 legendary side by side
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Legendary2, side: 0, x: 2, y: 1},
      {tile: Tile.Legendary3, side: 0, x: 4, y: 1}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Legendary2, side: 0, x: 2, y: 1},
      {tile: Tile.Legendary3, side: 0, x: 4, y: 0}
    ]

    expect(goals[17].rule(withCave([], PlayerColor.Yellow))).toBe(false)
    expect(goals[17].rule(withCave(goodCave, PlayerColor.Yellow))).toBe(true)
    expect(goals[17].rule(withCave(wrongCave, PlayerColor.Yellow))).toBe(false)
  })

})

function withCave(cave: PlacedTile[], color: PlayerColor): PlayerState {
  return {cave, color, deck: [], discard: [], variableGoalsMade: [], hand: [], played: [], totemTokens: 8}
}
