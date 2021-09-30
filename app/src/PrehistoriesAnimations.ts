import GameView from "@gamepark/prehistories/GameView";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import MoveView from "@gamepark/prehistories/moves/MoveView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";
import { Animations } from "@gamepark/react-client";

const prehistoriesAnimations : Animations<GameView, MoveView, PlayerColor> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){

        if (move.type === MoveType.DrawXCards){
            return 2
        } else if (move.type === MoveType.PlayPolyomino){
            return 2
        } else if (move.type === MoveType.SpendHunter){
            return 2
        } else if (move.type === MoveType.ShuffleDiscardPile){
            return 2
        } else if (move.type === MoveType.PlayHuntCard){
            return 2
        }

        return 0
    }

}

export default prehistoriesAnimations