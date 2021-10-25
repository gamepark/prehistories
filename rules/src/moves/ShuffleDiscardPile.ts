import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import { getFirstOfSortedPlayer, getPlayers, isNotPlayerState } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type ShuffleDiscardPile = {
    type:MoveType.ShuffleDiscardPile
    newDeck:number[]
}

export type ShuffleDiscardPileView = {
    type:MoveType.ShuffleDiscardPile
    newDeckLength:number
}

export default ShuffleDiscardPile

export function shuffleDiscardPile(state:GameState, move:ShuffleDiscardPile){
    const player = getFirstOfSortedPlayer(state) as PlayerState         // A way to remove the cast with overloading ?
    player.deck = move.newDeck.concat(player.deck)
    player.discard = []
}

export function shuffleDiscardPileInView(state:GameView, move:ShuffleDiscardPileView){
    const player = getPlayers(state).filter(isNotPlayerState).find(p => p.color === state.sortedPlayers![0])!
    player.deck += move.newDeckLength
    player.discard = []
}

export function isShuffleDiscardPile(move:Move|MoveView):move is ShuffleDiscardPile{
    return move.type === MoveType.ShuffleDiscardPile
}