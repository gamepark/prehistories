import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { getGoalsArray } from "../material/Goals";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import { HuntPhase } from "../types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type ResolveVariableObjectives = {
    type : MoveType.ResolveVariableObjectives
    playerId:PlayerColor
    goal:number
    tokens:number
}

export default ResolveVariableObjectives

export function resolveVariableObjectives(state:GameState | GameView, move:ResolveVariableObjectives){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    for(let i=0; i<move.tokens;i++){
        player.goalsMade.push(move.goal)
        player.totemTokens = Math.max(0, player.totemTokens -1)
    }
    
}

export function checkVariableObjectives(state:GameState | GameView, player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):(false | [number, number]){

    for(const goal of state.goals){
        if (!isPlayerAlreadyCompleteObjective(player, goal) && getGoalsArray(true)[goal].rule(player)){
            if(anyPlayerCompleteObjective(goal, state.players)){
                return [goal, getGoalsArray(true)[goal].value-1]
            } else {
                return [goal, getGoalsArray(true)[goal].value]
            }
        }
    }

    return false
}

function anyPlayerCompleteObjective(goal:number, players:(PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView)[]):boolean{
    return players.filter(p => p.goalsMade.find(g => g === goal) !== undefined).length > 0
}

function isPlayerAlreadyCompleteObjective(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView, goal:number):boolean{
    return player.goalsMade.find(g => g === goal) !== undefined
}



