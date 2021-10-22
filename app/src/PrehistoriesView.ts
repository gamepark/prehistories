import GameView from '@gamepark/prehistories/GameView'
import MoveType from '@gamepark/prehistories/moves/MoveType'
import MoveView from '@gamepark/prehistories/moves/MoveView'
import {Game} from '@gamepark/rules-api'
import {playHuntCardInView} from '@gamepark/prehistories/moves/PlayHuntCard'
import { tellYouAreReady } from '@gamepark/prehistories/moves/TellYouAreReady'
import SetCaveDisplayed, { setCaveDisplayed } from './localMoves/setCaveDisplayed'
import { revealHuntCardsInView } from '@gamepark/prehistories/moves/RevealHuntCards'
import { playPolyomino } from '@gamepark/prehistories/moves/PlayPolyomino'
import { spendHunter } from '@gamepark/prehistories/moves/SpendHunter'
import { validateSpendedHunters } from '@gamepark/prehistories/moves/ValidateSpendedHunters'
import { resolvePermanentObjectives } from '@gamepark/prehistories/moves/CheckPermanentObjectives'
import { resolveVariableObjectives } from '@gamepark/prehistories/moves/CheckVariableObjectives'
import { refillHuntingBoardInView } from '@gamepark/prehistories/moves/RefillHuntingBoard'
import { endTurn } from '@gamepark/prehistories/moves/EndTurn'
import { takeBackPlayedCardsInView } from '@gamepark/prehistories/moves/TakeBackPlayedCards'
import { drawXCardsInView } from '@gamepark/prehistories/moves/DrawXCards'
import { shuffleDiscardPileInView } from '@gamepark/prehistories/moves/ShuffleDiscardPile'
import { changeActivePlayer } from '@gamepark/prehistories/moves/ChangeActivePlayer'
import { endGame } from '@gamepark/prehistories/moves/EndGame'
import { setHuntPhase } from '@gamepark/prehistories/moves/SetHuntPhase'
import SetSelectedHunters, { resetSelectedHunters, ResetSelectedHunters, setSelectedHunters } from './localMoves/setSelectedHunters'

type LocalMove = MoveView | SetCaveDisplayed | SetSelectedHunters | ResetSelectedHunters

export default class PrehistoriesView implements Game<GameView, MoveView> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  getAutomaticMove(): void | MoveView {
    return
  }

  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.PlayHuntCard:
        return playHuntCardInView(this.state, move)
      case MoveType.TellYouAreReady:
        return tellYouAreReady(this.state, move)
      case MoveType.RevealHuntCards:
        return revealHuntCardsInView(this.state, move)
      case MoveType.PlayPolyomino:
        return playPolyomino(this.state, move)
      case MoveType.SpendHunter:
        return spendHunter(this.state, move)
      case MoveType.ValidateSpendedHunters:
        return validateSpendedHunters(this.state)
      case MoveType.ResolvePermanentObjectives:
        return resolvePermanentObjectives(this.state, move)
      case MoveType.ResolveVariableObjectives:
        return resolveVariableObjectives(this.state, move)
      case MoveType.SetHuntPhase:
        return setHuntPhase(this.state);
      case MoveType.EndTurn:
        return endTurn(this.state)
      case MoveType.TakeBackPlayedCards:
        return takeBackPlayedCardsInView(this.state, move)
      case MoveType.DrawXCards:
        return drawXCardsInView(this.state, move)
      case MoveType.ShuffleDiscardPile:
        return shuffleDiscardPileInView(this.state, move)
      case MoveType.ChangeActivePlayer:
        return changeActivePlayer(this.state)
      case MoveType.RefillHuntingBoard:
        return refillHuntingBoardInView(this.state, move)
      case MoveType.EndGame:
        return endGame(this.state)
      case 'SetCaveDisplayed':
        return setCaveDisplayed(this.state, move)
      case 'SetSelectedHunters':
        return setSelectedHunters(this.state, move)
      case 'ResetSelectedHunters':
        return resetSelectedHunters(this.state)
      
    }
  }

}