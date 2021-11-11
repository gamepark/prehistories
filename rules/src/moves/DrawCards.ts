import GameState from "../GameState";
import GameView from "../GameView";
import {howManyCardToDraw} from "../Prehistories";
import {HuntPhase} from "../types/Phase";
import {getFirstOfSortedPlayer, getPlayers, isPlayerView, isPlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type DrawCards = {
    type:MoveType.DrawCards
    cards:number[]
}

export default DrawCards

export type DrawCardsView = {
    type:MoveType.DrawCards
    cards:number
}

export function drawCards(state:GameState){
    const player = getFirstOfSortedPlayer(state)
    player.hand.push(...player.deck.splice(0, Math.min(howManyCardToDraw(player), player.deck.length)))
    player.hunting!.huntPhase = HuntPhase.ChangeActivePlayer
}

export function drawCardsInView(state:GameView, move:DrawCards|DrawCardsView){
    if (!isDrawCardsView(move)){
        const player = getPlayers(state).filter(isPlayerViewSelf).find(p => p.color === state.sortedPlayers![0])!
        player.hand = player.hand.concat(move.cards.filter(elem => elem !== undefined && elem !== null))
        player.deck = Math.max(player.deck-howManyCardToDraw(player),0)
        player.hunting!.huntPhase = HuntPhase.ChangeActivePlayer
    } else {
        const player = getPlayers(state).filter(isPlayerView).find(p => p.color === state.sortedPlayers![0])!
        player.hand = Math.min(player.hand + howManyCardToDraw(player),player.hand+player.deck)
        player.deck = Math.max(player.deck -howManyCardToDraw(player),0)
        player.hunting!.huntPhase = HuntPhase.ChangeActivePlayer
    }
}

export function isDrawCards(move:Move| MoveView):move is DrawCards{
    return move.type === MoveType.DrawCards
}

export function isDrawCardsView(move:DrawCards | DrawCardsView): move is DrawCardsView{
    return typeof move.cards === 'number'
}