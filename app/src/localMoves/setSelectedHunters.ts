import GameView from "@gamepark/prehistories/GameView";
import {getColoredDeck} from "@gamepark/prehistories/material/Hunters";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import getPowerLevels from "@gamepark/prehistories/utils/powerLevels";

export default interface SetSelectedHunters{
    type:'SetSelectedHunters'
    hunter:number
}

export interface ResetSelectedHunters{
    type:'ResetSelectedHunters'
}

export const setSelectedHunterMove = (hunter:number):SetSelectedHunters => ({
    type:'SetSelectedHunters',
    hunter
})

export const resetSelectedHuntersMove = ():ResetSelectedHunters => ({
    type:'ResetSelectedHunters'
})

export function setSelectedHunters(state:GameView, move:SetSelectedHunters){
    const player = getHuntingPlayer(state)!
    if (player.hunting.hunt){
        if (state.huntersSelected === undefined){
            state.huntersSelected = [move.hunter]
        } else {
            if (state.huntersSelected.find(card => card === move.hunter) !== undefined){
                state.huntersSelected.splice(state.huntersSelected.findIndex(card => card === move.hunter),1)
            } else if (getPowerLevels(state.players.length, player.hunting.hunt!.zone)[1] > state.huntersSelected.reduce((acc, cv) => acc + getColoredDeck(player.color)[cv].power,0)){
                state.huntersSelected.push(move.hunter)
            }
        }
    }
}

export function resetSelectedHunters(state:GameView){
    delete state.huntersSelected
}