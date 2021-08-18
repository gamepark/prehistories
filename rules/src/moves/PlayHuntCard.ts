import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import PlayerColor from "../PlayerColor";
import PlayerState from "../PlayerState";
import { isPlayerState, isPlayerView, isPlayerViewSelf, PlayerView, PlayerViewSelf } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type PlayHuntCard = {
    type: MoveType.PlayHuntCard
    card:number
    playerId:PlayerColor
}

export default PlayHuntCard

export type PlayHuntCardView = {
    type:MoveType.PlayHuntCard
    playerId:PlayerColor
}

export function playHuntCard(state:GameState, move:PlayHuntCard){
    const player = state.players.find(p => p.color === move.playerId)!
    playerPlayHuntCard(player, move)
}

function playerPlayHuntCard(player:PlayerState|PlayerViewSelf, move:PlayHuntCard){
    player.hand.splice(player.hand.findIndex(card => move.card === card),1)
    player.played.push(move.card)
}

export function playHuntCardInView(state:GameView,move:PlayHuntCard | PlayHuntCardView){
    if (isPlayHuntCardNotView(move)){
        playerPlayHuntCard(state.players.find(isPlayerViewSelf)!, move)
    } else {
        const player = getPlayers(state).filter(isPlayerView).find(p => p.color === move.playerId)!
        player.hand--
        player.played++
    }
}

export function isPlayHuntCardView(move:PlayHuntCardView | PlayHuntCard):move is PlayHuntCardView{
    return (move as PlayHuntCard).card === undefined
}

export function isPlayHuntCardNotView(move:PlayHuntCardView |PlayHuntCard): move is PlayHuntCard{
    return (move as PlayHuntCard).card !== undefined
}

export function isPlayHuntCard(move:Move|MoveView):move is PlayHuntCard{
    return move.type === MoveType.PlayHuntCard
}