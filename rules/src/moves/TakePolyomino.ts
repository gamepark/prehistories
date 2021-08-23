import GameState from "../GameState";
import GameView, { getPlayers, isGameView } from "../GameView";
import { getColoredDeck } from "../material/Hunters";
import PlayerColor from "../PlayerColor";
import { isPlayerHuntView, isPlayerViewSelf, PlayerHuntView, PlayerViewSelf } from "../types/PlayerView";
import MoveType from "./MoveType";

type TakePolyomino = {
    type:MoveType.TakePolyomino
    polyomino:number
    huntSpot:number
    hunters:number[]
    playerId:PlayerColor
}

export default TakePolyomino

export function takePolyomino(state:GameState|GameView, move:TakePolyomino){
    const player = isGameView(state) ? (getPlayers(state).filter(p => isPlayerHuntView(p) || isPlayerViewSelf(p)) as (PlayerHuntView | PlayerViewSelf)[]).find(p => p.color === move.playerId)! : state.players.find(p => p.color === move.playerId)!
    move.hunters.forEach(card => player.played.splice(move.hunters.findIndex(h => h === card),1))
    player.tilesInHand === undefined ? player.tilesInHand = [move.polyomino] : player.tilesInHand.push(move.polyomino)
    state.huntingBoard.splice(move.huntSpot,1)
    if (teamPower(move.hunters) < powerLevels(state.players.length, move.huntSpot)[1]){
        player.injuries === undefined ? player.injuries = 1 : player.injuries++
    }
}

/**
 * @return an array of two numbers : first is the smallest limit to hunt, second is the power to hunt without a injury
 */
export function powerLevels(nbPlayers:number, spot:number):number[]{
    switch (spot){
        case 0:
            return nbPlayers < 4 ? [1,4] : [2,3]
        case 1:
            return nbPlayers < 4 ? [4,7] : [1.4]
        case 2:
            return nbPlayers < 4 ? [7,10] : [4,7]
        case 3:
            return nbPlayers < 4 ? [10,13] : [5.8]
        case 4:
            return nbPlayers < 4 ? [13,15] : [7,10]
        case 5:
            return nbPlayers < 4 ? [] : [10,13]
        case 6:
            return nbPlayers < 4 ? [] : [13,16]
        default: return []
    }
}

export function teamPower(hunters:number[]):number{
    return hunters.length === 0 ? 0 : hunters.reduce((acc, hunter ) => acc + getColoredDeck(PlayerColor.Yellow)[hunter].power)
}
