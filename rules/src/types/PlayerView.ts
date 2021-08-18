import PlayerState from "../PlayerState";

export type PlayerView = Omit<PlayerState, 'deck'|'hand'|'played'> & {
    hand:number
    deck:number
    played:number
}

export type PlayerViewSelf = Omit<PlayerState, 'deck'> & {
    deck:number
}

export function isPlayerState(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerState {
    return Array.isArray(state.deck)
}

export function isPlayerViewSelf(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerViewSelf {
    return Array.isArray(state.hand) && typeof state.deck === 'number'
}

export function isPlayerView(state:PlayerState | PlayerView | PlayerViewSelf):state is PlayerView {
    return typeof state.hand === 'number'
}