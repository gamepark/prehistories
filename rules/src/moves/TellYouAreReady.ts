import GameState from "../GameState";
import GameView from "../GameView";
import PlayerColor from "../PlayerColor";
import { getPlayerWithColor } from "../types/PlayerView";
import Move from "./Move";
import MoveType from "./MoveType";
import MoveView from "./MoveView";

type TellYouAreReady = {
    type: MoveType.TellYouAreReady
    playerId: PlayerColor
}

export default TellYouAreReady

export function tellYouAreReady(state:GameState|GameView, move:TellYouAreReady){
    getPlayerWithColor(state, move.playerId).isReady = true
}

export function isTellYouAreReady(move:Move|MoveView):move is TellYouAreReady{
    return (move as TellYouAreReady).type === MoveType.TellYouAreReady
}
