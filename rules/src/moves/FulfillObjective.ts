import GameState from "../GameState";
import GameView from "../GameView";
import {getPlayers} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import Objective from "../material/Objective";
import {getTokensForFulfilledObjective} from "../material/ObjectiveRules";

type FulfillObjective = {
  type: MoveType.FulfillObjective
  objective: Objective
}

export default FulfillObjective

export function fulfillObjectiveMove(objective: Objective): FulfillObjective {
  return {type: MoveType.FulfillObjective, objective}
}

export function fulfillObjective(state: GameState | GameView, move: FulfillObjective) {
  const player = getPlayers(state).find(p => p.hunting)!
  const totemTokenPlaced = getTokensForFulfilledObjective(state, move.objective);
  for (let i = 0; i < totemTokenPlaced; i++) {
    player.totemTokens.push(move.objective)
  }
}

export function isFulfillObjective(move: Move): move is FulfillObjective {
  return move.type === MoveType.FulfillObjective
}

