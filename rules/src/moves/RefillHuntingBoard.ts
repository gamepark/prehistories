import GameState from "../GameState";
import GameView from "../GameView";
import Phase from "../types/Phase";
import MoveType from "./MoveType";

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
    newBoard.forEach((tile, spot) => {
      if (tile === null){
        newBoard[spot] = getNewTile(state.players.length, spot, tilesDeck)
      }
    })
    state.huntingBoard = newBoard
}

export function refillHuntingBoard(state:GameState){
    
    fillHuntingBoard(state)
    delete state.sortedPlayers
    state.phase = Phase.Initiative
}

export function refillHuntingBoardInView(state: GameView, move:RefillHuntingBoardView){
    state.huntingBoard.forEach((spot, index) => {
      if (spot === null && state.tilesDeck[index] !== 0){
        state.tilesDeck[index]--
      }
    })
    state.huntingBoard = move.newBoard
    delete state.sortedPlayers
    state.phase = Phase.Initiative
}

function getNewTile(nbPlayers:number, spot:number, tilesDeck:number[][]):number|null{
    switch(spot){
      case 0 :
        return nbPlayers < 4 ? isTileDeckEmpty(0, tilesDeck) : isTileDeckEmpty(0, tilesDeck)
      case 1 :
        return nbPlayers < 4 ? isTileDeckEmpty(1, tilesDeck) : isTileDeckEmpty(0, tilesDeck)
      case 2 :
        return nbPlayers < 4 ? isTileDeckEmpty(2, tilesDeck) : isTileDeckEmpty(1, tilesDeck)
      case 3 :
        return nbPlayers < 4 ? isTileDeckEmpty(3, tilesDeck) : isTileDeckEmpty(1, tilesDeck)
      case 4 :
        return nbPlayers < 4 ? isTileDeckEmpty(4, tilesDeck) : isTileDeckEmpty(2, tilesDeck)
      case 5 :
        return nbPlayers < 4 ? null : isTileDeckEmpty(3, tilesDeck)
      case 6 :
        return nbPlayers < 4 ? null : isTileDeckEmpty(4, tilesDeck)
      default:
        return null
    }
  }
  
  function isTileDeckEmpty(pile:number, tileDeck:number[][]):number|null{
      return tileDeck[pile].length !== 0 ? tileDeck[pile].pop()! : null
  }