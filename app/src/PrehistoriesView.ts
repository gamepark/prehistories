import MoveType from '@gamepark/prehistories/moves/MoveType'
import MoveView from '@gamepark/prehistories/moves/MoveView'
import {Action, Game, Undo} from '@gamepark/rules-api'
import {playHuntCardInView} from '@gamepark/prehistories/moves/PlayHuntCard'
import SetCaveDisplayed, {setCaveDisplayed} from './localMoves/setCaveDisplayed'
import {revealHuntCardsInView} from '@gamepark/prehistories/moves/RevealHuntCards'
import {placeTile} from '@gamepark/prehistories/moves/PlaceTile'
import {spendHunter} from '@gamepark/prehistories/moves/SpendHunter'
import {validateSpentHunters} from '@gamepark/prehistories/moves/ValidateSpentHunters'
import {fulfillObjective, fulfillObjectiveMove} from '@gamepark/prehistories/moves/FulfillObjective'
import {refillHuntingBoardInView} from '@gamepark/prehistories/moves/RefillHuntingBoard'
import {endTurn} from '@gamepark/prehistories/moves/EndTurn'
import {takeBackPlayedCardsInView} from '@gamepark/prehistories/moves/TakeBackPlayedCards'
import {drawCardsInView} from '@gamepark/prehistories/moves/DrawCards'
import {shuffleDiscardPileInView} from '@gamepark/prehistories/moves/ShuffleDiscardPile'
import SetSelectedHunters, {resetSelectedHunters, ResetSelectedHunters, setSelectedHunters} from './localMoves/setSelectedHunters'
import PlayerColor from '@gamepark/prehistories/PlayerColor'
import canUndo from '@gamepark/prehistories/canUndo'
import GameLocalView from "./GameLocalView";
import {getHuntingPlayer} from "@gamepark/prehistories/types/HuntingPlayer";
import getBoardZones from "@gamepark/prehistories/material/BoardZones";
import {getFulfilledObjectives} from "@gamepark/prehistories/material/ObjectiveRules";

type LocalMove = MoveView | SetCaveDisplayed | SetSelectedHunters | ResetSelectedHunters

export default class PrehistoriesView implements Game<GameLocalView, MoveView>, Undo<GameLocalView, MoveView, PlayerColor> {
  state: GameLocalView

  constructor(state: GameLocalView) {
    this.state = state
  }

  getAutomaticMoves(): MoveView[] {
    const huntingPlayer = getHuntingPlayer(this.state)
    if (!huntingPlayer) return []
    if (huntingPlayer.isReady) {
      if (huntingPlayer.played.length !== 0) {
        return [{type: MoveType.TakeBackPlayedCards}]
      }
    } else if (huntingPlayer.hunting.hunt) {
      if (getBoardZones(this.state.players.length)[huntingPlayer.hunting.hunt.zone].safe <= huntingPlayer.hunting.hunt.huntersValue) {
        return [{type: MoveType.ValidateSpentHunters}]
      }
    } else if (huntingPlayer.hunting.tilesHunted > 0) {
      return [...getFulfilledObjectives(this.state).map(fulfillObjectiveMove)]
    }
    return []
  }

  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.PlayHuntCard:
        return playHuntCardInView(this.state, move)
      case MoveType.RevealHuntCards:
        return revealHuntCardsInView(this.state, move)
      case MoveType.PlaceTile:
        return placeTile(this.state, move)
      case MoveType.SpendHunter:
        return spendHunter(this.state, move)
      case MoveType.ValidateSpentHunters:
        return validateSpentHunters(this.state)
      case MoveType.FulfillObjective:
        return fulfillObjective(this.state, move)
      case MoveType.EndTurn:
        return endTurn(this.state, move)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCardsInView(this.state)
      case MoveType.DrawCards:
        return drawCardsInView(this.state, move)
      case MoveType.ShuffleDiscardPile:
        return shuffleDiscardPileInView(this.state, move)
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoardInView(this.state, move)
      case 'SetCaveDisplayed':
        return setCaveDisplayed(this.state, move)
      case 'SetSelectedHunters':
        return setSelectedHunters(this.state, move)
      case 'ResetSelectedHunters':
        return resetSelectedHunters(this.state)

    }
  }

  canUndo(action: Action<MoveView, PlayerColor>, consecutiveActions: Action<MoveView, PlayerColor>[]): boolean {
    return canUndo(action, consecutiveActions)
  }

  restoreLocalMoves(localState: GameLocalView) {
    this.state.caveDisplayed = localState.caveDisplayed
  }
}