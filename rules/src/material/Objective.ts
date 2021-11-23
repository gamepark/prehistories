import {shuffle} from "lodash";

enum Objective {
  AnyColumn = 1, AnyLine, Legendary,
  ConnectTotemAnimals = 11, PaintMiddle9, Column5Different, AnimalArea8, SurroundHunter,
  Column5Same, ConnectDiagonalCorners, Paint5SmallestTiles, SurroundLegendary,
  SurroundTotemAnimals = 21, PaintLastColumn, Line5Different, AnimalArea10, SurroundHunterDifferent,
  Line5Same, PaintAllCorners, Collect3Tiles, PaintAdjacentLegendary
}

export default Objective

export const permanentObjectives = [Objective.AnyColumn, Objective.AnyLine, Objective.Legendary]

export const sunObjectives = [Objective.ConnectTotemAnimals, Objective.PaintMiddle9, Objective.Column5Different, Objective.AnimalArea8,
  Objective.SurroundHunter, Objective.Column5Same, Objective.ConnectDiagonalCorners, Objective.Paint5SmallestTiles, Objective.SurroundLegendary]

function getMoonSide(objective: Objective): Objective {
  return objective + 10
}

export function setupObjectives(players: number, beginner: boolean): Objective[] {
  const objectiveCardsShuffled = shuffle(sunObjectives)
  const numberOfObjectives: number = players < 4 ? 4 : 5
  const objectiveCards = objectiveCardsShuffled.slice(0, numberOfObjectives)
  if (!beginner) {
    for (let i = 0; i < objectiveCards.length; i++) {
      if (Math.random() < 0.5) {
        objectiveCards[i] = getMoonSide(objectiveCards[i])
      }
    }
  }
  return objectiveCards
}