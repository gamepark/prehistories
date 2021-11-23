import PlayerColor from "../PlayerColor"
import PlacedTile from "../types/PlacedTile"
import Tile from "../material/Tile";
import GameState from "../GameState";
import Objective from "../material/Objective";
import {getFulfilledObjectives} from "../material/ObjectiveRules";

describe('Test Objectives', () => {

  test('ConnectTotemAnimals', () => {          // PathFinding between two totems

    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 3}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 2}
    ]

    expect(getFulfilledObjectives(createGameState([Objective.ConnectTotemAnimals], goodCave))).toContain(Objective.ConnectTotemAnimals)
    expect(getFulfilledObjectives(createGameState([Objective.ConnectTotemAnimals], wrongCave))).not.toContain(Objective.ConnectTotemAnimals)
  })

  test("PaintMiddle9", () => {          // 3x3 central square filled
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

    expect(getFulfilledObjectives(createGameState([Objective.PaintMiddle9], goodCave))).toContain(Objective.PaintMiddle9)
    expect(getFulfilledObjectives(createGameState([Objective.PaintMiddle9], wrongCave))).not.toContain(Objective.PaintMiddle9)
  })

  test("Column5Different", () => {          // column of 5 animals
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

    expect(getFulfilledObjectives(createGameState([Objective.Column5Different], goodCave))).toContain(Objective.Column5Different)
    expect(getFulfilledObjectives(createGameState([Objective.Column5Different], wrongCave))).not.toContain(Objective.Column5Different)
  })

  test("AnimalArea8", () => {          // group of 8 same animals (no legend)
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 0, y: 5},
      {tile: Tile.Buffalo3B, side: 0, x: 3, y: 2},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 0, y: 5},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 5},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1}
    ]

    expect(getFulfilledObjectives(createGameState([Objective.AnimalArea8], goodCave))).toContain(Objective.AnimalArea8)
    expect(getFulfilledObjectives(createGameState([Objective.AnimalArea8], wrongCave))).not.toContain(Objective.AnimalArea8)
  })

  test("SurroundHunter", () => {          // surround hunter tile
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

    expect(getFulfilledObjectives(createGameState([Objective.SurroundHunter], goodCave))).toContain(Objective.SurroundHunter)
    expect(getFulfilledObjectives(createGameState([Objective.SurroundHunter], wrongCave))).not.toContain(Objective.SurroundHunter)
  })

  test("Column5Same", () => {          // Column of 5 same animal no legend
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

    expect(getFulfilledObjectives(createGameState([Objective.Column5Same], goodCave))).toContain(Objective.Column5Same)
    expect(getFulfilledObjectives(createGameState([Objective.Column5Same], wrongCave))).not.toContain(Objective.Column5Same)
  })

  test("ConnectDiagonalCorners", () => {          // Pathfinding betwenn top left corner and bottom right corner
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

    expect(getFulfilledObjectives(createGameState([Objective.ConnectDiagonalCorners], goodCave))).toContain(Objective.ConnectDiagonalCorners)
    expect(getFulfilledObjectives(createGameState([Objective.ConnectDiagonalCorners], wrongCave))).not.toContain(Objective.ConnectDiagonalCorners)
  })

  test("Paint5SmallestTiles", () => {          // 5 tiles 1x1 built
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

    expect(getFulfilledObjectives(createGameState([Objective.Paint5SmallestTiles], goodCave))).toContain(Objective.Paint5SmallestTiles)
    expect(getFulfilledObjectives(createGameState([Objective.Paint5SmallestTiles], wrongCave))).not.toContain(Objective.Paint5SmallestTiles)
  })

  test("SurroundLegendary", () => {          // Surround a legendary tile
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 3},
      {tile: Tile.Fish1, side: 0, x: 4, y: 6},
      {tile: Tile.Legendary2, side: 0, x: 5, y: 5}
    ]
    const goodCave2: PlacedTile[] = [
      {tile: Tile.Buffalo2, side: 0, x: 0, y: 4},
      {tile: Tile.Buffalo2, side: 1, x: 2, y: 5},
      {tile: Tile.Fish1, side: 0, x: 2, y: 4},
      {tile: Tile.Legendary2, side: 0, x: 0, y: 5}
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 1, x: 2, y: 3},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 3},
      {tile: Tile.Fish1, side: 0, x: 4, y: 6},
      {tile: Tile.Legendary2, side: 0, x: 5, y: 5}
    ]

    expect(getFulfilledObjectives(createGameState([Objective.SurroundLegendary], goodCave))).toContain(Objective.SurroundLegendary)
    expect(getFulfilledObjectives(createGameState([Objective.SurroundLegendary], goodCave2))).toContain(Objective.SurroundLegendary)
    expect(getFulfilledObjectives(createGameState([Objective.SurroundLegendary], wrongCave))).not.toContain(Objective.SurroundLegendary)
  })

  test("SurroundTotemAnimals", () => {          // Surround two totems
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

    expect(getFulfilledObjectives(createGameState([Objective.SurroundTotemAnimals], goodCave))).toContain(Objective.SurroundTotemAnimals)
    expect(getFulfilledObjectives(createGameState([Objective.SurroundTotemAnimals], wrongCave))).not.toContain(Objective.SurroundTotemAnimals)
  })

  test("PaintLastColumn", () => {          // Fill the right column
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

    expect(getFulfilledObjectives(createGameState([Objective.PaintLastColumn], goodCave))).toContain(Objective.PaintLastColumn)
    expect(getFulfilledObjectives(createGameState([Objective.PaintLastColumn], wrongCave))).not.toContain(Objective.PaintLastColumn)
  })

  test("Line5Different", () => {          // Line of 5 different animals
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

    expect(getFulfilledObjectives(createGameState([Objective.Line5Different], goodCave))).toContain(Objective.Line5Different)
    expect(getFulfilledObjectives(createGameState([Objective.Line5Different], wrongCave))).not.toContain(Objective.Line5Different)
  })

  test("AnimalArea10", () => {          // Group of 10 same animal
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

    expect(getFulfilledObjectives(createGameState([Objective.AnimalArea10], goodCave))).toContain(Objective.AnimalArea10)
    expect(getFulfilledObjectives(createGameState([Objective.AnimalArea10], wrongCave))).not.toContain(Objective.AnimalArea10)
  })

  test("SurroundHunterDifferent", () => {          // surround hunter with 4 different animals
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

    expect(getFulfilledObjectives(createGameState([Objective.SurroundHunterDifferent], goodCave))).toContain(Objective.SurroundHunterDifferent)
    expect(getFulfilledObjectives(createGameState([Objective.SurroundHunterDifferent], wrongCave))).not.toContain(Objective.SurroundHunterDifferent)
  })

  test("Line5Same", () => {          // line of 5 same animals (no Legendary)
    const goodCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
    ]
    const wrongCave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
    ]

    expect(getFulfilledObjectives(createGameState([Objective.Line5Same], goodCave))).toContain(Objective.Line5Same)
    expect(getFulfilledObjectives(createGameState([Objective.Line5Same], wrongCave))).not.toContain(Objective.Line5Same)
  })

  test("PaintAllCorners", () => {          // fill 4 corners
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

    expect(getFulfilledObjectives(createGameState([Objective.PaintAllCorners], goodCave))).toContain(Objective.PaintAllCorners)
    expect(getFulfilledObjectives(createGameState([Objective.PaintAllCorners], wrongCave))).not.toContain(Objective.PaintAllCorners)
  })

  test("PaintAdjacentLegendary", () => {          // 2 legendary side by side
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

    expect(getFulfilledObjectives(createGameState([Objective.PaintAdjacentLegendary], goodCave))).toContain(Objective.PaintAdjacentLegendary)
    expect(getFulfilledObjectives(createGameState([Objective.PaintAdjacentLegendary], wrongCave))).not.toContain(Objective.PaintAdjacentLegendary)
  })

})

function createGameState(objectives: Objective[], cave: PlacedTile[]): GameState {
  return {
    players: [
      {
        cave,
        color: PlayerColor.Yellow,
        deck: [],
        discard: [],
        hand: [],
        played: [],
        totemTokens: [],
        hunting: {tilesHunted: 0, injuries: 0}
      },
      {cave: [], color: PlayerColor.Blue, deck: [], discard: [], hand: [], played: [], totemTokens: []}
    ],
    objectives,
    huntingBoard: [],
    tilesDecks: []
  }
}
