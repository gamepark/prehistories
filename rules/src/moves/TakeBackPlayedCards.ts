import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import { isPlayerHuntView, isPlayerViewSelf, PlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type TakeBackPlayedCards = {
    type:MoveType.TakeBackPlayedCards
    playerId:PlayerColor
    cards:number[]
}

export default TakeBackPlayedCards

export type TakeBackPlayedCardsView = {
    type:MoveType.TakeBackPlayedCards
    playerId:PlayerColor
    playedLength:number
}

export function takeBackPlayedCards(state:GameState, move:TakeBackPlayedCards){
    const player = state.players.find(p => p.color === move.playerId)!
    playerTakeBackPlayedCards(player)
}

export function takeBackPlayedCardsInView(state:GameView, move:TakeBackPlayedCards | TakeBackPlayedCardsView){
    if (isNotTakeBackPlayedCardsView(move)){
        playerTakeBackPlayedCards(state.players.find(isPlayerViewSelf)!)
    } else {
        const player = getPlayers(state).filter(isPlayerHuntView).find(p => p.color === move.playerId)!
        player.hand += move.playedLength
        getPlayers(state).find(p => p.color === move.playerId)!.played = 0 
    }
}

function playerTakeBackPlayedCards(player:PlayerState | PlayerViewSelf){
    player.hand = player.hand.concat(player.played)
    player.played = []
}

export function isTakeBackPlayedCards(move:Move):move is TakeBackPlayedCards{
    return move.type === MoveType.TakeBackPlayedCards
}

export function isNotTakeBackPlayedCardsView(move:TakeBackPlayedCards | TakeBackPlayedCardsView):move is TakeBackPlayedCards{
    return (move as TakeBackPlayedCards).cards !== undefined
}

export function isTakeBackPlayedCardsView(move:TakeBackPlayedCards | TakeBackPlayedCardsView):move is TakeBackPlayedCardsView{
    return (move as TakeBackPlayedCards).cards === undefined
}