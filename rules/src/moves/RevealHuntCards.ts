import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import Phase, { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer, isPlayerViewSelf, PlayerViewSelf } from "../types/PlayerView";
import teamPower from "../utils/teamPower";
import teamSpeed from "../utils/teamSpeed";
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
    getFirstOfSortedPlayer(state).hunting = {huntPhase : HuntPhase.Hunt,huntSpotTakenLevels:undefined,injuries:0,tilesHunted:0}
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
    state.sortedPlayers = sortPlayers(state.players as PlayerViewSelf[]) ;
    getFirstOfSortedPlayer(state).hunting = {huntPhase : HuntPhase.Hunt,huntSpotTakenLevels:undefined,injuries:0,tilesHunted:0}
}

export function isRevealHuntCards(move: Move | MoveView):move is RevealHuntCards{
    return move.type === MoveType.RevealHuntCards
}

function sortPlayers(players:PlayerState[] | PlayerViewSelf[]):PlayerColor[]{
    const result:(PlayerState | PlayerViewSelf)[] = []
    for (const elem of players){
        result.push(elem)
    }
    result.sort((a,b) => teamSpeed(b.played) - teamSpeed(a.played))
    result.sort((a,b) => teamPower(a.played) - teamPower(b.played))
    return result.map(p => p.color)
}