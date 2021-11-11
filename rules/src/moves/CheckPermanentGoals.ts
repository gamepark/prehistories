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

type ResolvePermanentGoals = {
  type: MoveType.ResolvePermanentGoals
  goalsCompleted: [number[], number[], boolean];
}

export default ResolvePermanentGoals

export function resolvePermanentGoals(state: GameState | GameView, move: ResolvePermanentGoals) {
  const player = getFirstOfSortedPlayer(state)
  player.totemTokens = Math.max(0, player.totemTokens - (move.goalsCompleted[0].length + move.goalsCompleted[1].length + (move.goalsCompleted[2] ? 1 : 0)))
  player.hunting!.huntPhase = HuntPhase.CheckVariableGoals
}

export function checkPermanentGoals(player: PlayerState | PlayerView | PlayerViewSelf): [number[], number[], boolean] {
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

export function isResolvePermanentGoals(move: Move): move is ResolvePermanentGoals {
  return move.type === MoveType.ResolvePermanentGoals
}