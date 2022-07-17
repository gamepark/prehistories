import {DrawCardsView} from './DrawCards'
import Move from './Move'
import {PlayHuntCardView} from './PlayHuntCard'
import RefillHuntingBoard, {RefillHuntingBoardView} from './RefillHuntingBoard'
import RevealHuntCards, {RevealHuntCardsView} from './RevealHuntCards'

type MoveView = Exclude<Move, RevealHuntCards | RefillHuntingBoard> | PlayHuntCardView | RevealHuntCardsView | RefillHuntingBoardView | DrawCardsView

export default MoveView