import { GameSpeed } from "@gamepark/rules-api";
import GameState from "../GameState";
import GameView, { isGameView } from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";

export type PlayerView = Omit<PlayerState, 'deck'|'hand'|'played'> & {
    hand:number
    deck:number
    played:number
}

export type PlayerHuntView = Omit<PlayerState, 'deck'|'hand'> & {
    deck:number
    hand:number
}

export type PlayerViewSelf = Omit<PlayerState, 'deck'> & {
    deck:number
}

export function isPlayerState(state:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):state is PlayerState {
    return Array.isArray(state.deck)
}

export function isNotPlayerState(state:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):state is (PlayerView | PlayerViewSelf | PlayerHuntView) {
    return typeof state.deck === 'number'
}

export function isPlayerViewSelf(state:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):state is PlayerViewSelf {
    return Array.isArray(state.hand) && typeof state.deck === 'number' && Array.isArray(state.played)
}

export function isPlayerHuntView(state:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):state is PlayerHuntView {
    return typeof state.hand === 'number' && typeof state.deck === 'number' && Array.isArray(state.played)
}

export function isPlayerView(state:PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView):state is PlayerView {
    return typeof state.played === 'number'
}



export function getPlayers(state:GameState | GameView){
    return (state.players as (PlayerState | PlayerView | PlayerViewSelf |PlayerHuntView)[]) 
}

export function getFirstOfSortedPlayer(state:GameState | GameView):PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView{
    return getPlayers(state).find(p => p.color === state.sortedPlayers![0])! 
}

export function getPlayerWithColor(state:GameState | GameView, playerId:PlayerColor):PlayerState | PlayerView | PlayerViewSelf | PlayerHuntView{
    return getPlayers(state).find(p => p.color === playerId)!
}