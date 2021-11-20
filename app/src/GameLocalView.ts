import GameView from "@gamepark/prehistories/GameView";
import PlayerColor from "@gamepark/prehistories/PlayerColor";


type GameLocalView = GameView & {
  caveDisplayed?: PlayerColor
}


export default GameLocalView
