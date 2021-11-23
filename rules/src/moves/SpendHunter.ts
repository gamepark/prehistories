import GameState from "../GameState";
import GameView from "../GameView";
import {getColoredDeck} from "../material/Hunters";
import PlayerState from "../PlayerState";
import {PlayerView, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";
import {getHuntingPlayer} from "../types/HuntingPlayer";

type SpendHunter = {
    type:MoveType.SpendHunter
    card:number
}

export default SpendHunter

export function spendHunter(state:GameState|GameView, move:SpendHunter){
    const player = getHuntingPlayer(state)!
    discardHunter(player, move.card)
    player.hunting.hunt!.huntersValue += getColoredDeck(player.color)[move.card].power
}

function discardHunter(player:PlayerState | PlayerViewSelf | PlayerView, card:number){
    player.played.splice(player.played.findIndex(c => c === card),1)
    player.discard.push(card)
}

export function isSpendHunter(move: Move |MoveView):move is SpendHunter{
    return move.type === MoveType.SpendHunter
}