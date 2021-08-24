import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import Phase from "../types/Phase";
import { PlayerHuntView, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import teamPower from "../utils/teamPower";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type RevealHuntCards = {
    type: MoveType.RevealHuntCards
}

export default RevealHuntCards

type CardsPlayedObject = {color:PlayerColor, cards:number[]}

export type RevealHuntCardsView = RevealHuntCards & {
    cardsPlayed: CardsPlayedObject[]
}

export function revealHuntCards(state:GameState){
    state.phase = Phase.Hunt
    state.players.forEach(p => delete p.isReady)
    state.sortedPlayers = sortPlayers(state.players)
}

export function revealHuntCardsInView(state:GameView, move:RevealHuntCardsView){
    state.players.forEach(p => {
        p.played = move.cardsPlayed.find(obj => obj.color === p.color)!.cards
        delete p.isReady
    })
    state.phase = Phase.Hunt
    state.sortedPlayers = sortPlayers(state.players as PlayerState[] | (PlayerViewSelf | PlayerHuntView)[])
}

export function isRevealHuntCards(move: Move |MoveView):move is RevealHuntCards{
    return move.type === MoveType.RevealHuntCards
}

function sortPlayers(players:PlayerState[] | (PlayerViewSelf | PlayerHuntView)[]):PlayerColor[]{
    const result:(PlayerState | PlayerViewSelf | PlayerHuntView)[] = players
    result.sort((a,b) => teamPower(a.played) - teamPower(b.played))
    return result.map(p => p.color)
}