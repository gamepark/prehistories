import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";

export type PlayerView = Omit<PlayerState, 'deck'|'hand'> & {
    hand:number
    deck:number
}

export type PlayerViewSelf = Omit<PlayerState, 'deck'> & {
    deck:number
}

export function isPlayerState(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerState {
    return Array.isArray(state.deck)
}

export function isNotPlayerState(state:PlayerState | PlayerView | PlayerViewSelf):state is (PlayerView | PlayerViewSelf) {
    return typeof state.deck === 'number'
}

export function isPlayerViewSelf(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerViewSelf {
    return Array.isArray(state.hand) && typeof state.deck === 'number' && Array.isArray(state.played)
}

export function isPlayerView(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerView {
    return typeof state.hand === 'number'
}

export function getPlayers(state:GameState | GameView){
    return (state.players as (PlayerState | PlayerView | PlayerViewSelf)[])
}

export function getPlayerWithColor(state:GameState | GameView, playerId:PlayerColor):PlayerState | PlayerView | PlayerViewSelf{
    return getPlayers(state).find(p => p.color === playerId)!
}