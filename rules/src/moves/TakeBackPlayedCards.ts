import GameState from "../GameState";
import GameView from "../GameView";
import PlayerState from "../PlayerState";
import {getFirstOfSortedPlayer, isPlayerViewSelf, PlayerViewSelf} from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";

type TakeBackPlayedCards = {
    type:MoveType.TakeBackPlayedCards
}

export default TakeBackPlayedCards

export function takeBackPlayedCards(state:GameState){
    const player = getFirstOfSortedPlayer(state)
    playerTakeBackPlayedCards(player)
}

export function takeBackPlayedCardsInView(state:GameView){
    const player = getFirstOfSortedPlayer(state)
    if (isPlayerViewSelf(player)) {
        playerTakeBackPlayedCards(player)
    } else {
        player.hand += player.played.length
        player.played = []
    }
}

function playerTakeBackPlayedCards(player:PlayerState | PlayerViewSelf){
    player.hand = player.hand.concat(player.played)
    player.played = []
}

export function isTakeBackPlayedCards(move:Move):move is TakeBackPlayedCards{
    return move.type === MoveType.TakeBackPlayedCards
}
