import {Action} from "@gamepark/rules-api";
import Move from "./moves/Move";
import MoveType from "./moves/MoveType";
import MoveView from "./moves/MoveView";
import PlayerColor from "./PlayerColor";

export default function canUndo(action: Action<Move|MoveView, PlayerColor>, consecutiveActions: Action<Move|MoveView, PlayerColor>[]):boolean{
    switch(action.move.type){
        case MoveType.PlayHuntCard:
            return !consecutiveActions.some(consecAction => consecAction.playerId === action.playerId && consecAction.move.type === MoveType.EndTurn)
        case MoveType.EndTurn:
            return !action.consequences.some(consequence => consequence.type === MoveType.RevealHuntCards || consequence.type === MoveType.DrawCards)
            && !consecutiveActions.some(consecutiveAction => consecutiveAction.consequences.some(consequence => consequence.type === MoveType.RevealHuntCards)) 
        case MoveType.PlaceTile:
        case MoveType.SpendHunter:
        case MoveType.ValidateSpentHunters:{
            return !action.consequences.some(consequence => consequence.type === MoveType.EndTurn)
        }
        default:
            return false
    }
    
}