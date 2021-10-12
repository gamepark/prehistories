import GameView from "@gamepark/prehistories/GameView";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import MoveView from "@gamepark/prehistories/moves/MoveView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { Animations } from "@gamepark/react-client";

const prehistoriesAnimations : Animations<GameView, MoveView, PlayerColor> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        if (move.type === MoveType.DrawXCards){
            return 0
        } else if (move.type === MoveType.PlayPolyomino){
            return action.playerId === playerId ? 0 : 5
        } else if (move.type === MoveType.SpendHunter){
            return action.playerId === playerId ? 0 : (state.caveDisplayed === action.playerId ? 0.7 : 0)
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return 1
        } else if (move.type === MoveType.PlayHuntCard){
            return action.playerId === playerId ? 0 : (state.caveDisplayed === action.playerId ? 1 : 0)
        } else if (move.type === MoveType.ResolvePermanentObjectives){
            return 2
        } else if(move.type === MoveType.ResolveVariableObjectives){
            return 2
        } else if(move.type === MoveType.RevealHuntCards){
            return state.caveDisplayed === playerId ? 0 : 2
        }

        return 0
    }

}

export default prehistoriesAnimations