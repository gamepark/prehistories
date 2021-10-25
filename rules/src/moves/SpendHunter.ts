import GameState from "../GameState";
import GameView from "../GameView";
import { getColoredDeck } from "../material/Hunters";
import PlayerState from "../PlayerState";
import { getFirstOfSortedPlayer, isPlayerView, isPlayerViewSelf, PlayerHuntView, PlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type SpendHunter = {
    type:MoveType.SpendHunter
    card:number
}

export default SpendHunter

export function spendHunter(state:GameState|GameView, move:SpendHunter){
    const player = getFirstOfSortedPlayer(state)
    if (!isPlayerView(player)){
        discardHunter(player, move.card)
        adjustHuntingLevels(player, move.card)
    }
}

function discardHunter(player:PlayerState | PlayerViewSelf | PlayerHuntView, card:number){
    player.played.splice(player.played.findIndex(c => c === card),1)
    player.discard.push(card)
}

function adjustHuntingLevels(player:PlayerState | PlayerViewSelf | PlayerHuntView, card:number){
    player.huntSpotTakenLevels![0] -= getColoredDeck(player.color)[card].power
    player.huntSpotTakenLevels![1] -= getColoredDeck(player.color)[card].power
}

export function isSpendHunter(move: Move |MoveView):move is SpendHunter{
    return move.type === MoveType.SpendHunter
}