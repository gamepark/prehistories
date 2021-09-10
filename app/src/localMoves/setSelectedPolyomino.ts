import GameView from "@gamepark/prehistories/GameView";
import PolyominoToHunt from "@gamepark/prehistories/types/appTypes/PolyominoToHunt";

export default interface SetSelectedPolyomino{
    type:'SetSelectedPolyomino'
    polyomino:PolyominoToHunt
}

export interface ResetSelectedPolyomino{
    type:'ResetSelectedPolyomino'
}

export const setSelectedPolyominoMove = (polyomino:PolyominoToHunt):SetSelectedPolyomino => ({
    type:'SetSelectedPolyomino',
    polyomino
})

export const resetSelectedPolyominoMove = ():ResetSelectedPolyomino => ({
    type:'ResetSelectedPolyomino'
})

export function setSelectedPolyomino(state:GameView, move:SetSelectedPolyomino){
    if (state.polyominoSelected === undefined){
        state.polyominoSelected = move.polyomino
    } else {
        if (state.polyominoSelected.huntSpot === move.polyomino.huntSpot){
            state.polyominoSelected.side = state.polyominoSelected.side === 0 ? 1 : 0
        } else {
            state.polyominoSelected = move.polyomino
        }
    }
}

export function resetSelectedPolyomino(state:GameView){
    delete state.polyominoSelected
}