import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import { getFirstOfSortedPlayer, getPlayers, isPlayerView, isPlayerViewSelf, PlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type TakeBackPlayedCards = {
    type:MoveType.TakeBackPlayedCards
}

export default TakeBackPlayedCards

export type TakeBackPlayedCardsView = {
    type:MoveType.TakeBackPlayedCards
    playedLength:number
}

export function takeBackPlayedCards(state:GameState){
    const player = getFirstOfSortedPlayer(state)
    playerTakeBackPlayedCards(player)
}

export function takeBackPlayedCardsInView(state:GameView, move:TakeBackPlayedCards | TakeBackPlayedCardsView){
    if (!isTakeBackPlayedCardsView(move)){
        playerTakeBackPlayedCards(state.players.find(isPlayerViewSelf)!)
    } else {
        const player = getPlayers(state).filter(isPlayerView).find(p => p.color === state.sortedPlayers![0])!
        player.hand += move.playedLength
        getFirstOfSortedPlayer(state).played = []
    }
}

function playerTakeBackPlayedCards(player:PlayerState | PlayerViewSelf){
    player.hand = player.hand.concat(player.played)
    player.played = []
}

export function isTakeBackPlayedCards(move:Move):move is TakeBackPlayedCards{
    return move.type === MoveType.TakeBackPlayedCards
}

export function isTakeBackPlayedCardsView(move:TakeBackPlayedCards | TakeBackPlayedCardsView):move is TakeBackPlayedCardsView{
    return (move as TakeBackPlayedCardsView).playedLength !== undefined
}