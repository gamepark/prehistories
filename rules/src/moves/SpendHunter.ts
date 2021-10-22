import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { getColoredDeck } from "../material/Hunters";
import { isPlayerHuntView, isPlayerState, isPlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type SpendHunter = {
    type:MoveType.SpendHunter
    card:number
}

export default SpendHunter

export function spendHunter(state:GameState|GameView, move:SpendHunter){
    const player = isGameView(state) ? getPlayers(state).find(p => p.color === state.sortedPlayers![0])! : state.players.find(p => p.color === state.sortedPlayers![0])!
    if (isPlayerState(player) || isPlayerHuntView(player) || isPlayerViewSelf(player)){
        player.played.splice(player.played.findIndex(card => card === move.card),1)
        player.discard.push(move.card)
        player.huntSpotTakenLevels![0] -= getColoredDeck(state.sortedPlayers![0])[move.card].power
        player.huntSpotTakenLevels![1] -= getColoredDeck(state.sortedPlayers![0])[move.card].power
    }

}

export function isSpendHunter(move: Move |MoveView):move is SpendHunter{
    return move.type === MoveType.SpendHunter
}