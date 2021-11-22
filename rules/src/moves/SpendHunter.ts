import GameState from "../GameState";
import GameView from "../GameView";
import {getColoredDeck} from "../material/Hunters";
import PlayerState from "../PlayerState";
import {PlayerView, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";
import HuntingPlayer, {getHuntingPlayer} from "../types/HuntingPlayer";

type SpendHunter = {
    type:MoveType.SpendHunter
    card:number
}

export default SpendHunter

export function spendHunter(state:GameState|GameView, move:SpendHunter){
    const player = getHuntingPlayer(state)!
    discardHunter(player, move.card)
    adjustHuntingLevels(player, move.card)

}

function discardHunter(player:PlayerState | PlayerViewSelf | PlayerView, card:number){
    player.played.splice(player.played.findIndex(c => c === card),1)
    player.discard.push(card)
}

function adjustHuntingLevels(player: HuntingPlayer, card:number){
    player.hunting!.huntSpotTakenLevels![0] -= getColoredDeck(player.color)[card].power
    player.hunting!.huntSpotTakenLevels![1] -= getColoredDeck(player.color)[card].power
}

export function isSpendHunter(move: Move |MoveView):move is SpendHunter{
    return move.type === MoveType.SpendHunter
}