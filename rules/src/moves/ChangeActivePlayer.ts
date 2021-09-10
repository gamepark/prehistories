import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import Phase, { HuntPhase } from "../types/Phase";
import MoveType from "./MoveType";

type ChangeActivePlayer = {
    type:MoveType.ChangeActivePlayer
}

export default ChangeActivePlayer

export function changeActivePlayer(state:GameState|GameView, move:ChangeActivePlayer){
    console.log("dans changeActivePlayer")
    const passingPlayer = getPlayers(state).find(p => p.color === state.sortedPlayers![0])! 
    delete passingPlayer.huntPhase
    delete passingPlayer.huntSpotTakenLevels
    delete passingPlayer.injuries
    delete passingPlayer.isReady
    delete passingPlayer.tilesHunted
    state.sortedPlayers!.shift()
    if (state.sortedPlayers!.length !== 0){
        getPlayers(state).find(p => p.color === state.sortedPlayers![0])!.huntPhase = HuntPhase.Hunt
    } 
    console.log("sortedPlayer after shift", state.sortedPlayers)
}