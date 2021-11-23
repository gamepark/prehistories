import GameState from "../GameState";
import GameView from "../GameView";
import MoveType from "./MoveType";
import getBoardZones from "../material/BoardZones";

type RefillHuntingBoard = {
    type:MoveType.RefillHuntingBoard
}

export type RefillHuntingBoardView = RefillHuntingBoard & {
    newBoard:(number|null)[]
}

export default RefillHuntingBoard

export function isRefillHuntingBoardView(move: RefillHuntingBoard | RefillHuntingBoardView): move is RefillHuntingBoardView{
    return (move as RefillHuntingBoardView).newBoard !== undefined
}

export function fillHuntingBoard(state:GameState){
    const newBoard = state.huntingBoard
    const tilesDeck = state.tilesDeck
    newBoard.forEach((tile, zone) => {
      if (tile === null){
        newBoard[zone] = getNewTile(state.players.length, zone, tilesDeck, false, undefined)
      }
    })
    state.huntingBoard = newBoard
}

export function refillHuntingBoard(state:GameState){
    fillHuntingBoard(state)
}

export function refillHuntingBoardInView(state: GameView, move:RefillHuntingBoardView){
    removeFirstTileOfEmptySlots(state);
    state.huntingBoard = move.newBoard
}

function removeFirstTileOfEmptySlots(state: GameView) {
  state.huntingBoard.forEach((zone, index) => {
    if (zone === null && state.tilesDeck[index] !== 0) {
      if (state.players.length < 4) {
        state.tilesDeck[index]--;
      } else {
        if (index < 2) {
          state.tilesDeck[0]--;
        } else if (index < 4) {
          state.tilesDeck[1]--;
        } else {
          state.tilesDeck[index - 2]--;
        }
      }
    }
  });
}

export function getNewTile(nbPlayers:number, zone:number, tilesDeck:number[][], isView:boolean, previousState:undefined|(number|null)[]):number|null{
    switch(zone){
      case 0 :
        return nbPlayers < 4 ? isTileDeckEmpty(0, tilesDeck, isView, false) : isTileDeckEmpty(0, tilesDeck, isView, false)
      case 1 :
        return nbPlayers < 4 ? isTileDeckEmpty(1, tilesDeck, isView, false) : isTileDeckEmpty(0, tilesDeck, isView, previousState !== undefined && previousState[0] === null)
      case 2 :
        return nbPlayers < 4 ? isTileDeckEmpty(2, tilesDeck, isView, false) : isTileDeckEmpty(1, tilesDeck, isView, false)
      case 3 :
        return nbPlayers < 4 ? isTileDeckEmpty(3, tilesDeck, isView, false) : isTileDeckEmpty(1, tilesDeck, isView, previousState !== undefined && previousState[2] === null)
      case 4 :
        return nbPlayers < 4 ? isTileDeckEmpty(4, tilesDeck, isView, false) : isTileDeckEmpty(2, tilesDeck, isView, false)
      case 5 :
        return nbPlayers < 4 ? null : isTileDeckEmpty(3, tilesDeck, isView, false)
      case 6 :
        return nbPlayers < 4 ? null : isTileDeckEmpty(4, tilesDeck, isView, false)
      default:
        return null
    }
  }

function isTileDeckEmpty(pile: number, tileDeck: number[][], isView: boolean, mustTakeSecond: boolean): number | null {
  if (isView === false) {
    return tileDeck[pile].length !== 0 ? tileDeck[pile].pop()! : null
  } else {
    return tileDeck[pile].length !== 0 ? (mustTakeSecond === false ? tileDeck[pile][tileDeck[pile].length - 1] : tileDeck[pile][tileDeck[pile].length - 2]) : null
  }
}

export function canRefillBoard(game: GameState) {
  return game.huntingBoard.some((space, index) => space === null && game.tilesDeck[getBoardZones(game.players.length)[index].type].length > 0)
}
