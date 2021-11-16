import PlacedTile from "@gamepark/prehistories/types/PlacedTile"
import Tile from "@gamepark/prehistories/material/Tile"
import PlayerColor from "@gamepark/prehistories/PlayerColor"
import getObjectiveSquaresHighlight from "../board/ObjectiveSquaresHighlight"
import Objective from "@gamepark/prehistories/material/Objective"

const X = true, _ = false

describe('Test fulfilled objectives highlighting', () => {
  test('Connect totemic animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 3}
    ]
    expect(getObjectiveSquaresHighlight(Objective.ConnectTotemAnimals, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, X, X, X, X, _, _],
      [_, _, _, _, X, _, _],
      [_, _, _, _, X, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Paint 3x3 square in the center', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 3, y: 3},
      {tile: Tile.Ibex4B, side: 0, x: 2, y: 1},
      {tile: Tile.Boar3A, side: 0, x: 2, y: 4}
    ]
    expect(getObjectiveSquaresHighlight(Objective.PaintMiddle9, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, X, X, X, _, _],
      [_, _, X, X, X, _, _],
      [_, _, X, X, X, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Column with 5 different animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Legendary1, side: 0, x: 0, y: 5},
      {tile: Tile.Ibex4B, side: 1, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    expect(getObjectiveSquaresHighlight(Objective.Column5Different, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, X, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Area of 8 same animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 0, y: 5},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 3, y: 2},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    // TODO: Test does not work because the algorithm stops as soon as 8 squares are found. We need a better algorithm based on the last tile placed.
    expect(getObjectiveSquaresHighlight(Objective.AnimalArea8, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [X, _, X, _, _, _, _],
      [X, X, X, X, X, _, _],
      [_, X, _, X, X, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Hunter is surrounded', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
      {tile: Tile.Boar3A, side: 0, x: 0, y: 3}
    ]
    expect(getObjectiveSquaresHighlight(Objective.SurroundHunter, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, X, X, X, _, _, _],
      [_, X, _, X, _, _, _],
      [_, X, X, X, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Column with 5 same animal', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 5},
      {tile: Tile.Buffalo3A, side: 0, x: 2, y: 1},
      {tile: Tile.Buffalo3B, side: 0, x: 2, y: 3},
    ]
    expect(getObjectiveSquaresHighlight(Objective.Column5Same, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, X, _, _, _, _]
    ])
  })
  test('Path between top left and bottom right corner', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 5},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0}
    ]
    expect(getObjectiveSquaresHighlight(Objective.ConnectDiagonalCorners, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [X, _, _, _, _, _, _],
      [X, X, _, _, _, _, _],
      [_, X, _, _, _, _, _],
      [_, X, X, _, _, _, _],
      [_, _, X, X, X, _, _],
      [_, _, _, _, X, X, _],
      [_, _, _, _, _, X, X]
    ])
  })
  test('Place 5 tiles of size 1', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 1, x: 1, y: 0},
      {tile: Tile.Fish1, side: 0, x: 2, y: 0},
      {tile: Tile.Fish1, side: 1, x: 3, y: 0},
      {tile: Tile.Mammoth1, side: 0, x: 4, y: 0}
    ]
    expect(getObjectiveSquaresHighlight(Objective.Paint5SmallestTiles, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [X, X, X, X, X, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Place a legendary tile and surround it', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 4},
      {tile: Tile.Buffalo3A, side: 0, x: 5, y: 3},
      {tile: Tile.Fish1, side: 0, x: 4, y: 6},
      {tile: Tile.Legendary2, side: 0, x: 5, y: 5}
    ]
    expect(getObjectiveSquaresHighlight(Objective.SurroundLegendary, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, X, X, X],
      [_, _, _, _, X, X, X],
      [_, _, _, _, X, X, X]
    ])
  })
  test('Surround both totemic animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 2, y: 2},
      {tile: Tile.Ibex4B, side: 1, x: 2, y: 4},
      {tile: Tile.Buffalo3B, side: 0, x: 4, y: 5},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 0, x: 5, y: 4},
      {tile: Tile.Fish1, side: 0, x: 3, y: 6},
    ]
    expect(getObjectiveSquaresHighlight(Objective.SurroundTotemAnimals, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [X, X, X, _, _, _, _],
      [X, _, X, _, _, _, _],
      [X, X, X, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, X, X, X, _],
      [_, _, _, X, _, X, _],
      [_, _, _, X, X, X, _]
    ])
  })
  test('Paint the last column', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 5, y: 4},
      {tile: Tile.Buffalo4B, side: 0, x: 1, y: 0},
      {tile: Tile.Boar3A, side: 1, x: 5, y: 3},
      {tile: Tile.Ibex4B, side: 1, x: 4, y: 0},
      {tile: Tile.Buffalo3B, side: 0, x: 5, y: 1},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
    ]
    expect(getObjectiveSquaresHighlight(Objective.PaintLastColumn, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X],
      [_, _, _, _, _, _, X]
    ])
  })
  test('Paint 5 different animals in a single line', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Boar3A, side: 1, x: 4, y: 0},
      {tile: Tile.Ibex4B, side: 0, x: 2, y: 0},
      {tile: Tile.Fish1, side: 0, x: 6, y: 1},
    ]
    expect(getObjectiveSquaresHighlight(Objective.Line5Different, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [X, X, X, _, _, X, X],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Area of 10 same animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
      {tile: Tile.Buffalo3B, side: 0, x: 0, y: 4}
    ]
    expect(getObjectiveSquaresHighlight(Objective.AnimalArea10, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [X, _, _, _, _, _, _],
      [X, X, X, X, X, _, _],
      [_, X, _, X, _, _, _],
      [_, X, _, _, _, _, _],
      [X, X, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Surround the hunter with 4 different animals', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Fish1, side: 0, x: 2, y: 2},
      {tile: Tile.Legendary2, side: 0, x: 3, y: 2},
      {tile: Tile.Ibex4B, side: 1, x: 1, y: 4},
    ]
    expect(getObjectiveSquaresHighlight(Objective.SurroundHunterDifferent, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, X, _, X, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Line with 5 times the same animal', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 2, y: 2},
    ]
    expect(getObjectiveSquaresHighlight(Objective.Line5Same, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [X, X, X, X, X, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Paint all four corners', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Mammoth4A, side: 0, x: 0, y: 4},
      {tile: Tile.Mammoth4B, side: 0, x: 5, y: 0},
      {tile: Tile.Fish4B, side: 0, x: 5, y: 4},
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Fish1, side: 0, x: 6, y: 3},
    ]
    expect(getObjectiveSquaresHighlight(Objective.PaintAllCorners, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [X, _, _, _, _, _, X],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [X, _, _, _, _, _, X]
    ])
  })
  test('Paint 3 tiles in a single round', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Fish1, side: 0, x: 0, y: 0},
      {tile: Tile.Buffalo2, side: 0, x: 1, y: 0},
      {tile: Tile.Ibex3A, side: 0, x: 2, y: 1},
    ]
    expect(getObjectiveSquaresHighlight(Objective.Collect3Tiles, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [X, X, X, _, _, _, _],
      [_, _, X, _, _, _, _],
      [_, _, X, X, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
  test('Paint 22 legendary animals side by side', () => {
    const cave: PlacedTile[] = [
      {tile: Tile.Buffalo4A, side: 1, x: 0, y: 1},
      {tile: Tile.Buffalo4B, side: 0, x: 3, y: 3},
      {tile: Tile.Legendary2, side: 0, x: 2, y: 1},
      {tile: Tile.Legendary3, side: 0, x: 4, y: 1}
    ]
    expect(getObjectiveSquaresHighlight(Objective.PaintAdjacentLegendary, {cave, color: PlayerColor.Yellow})).toStrictEqual([
      [_, _, _, _, _, _, _],
      [_, _, X, X, X, X, _],
      [_, _, X, X, X, X, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _],
      [_, _, _, _, _, _, _]
    ])
  })
})
