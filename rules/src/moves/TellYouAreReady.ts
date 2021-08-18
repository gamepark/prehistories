import GameState from "../GameState";
import GameView, { getPlayers } from "../GameView";
import PlayerColor from "../PlayerColor";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type TellYouAreReady = {
    type: MoveType.TellYouAreReady
    playerId: PlayerColor
}

export default TellYouAreReady

export function tellYouAreReady(state:GameState|GameView, move:TellYouAreReady){
    const player = getPlayers(state).find(p => p.color === move.playerId)!
    player.isReady = true
}

export function isTellYouAreReady(move:Move|MoveView):move is TellYouAreReady{
    return (move as TellYouAreReady).type === MoveType.TellYouAreReady
}
