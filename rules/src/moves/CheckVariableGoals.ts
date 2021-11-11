import GameState from "../GameState";
import GameView from "../GameView";
import {goals} from "../material/Goals";
import PlayerState from "../PlayerState";
import {getFirstOfSortedPlayer, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type ResolveVariableGoals = {
    type : MoveType.ResolveVariableGoals
    goal:number
    tokens:number
}

export default ResolveVariableGoals

export function resolveVariableGoals(state:GameState | GameView, move:ResolveVariableGoals){
    const player = getFirstOfSortedPlayer(state)
    for(let i=0; i<move.tokens;i++){
        player.variableGoalsMade.push(move.goal)
        player.totemTokens = Math.max(0, player.totemTokens -1)
    }
    
}

export function checkVariableGoals(state:GameState | GameView, player:PlayerState | PlayerView | PlayerViewSelf):(false | [number, number]){
    for(const goal of state.goals){
        if (!isPlayerAlreadyCompleteGoal(player, goal) && goals[goal].rule(player)){
            const rewardForFirstPlayer = anyPlayerCompleteGoal(goal, state.players) ? 0 : 1
            return [goal, goals[goal].value-1 + rewardForFirstPlayer]
        }
    }
    return false
}

function anyPlayerCompleteGoal(goal:number, players:(PlayerState | PlayerView | PlayerViewSelf)[]):boolean{
    return players.filter(p => p.variableGoalsMade.find(g => g === goal) !== undefined).length > 0
}

function isPlayerAlreadyCompleteGoal(player:PlayerState | PlayerView | PlayerViewSelf, goal:number):boolean{
    return player.variableGoalsMade.find(g => g === goal) !== undefined
}

export function isResolveVariableGoals(move: Move):move is ResolveVariableGoals{
    return move.type === MoveType.ResolveVariableGoals
}

