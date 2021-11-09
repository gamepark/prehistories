import GameView from "@gamepark/prehistories/GameView";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import MoveView from "@gamepark/prehistories/moves/MoveView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { getFirstOfSortedPlayer } from "@gamepark/prehistories/types/PlayerView";
import { Animations } from "@gamepark/react-client";

const prehistoriesAnimations : Animations<GameView, MoveView, PlayerColor> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        if (move.type === MoveType.DrawXCards){
            return action.playerId === playerId ? 1.5 : (state.caveDisplayed === action.playerId ? 1.5 : 0)
        } else if (move.type === MoveType.PlaceTile){
            return action.playerId === playerId ? 0 : 3
        } else if (move.type === MoveType.SpendHunter){
            return action.playerId === playerId ? 1 : (state.caveDisplayed === action.playerId ? 1 : 0)
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return 1
        } else if (move.type === MoveType.TakeBackPlayedCards){
            return getFirstOfSortedPlayer(state).played.length !== 0 ? 2 : 0
        } else if (move.type === MoveType.PlayHuntCard){
            return action.playerId === playerId ? 0 : (state.caveDisplayed === action.playerId ? 1 : 0)
        } else if (move.type === MoveType.ResolvePermanentObjectives){
            return 1
        } else if(move.type === MoveType.ResolveVariableObjectives){
            return 1
        } else if(move.type === MoveType.RevealHuntCards){
            return state.caveDisplayed === playerId ? 0 : 2
        }

        return 0
    }

}

export default prehistoriesAnimations