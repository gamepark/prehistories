import GameView from "@gamepark/prehistories/GameView";
import MoveType from "@gamepark/prehistories/moves/MoveType";
import PlayerColor from "@gamepark/prehistories/PlayerColor";

export default interface SetCaveDisplayed{
    type:'SetCaveDisplayed'
    color:PlayerColor
}

export const setCaveDisplayedMove = (color:PlayerColor):SetCaveDisplayed => ({
    type:'SetCaveDisplayed', color
})

export function setCaveDisplayed(state:GameView, move:SetCaveDisplayed){
    state.caveDisplayed = move.color
}