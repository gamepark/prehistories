import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import PlayerColor from "../PlayerColor";
import { howManyCardToDraw } from "../Prehistories";
import { HuntPhase } from "../types/Phase";
import { isPlayerHuntView, isPlayerView, isPlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type DrawXCards = {
    type:MoveType.DrawXCards
    playerId:PlayerColor
    cards:number[]
}

export default DrawXCards

export type DrawXCardsView = {
    playerId:PlayerColor
    type:MoveType.DrawXCards
}

export function drawXCards(state:GameState, move:DrawXCards){
    const player = state.players.find(p => p.color === move.playerId)!
    for (let i=0;i<howManyCardToDraw(player);i++){
        if (player.deck.length !== 0){
            player.hand.push(player.deck.pop()!)
        }
    }
    player.huntPhase = HuntPhase.ChangeActivePlayer
}

export function drawXCardsInView(state:GameView, move:DrawXCards|DrawXCardsView){
    if (isNotDrawXCardsView(move)){
        const player = getPlayers(state).filter(isPlayerViewSelf).find(p => p.color === move.playerId)!
        player.hand = player.hand.concat(move.cards.filter(elem => elem !== undefined && elem !== null))
        player.deck = Math.max(player.deck-howManyCardToDraw(player),0)
        player.huntPhase = HuntPhase.ChangeActivePlayer
    } else {

        if (getPlayers(state).filter(isPlayerView).find(p => p.color === move.playerId) === undefined){
            getPlayers(state).find(p => p.color === move.playerId)!.played = 0
        }
        const player = getPlayers(state).filter(isPlayerView).find(p => p.color === move.playerId)!
        player.hand = Math.min(player.hand + howManyCardToDraw(player),player.hand+player.deck)
        player.deck = Math.max(player.deck -howManyCardToDraw(player),0)
        player.huntPhase = HuntPhase.ChangeActivePlayer
    }
}

export function isDrawXCards(move:Move| MoveView):move is DrawXCards{
    return move.type === MoveType.DrawXCards
}

export function isDrawXCardsView(move:DrawXCards | DrawXCardsView): move is DrawXCards{
    return (move as DrawXCards).cards === undefined
}

export function isNotDrawXCardsView(move:DrawXCards | DrawXCardsView): move is DrawXCards{
    return (move as DrawXCards).cards !== undefined
}