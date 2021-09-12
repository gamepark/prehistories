import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { getGoalsArray } from "../material/Goals";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import { HuntPhase } from "../types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type CheckVariableObjectives = {
    type : MoveType.CheckVariableObjectives
    playerId:PlayerColor
}

export default CheckVariableObjectives

export function checkVariableObjectives(state:GameState | GameView, move:CheckVariableObjectives){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!

    state.goals.forEach(goal => {

        if (!isPlayerAlreadyCompleteObjective(player, goal) && getGoalsArray(true)[goal].rule(player)){
            if(anyPlayerCompleteObjective(goal, state.players)){
                player.totemTokens-=Math.min(getGoalsArray(true)[goal].value-1, player.totemTokens)
            } else {
                player.totemTokens-=Math.min(getGoalsArray(true)[goal].value,player.totemTokens)
            }
            player.goalsMade.push(goal)
        }

    })

    player.huntPhase = HuntPhase.Hunt
}

function anyPlayerCompleteObjective(goal:number, players:(PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView)[]):boolean{
    return players.filter(p => p.goalsMade.find(g => g === goal) !== undefined).length > 0
}

function isPlayerAlreadyCompleteObjective(player:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView, goal:number):boolean{
    return player.goalsMade.find(g => g === goal) !== undefined
}



