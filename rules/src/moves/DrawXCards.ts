import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import { howManyCardToDraw } from "../Prehistories";
import { HuntPhase } from "../types/Phase";
import { getFirstOfSortedPlayer, getPlayers, isPlayerView, isPlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type DrawXCards = {
    type:MoveType.DrawXCards
    cards:number[]
}

export default DrawXCards

export type DrawXCardsView = {
    type:MoveType.DrawXCards
    cards:number
}

export function drawXCards(state:GameState){
    const player = getFirstOfSortedPlayer(state) as PlayerState
    for (let i=0;i<howManyCardToDraw(player);i++){
        player.hand.push(player.deck.pop()!)
    }
    player.huntPhase = HuntPhase.ChangeActivePlayer
}

export function drawXCardsInView(state:GameView, move:DrawXCards|DrawXCardsView){
    if (!isDrawXCardsView(move)){
        const player = getPlayers(state).filter(isPlayerViewSelf).find(p => p.color === state.sortedPlayers![0])!
        player.hand = player.hand.concat(move.cards.filter(elem => elem !== undefined && elem !== null))
        player.deck = Math.max(player.deck-howManyCardToDraw(player),0)
        player.huntPhase = HuntPhase.ChangeActivePlayer
    } else {

        if (getPlayers(state).filter(isPlayerView).find(p => p.color === state.sortedPlayers![0]) === undefined){
            getPlayers(state).find(p => p.color === state.sortedPlayers![0])!.played = 0
        }
        const player = getPlayers(state).filter(isPlayerView).find(p => p.color === state.sortedPlayers![0])!
        player.hand = Math.min(player.hand + howManyCardToDraw(player),player.hand+player.deck)
        player.deck = Math.max(player.deck -howManyCardToDraw(player),0)
        player.huntPhase = HuntPhase.ChangeActivePlayer
    }
}

export function isDrawXCards(move:Move| MoveView):move is DrawXCards{
    return move.type === MoveType.DrawXCards
}

export function isDrawXCardsView(move:DrawXCards | DrawXCardsView): move is DrawXCardsView{
    return typeof move.cards === 'number'
}