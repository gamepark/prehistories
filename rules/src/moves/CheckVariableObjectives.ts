import GameState from "../GameState";
import GameView from "../GameView";
import {objectives} from "../material/Objectives";
import PlayerState from "../PlayerState";
import {getFirstOfSortedPlayer, PlayerView, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type ResolveVariableObjectives = {
    type : MoveType.ResolveVariableObjectives
    objective:number
    tokens:number
}

export default ResolveVariableObjectives

export function resolveVariableObjectives(state:GameState | GameView, move:ResolveVariableObjectives){
    const player = getFirstOfSortedPlayer(state)
    for(let i=0; i<move.tokens;i++){
        player.variableObjectivesMade.push(move.objective)
        player.totemTokens = Math.max(0, player.totemTokens -1)
    }
    
}

export function checkVariableObjectives(state:GameState | GameView, player:PlayerState | PlayerView | PlayerViewSelf):(false | [number, number]){
    for(const objective of state.objectives){
        if (!isPlayerAlreadyCompleteObjective(player, objective) && objectives[objective].rule(player)){
            const rewardForFirstPlayer = anyPlayerCompleteObjective(objective, state.players) ? 0 : 1
            return [objective, objectives[objective].value-1 + rewardForFirstPlayer]
        }
    }
    return false
}

function anyPlayerCompleteObjective(objective:number, players:(PlayerState | PlayerView | PlayerViewSelf)[]):boolean{
    return players.filter(p => p.variableObjectivesMade.find(g => g === objective) !== undefined).length > 0
}

function isPlayerAlreadyCompleteObjective(player:PlayerState | PlayerView | PlayerViewSelf, objective:number):boolean{
    return player.variableObjectivesMade.find(g => g === objective) !== undefined
}

export function isResolveVariableObjectives(move: Move):move is ResolveVariableObjectives{
    return move.type === MoveType.ResolveVariableObjectives
}

