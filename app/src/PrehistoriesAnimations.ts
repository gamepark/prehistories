import MoveType from "@gamepark/prehistories/moves/MoveType";
import MoveView from "@gamepark/prehistories/moves/MoveView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {getFirstOfSortedPlayer} from "@gamepark/prehistories/types/PlayerView";
import {Animations} from "@gamepark/react-client";
import GameLocalView from "./GameLocalView";

const prehistoriesAnimations : Animations<GameLocalView, MoveView, PlayerColor> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        if (move.type === MoveType.DrawCards){
            return action.playerId === playerId ? 1.5 : (state.caveDisplayed === action.playerId ? 1.5 : 0)
        } else if (move.type === MoveType.PlaceTile){
            return action.playerId === playerId ? 0 : 3
        } else if (move.type === MoveType.SpendHunter){
            return action.playerId === playerId ? 1 : (state.caveDisplayed === action.playerId ? 1 : 0)
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return state.caveDisplayed === getFirstOfSortedPlayer(state).color ? 1 : 0
        } else if (move.type === MoveType.TakeBackPlayedCards){
            return ( getFirstOfSortedPlayer(state).color === state.caveDisplayed && getFirstOfSortedPlayer(state).played.length !== 0) ? 2 : 0
        } else if(move.type === MoveType.FulfillObjective){
            return 3
        } else if(move.type === MoveType.RevealHuntCards){
            return state.caveDisplayed === playerId ? 0 : 2
        }

        return 0
    }

}

export default prehistoriesAnimations