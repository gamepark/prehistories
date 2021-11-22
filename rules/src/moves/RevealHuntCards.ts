import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import Phase, {HuntPhase} from "../types/Phase";
import {isPlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";
import {getNextPlayer} from "../utils/InitiativeRules";

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
    const firstPlayer = getNextPlayer(state);
    if (firstPlayer) {
        firstPlayer.hunting = {huntPhase : HuntPhase.Hunt,huntSpotTakenLevels:undefined,injuries:0,tilesHunted:0}
    }
}

export function revealHuntCardsInView(state:GameView, move:RevealHuntCardsView){
    state.players.forEach(p => {
        p.played = move.cardsPlayed.find(obj => obj.color === p.color)!.cards
        if(!isPlayerViewSelf(p)){
            p.hand -= p.played.length
        }
        delete p.isReady
    })
    state.phase = Phase.Hunt
    const firstPlayer = getNextPlayer(state);
    if (firstPlayer) {
        firstPlayer.hunting = {huntPhase: HuntPhase.Hunt, huntSpotTakenLevels: undefined, injuries: 0, tilesHunted: 0}
    }
}

export function isRevealHuntCards(move: Move | MoveView):move is RevealHuntCards{
    return move.type === MoveType.RevealHuntCards
}
