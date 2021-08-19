import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import Phase from "../types/Phase";
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
}

export function revealHuntCardsInView(state:GameView, move:RevealHuntCardsView){
    state.players.forEach(p => {
        p.played = move.cardsPlayed.find(obj => obj.color === p.color)!.cards
    })
    state.phase = Phase.Hunt
}

export function isRevealHuntCards(move: Move |MoveView):move is RevealHuntCards{
    return move.type === MoveType.RevealHuntCards
}