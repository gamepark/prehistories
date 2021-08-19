import GameView from '@gamepark/prehistories/GameView'
import MoveType from '@gamepark/prehistories/moves/MoveType'
import MoveView from '@gamepark/prehistories/moves/MoveView'
import {Game} from '@gamepark/rules-api'
import {playHuntCardInView} from '@gamepark/prehistories/moves/PlayHuntCard'
import { tellYouAreReady } from '@gamepark/prehistories/moves/TellYouAreReady'
import SetCaveDisplayed, { setCaveDisplayed } from './localMoves/setCaveDisplayed'
import { revealHuntCardsInView } from '@gamepark/prehistories/moves/RevealHuntCards'

type LocalMove = MoveView | SetCaveDisplayed

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
      case 'SetCaveDisplayed':
        return setCaveDisplayed(this.state, move)
    }
  }

}