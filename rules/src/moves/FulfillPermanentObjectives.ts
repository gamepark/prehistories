import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import {HuntPhase} from "../types/Phase";
import {getFirstOfSortedPlayer, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import {getPaintedCave, isColumnPainted, isLinePainted} from "../material/PaintedCave";
import {getPlacedTileCoordinates} from "../types/PlacedTile";
import {isLegendaryAnimalTile} from "../material/Tile";

type FulfillPermanentObjectives = {
  type: MoveType.FulfillPermanentObjectives
  objectivesCompleted: [number[], number[], boolean];
}

export default FulfillPermanentObjectives

export function fulfillPermanentObjectives(state: GameState | GameView, move: FulfillPermanentObjectives) {
  const player = getFirstOfSortedPlayer(state)
  player.totemTokens = Math.max(0, player.totemTokens - (move.objectivesCompleted[0].length + move.objectivesCompleted[1].length + (move.objectivesCompleted[2] ? 1 : 0)))
  player.hunting!.huntPhase = HuntPhase.CheckVariableObjectives
}

export function checkPermanentObjectives(player: PlayerState | PlayerView | PlayerViewSelf): [number[], number[], boolean] {
  const completedLines: number[] = [], completedColumns: number[] = []
  const cave = getPaintedCave(player)
  const lastTilePlayed = player.cave[player.cave.length - 1]
  const coordinates = getPlacedTileCoordinates(lastTilePlayed)
  const columnsToCheck = new Set(coordinates.map(c => c.x))
  const linesToCheck = new Set(coordinates.map(c => c.y))
  for (const x of columnsToCheck) {
    if (isColumnPainted(cave, x)) {
      completedColumns.push(x)
    }
  }
  for (const y of linesToCheck) {
    if (isLinePainted(cave, y)) {
      completedLines.push(y)
    }
  }

  return [completedLines, completedColumns, isLegendaryAnimalTile(lastTilePlayed.tile)]
}

export function isFulfillPermanentObjectives(move: Move): move is FulfillPermanentObjectives {
  return move.type === MoveType.FulfillPermanentObjectives
}