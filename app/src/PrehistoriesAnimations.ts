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
            return 0
        } else if (move.type === MoveType.SpendHunter){
            return 0
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return 0
        } else if (move.type === MoveType.PlayHuntCard){
            return 0
        }

        return 0
    }

}

export default prehistoriesAnimations