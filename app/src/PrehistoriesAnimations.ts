import MoveType from "@gamepark/prehistories/moves/MoveType";
import MoveView from "@gamepark/prehistories/moves/MoveView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import {Animations} from "@gamepark/react-client";
import GameLocalView from "./GameLocalView";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import {getCaveDisplayed} from "./localMoves/setCaveDisplayed";

const prehistoriesAnimations : Animations<GameLocalView, MoveView, PlayerColor> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        const caveDisplayed = getCaveDisplayed(state, playerId);
        if (move.type === MoveType.DrawCards){
            return caveDisplayed === move.player ? 1.5 : 0
        } else if (move.type === MoveType.PlaceTile){
            return action.playerId === playerId ? 0 : 3
        } else if (move.type === MoveType.SpendHunter){
            return action.playerId === playerId ? 1 : (caveDisplayed === action.playerId ? 1 : 0)
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return caveDisplayed === getHuntingPlayer(state)!.color ? 1 : 0
        } else if (move.type === MoveType.TakeBackPlayedCards){
            const huntingPlayer = getHuntingPlayer(state)!;
            return ( getHuntingPlayer(state)!.color === caveDisplayed && huntingPlayer.played.length !== 0) ? 2 : 0
        } else if(move.type === MoveType.FulfillObjective){
            return 3
        } else if(move.type === MoveType.RevealHuntCards){
            return caveDisplayed === playerId ? 0 : 2
        }

        return 0
    }

}

export default prehistoriesAnimations