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