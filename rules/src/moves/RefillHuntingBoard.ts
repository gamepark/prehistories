import GameState from "../GameState";
import GameView from "../GameView";
import MoveType from "./MoveType";
import getBoardZones from "../material/BoardZones";
import Tile from "../material/Tile";

type RefillHuntingBoard = {
  type: MoveType.RefillHuntingBoard
}

export type RefillHuntingBoardView = RefillHuntingBoard & {
  newBoard: (Tile | null)[]
}

export default RefillHuntingBoard

export function isRefillHuntingBoardView(move: RefillHuntingBoard | RefillHuntingBoardView): move is RefillHuntingBoardView {
  return move.hasOwnProperty('newBoard')
}

export function refillHuntingBoard(game: GameState) {
  for (let zone = 0; zone < game.huntingBoard.length; zone++) {
    if (game.huntingBoard[zone] === null) {
      const tilesDeck = game.tilesDecks[getBoardZones(game.players.length)[zone].type]
      game.huntingBoard[zone] = tilesDeck.pop() ?? null
    }
  }
}

export function refillHuntingBoardInView(game: GameView, move: RefillHuntingBoardView) {
  for (let zone = 0; zone < game.huntingBoard.length; zone++) {
    if (game.huntingBoard[zone] === null) {
      const tilesType = getBoardZones(game.players.length)[zone].type;
      if (game.tilesDecks[tilesType] > 0) {
        game.tilesDecks[tilesType]--
      }
    }
  }
  game.huntingBoard = move.newBoard
}

export function canRefillBoard(game: GameState) {
  return game.huntingBoard.some((space, index) => space === null && game.tilesDecks[getBoardZones(game.players.length)[index].type].length > 0)
}
