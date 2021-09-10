import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import PlayerColor from "../PlayerColor";
import { isNotPlayerState, isPlayerHuntView, isPlayerView, isPlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type ShuffleDiscardPile = {
    type:MoveType.ShuffleDiscardPile
    playerId:PlayerColor
    newDeck:number[]
}

export type ShuffleDiscardPileView = {
    type:MoveType.ShuffleDiscardPile
    playerId:PlayerColor
    newDeckLength:number
}

export default ShuffleDiscardPile

export function shuffleDiscardPile(state:GameState, move:ShuffleDiscardPile){
    const player = state.players.find(p => p.color === move.playerId)!
    player.deck = move.newDeck.concat(player.deck)
    player.discard = []
}

export function shuffleDiscardPileInView(state:GameView, move:ShuffleDiscardPileView){
    const player = getPlayers(state).filter(isNotPlayerState).find(p => p.color === move.playerId)!
    player.deck += move.newDeckLength
    player.discard = []
}

export function isShuffleDiscardPile(move:Move):move is ShuffleDiscardPile{
    return move.type === MoveType.ShuffleDiscardPile
}